import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { google } from "googleapis";
import { CICLO_LECTIVO } from "./constants";
import { mapToSheetRow, SHEET_HEADERS } from "./map-row";
import type { InscripcionForm } from "./schema";

export type PersistResult = {
  legajo: string;
  provider: "google" | "local";
  fila: number;
};

function nextLegajo(existingCount: number) {
  return `CEF-${CICLO_LECTIVO}-${String(existingCount + 1).padStart(4, "0")}`;
}

export async function persistInscripcion(
  data: InscripcionForm,
): Promise<PersistResult> {
  const provider = process.env.SHEETS_PROVIDER ?? "google";
  if (provider === "local" || !process.env.GOOGLE_SHEETS_SPREADSHEET_ID) {
    return persistLocal(data);
  }
  return persistGoogle(data);
}

async function persistLocal(data: InscripcionForm): Promise<PersistResult> {
  const dir = path.join(process.cwd(), "data");
  const file = path.join(dir, "inscripciones.json");
  await mkdir(dir, { recursive: true });

  let rows: string[][] = [];
  try {
    const raw = await readFile(file, "utf8");
    rows = JSON.parse(raw) as string[][];
  } catch {
    rows = [[...SHEET_HEADERS]];
  }
  if (!rows.length) rows = [[...SHEET_HEADERS]];

  const students = Math.max(0, rows.length - 1);
  const legajo = nextLegajo(students);
  const row = mapToSheetRow(data, legajo);
  rows.push(row);
  await writeFile(file, JSON.stringify(rows, null, 2), "utf8");
  return { legajo, provider: "local", fila: rows.length };
}

async function persistGoogle(data: InscripcionForm): Promise<PersistResult> {
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
  const tab = process.env.GOOGLE_SHEETS_TAB ?? "Inscripciones";
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const key = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!spreadsheetId || !email || !key) {
    throw new Error(
      "Faltan credenciales de Google Sheets. Completá GOOGLE_SHEETS_SPREADSHEET_ID, GOOGLE_SERVICE_ACCOUNT_EMAIL y GOOGLE_PRIVATE_KEY, o usá SHEETS_PROVIDER=local.",
    );
  }

  const auth = new google.auth.JWT({
    email,
    key,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  const sheets = google.sheets({ version: "v4", auth });

  const existing = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${tab}!A:A`,
  });
  const colA = existing.data.values ?? [];
  const hasHeader = colA[0]?.[0] === SHEET_HEADERS[0];
  if (!hasHeader) {
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `${tab}!A1`,
      valueInputOption: "RAW",
      requestBody: { values: [[...SHEET_HEADERS]] },
    });
  }

  const studentCount = Math.max(0, (hasHeader ? colA.length - 1 : colA.length));
  const legajo = nextLegajo(studentCount);
  const row = mapToSheetRow(data, legajo);

  const appended = await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: `${tab}!A1`,
    valueInputOption: "RAW",
    insertDataOption: "INSERT_ROWS",
    requestBody: { values: [row] },
  });

  const updatedRange = appended.data.updates?.updatedRange ?? "";
  const filaMatch = /![A-Z]+(\d+)/.exec(updatedRange);
  const fila = filaMatch ? Number(filaMatch[1]) : studentCount + 2;

  return { legajo, provider: "google", fila };
}
