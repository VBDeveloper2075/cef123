import { getCloudflareContext } from "@opennextjs/cloudflare";
import { CICLO_LECTIVO } from "./constants";
import { mapToSheetRow, SHEET_HEADERS } from "./map-row";
import type { InscripcionForm } from "./schema";
import { getServerEnv, isCloudflareWorkerRuntime } from "./server-env";

export type PersistResult = {
  legajo: string;
  provider: "google" | "local" | "kv";
  fila: number;
};

const KV_ROWS_KEY = "cef123:inscripciones:rows";

type ServerEnv = Awaited<ReturnType<typeof getServerEnv>>;

function nextLegajo(existingCount: number) {
  return `CEF-${CICLO_LECTIVO}-${String(existingCount + 1).padStart(4, "0")}`;
}

function hasGoogleConfig(env: ServerEnv) {
  return (
    Boolean(env.GOOGLE_SHEETS_SPREADSHEET_ID) &&
    Boolean(env.GOOGLE_SERVICE_ACCOUNT_EMAIL) &&
    Boolean(env.GOOGLE_PRIVATE_KEY)
  );
}

async function getInscripcionesKv() {
  try {
    const ctx = await getCloudflareContext({ async: true });
    return ctx.env.INSCRIPCIONES_KV ?? null;
  } catch {
    return null;
  }
}

export async function persistInscripcion(
  data: InscripcionForm,
): Promise<PersistResult> {
  const env = await getServerEnv();
  const provider = env.SHEETS_PROVIDER ?? "google";

  if (provider !== "local" && hasGoogleConfig(env)) {
    return persistGoogle(data, env);
  }

  const kv = await getInscripcionesKv();
  if (kv) {
    return persistKv(data, kv);
  }

  if (isCloudflareWorkerRuntime()) {
    throw new Error(
      "En Cloudflare hay que configurar Google Sheets (GOOGLE_SHEETS_SPREADSHEET_ID, GOOGLE_SERVICE_ACCOUNT_EMAIL y GOOGLE_PRIVATE_KEY) o el binding INSCRIPCIONES_KV en wrangler.",
    );
  }

  return persistLocal(data);
}

async function persistKv(
  data: InscripcionForm,
  kv: NonNullable<Awaited<ReturnType<typeof getInscripcionesKv>>>,
): Promise<PersistResult> {
  let rows: string[][] = [];
  const raw = await kv.get(KV_ROWS_KEY);
  if (raw) {
    try {
      rows = JSON.parse(raw) as string[][];
    } catch {
      rows = [[...SHEET_HEADERS]];
    }
  } else {
    rows = [[...SHEET_HEADERS]];
  }
  if (!rows.length) rows = [[...SHEET_HEADERS]];

  const students = Math.max(0, rows.length - 1);
  const legajo = nextLegajo(students);
  const row = mapToSheetRow(data, legajo);
  rows.push(row);
  await kv.put(KV_ROWS_KEY, JSON.stringify(rows));
  return { legajo, provider: "kv", fila: rows.length };
}

async function persistLocal(data: InscripcionForm): Promise<PersistResult> {
  const { mkdir, readFile, writeFile } = await import("node:fs/promises");
  const path = await import("node:path");
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

function b64urlJson(value: unknown) {
  return b64url(new TextEncoder().encode(JSON.stringify(value)));
}

function b64url(bytes: Uint8Array | ArrayBuffer) {
  const buf = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  let binary = "";
  for (const b of buf) binary += String.fromCharCode(b);
  return btoa(binary)
    .replace(/=+$/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function pemToPkcs8(pem: string) {
  const b64 = pem
    .replace(/-----BEGIN PRIVATE KEY-----/g, "")
    .replace(/-----END PRIVATE KEY-----/g, "")
    .replace(/\s+/g, "");
  const bin = atob(b64);
  const buf = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) buf[i] = bin.charCodeAt(i);
  return buf.buffer;
}

async function googleAccessToken(env: ServerEnv) {
  const email = env.GOOGLE_SERVICE_ACCOUNT_EMAIL!;
  const key = env.GOOGLE_PRIVATE_KEY!.replace(/\\n/g, "\n");
  const now = Math.floor(Date.now() / 1000);
  const header = b64urlJson({ alg: "RS256", typ: "JWT" });
  const claim = b64urlJson({
    iss: email,
    scope: "https://www.googleapis.com/auth/spreadsheets",
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600,
  });
  const unsigned = `${header}.${claim}`;
  const cryptoKey = await crypto.subtle.importKey(
    "pkcs8",
    pemToPkcs8(key),
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign(
    "RSASSA-PKCS1-v1_5",
    cryptoKey,
    new TextEncoder().encode(unsigned),
  );
  const jwt = `${unsigned}.${b64url(signature)}`;
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
  });
  const json = (await res.json()) as { access_token?: string; error?: string };
  if (!res.ok || !json.access_token) {
    throw new Error(json.error ?? "No se pudo autenticar con Google Sheets.");
  }
  return json.access_token;
}

async function persistGoogle(
  data: InscripcionForm,
  env: ServerEnv,
): Promise<PersistResult> {
  const spreadsheetId = env.GOOGLE_SHEETS_SPREADSHEET_ID!;
  const tab = env.GOOGLE_SHEETS_TAB ?? "Inscripciones";
  const token = await googleAccessToken(env);
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
  const base = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values`;

  const existingRes = await fetch(
    `${base}/${encodeURIComponent(`${tab}!A:A`)}`,
    { headers },
  );
  const existing = (await existingRes.json()) as { values?: string[][] };
  if (!existingRes.ok) {
    throw new Error("No se pudo leer la hoja de Google Sheets.");
  }
  const colA = existing.values ?? [];
  const hasHeader = colA[0]?.[0] === SHEET_HEADERS[0];
  if (!hasHeader) {
    const put = await fetch(
      `${base}/${encodeURIComponent(`${tab}!A1`)}?valueInputOption=RAW`,
      {
        method: "PUT",
        headers,
        body: JSON.stringify({ values: [[...SHEET_HEADERS]] }),
      },
    );
    if (!put.ok) throw new Error("No se pudieron escribir los encabezados.");
  }

  const studentCount = Math.max(0, hasHeader ? colA.length - 1 : colA.length);
  const legajo = nextLegajo(studentCount);
  const row = mapToSheetRow(data, legajo);

  const appendedRes = await fetch(
    `${base}/${encodeURIComponent(`${tab}!A1`)}:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`,
    {
      method: "POST",
      headers,
      body: JSON.stringify({ values: [row] }),
    },
  );
  const appended = (await appendedRes.json()) as {
    updates?: { updatedRange?: string };
  };
  if (!appendedRes.ok) {
    throw new Error("No se pudo anexar la inscripción a Google Sheets.");
  }

  const updatedRange = appended.updates?.updatedRange ?? "";
  const filaMatch = /![A-Z]+(\d+)/.exec(updatedRange);
  const fila = filaMatch ? Number(filaMatch[1]) : studentCount + 2;

  return { legajo, provider: "google", fila };
}
