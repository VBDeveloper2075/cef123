import { edadAl30DeJunio, formatFechaAR, nombrePlanilla, soloDigitos } from "./age";
import {
  CICLO_LECTIVO,
  CONDICIONES_SALUD,
  DISCIPLINAS,
  TURNOS,
} from "./constants";
import type { InscripcionForm } from "./schema";

export const SHEET_HEADERS = [
  "LEGAJO",
  "APELLIDO Y NOMBRE",
  "DNI",
  "CUIL",
  "FECHA DE NACIMIENTO",
  "EDAD",
  "TELEFONO",
  "OBSERVACIONES",
  ...DISCIPLINAS.map((d) => d.sheet),
  "TURNO",
  "EMAIL",
  "GENERO",
  "NACIONALIDAD",
  "LOCALIDAD",
  "DISTRITO",
  "ESCUELA",
  "AÑO DE ESTUDIO",
  "RESPONSABLE",
  "DNI RESPONSABLE",
  "VINCULO",
  "TEL RESPONSABLE",
  "OBRA SOCIAL",
  "HOSPITAL EMERGENCIA",
  "CONTACTO EMERGENCIA",
  "AUTORIZACION IMAGEN",
  "PROPUESTA EDUCATIVA",
  "CICLO LECTIVO",
] as const;

export function observationsFrom(data: InscripcionForm): string {
  const notes: string[] = [];
  const dniDigits = soloDigitos(data.dni);
  if (data.situacionDni === "no_posee") notes.push("FALTA DNI");
  if (data.situacionDni === "tramite") notes.push("DNI EN TRAMITE");
  if (data.situacionDni === "cpi") notes.push("CPI");
  if (!dniDigits && data.situacionDni !== "no_posee") notes.push("FALTA DNI");

  const salud = data.condicionesSalud
    .map((id) => CONDICIONES_SALUD.find((c) => c.id === id)?.label)
    .filter(Boolean);
  if (salud.length) notes.push(`SALUD: ${salud.join(", ")}`);
  if (data.detalleSalud.trim()) notes.push(data.detalleSalud.trim());
  notes.push("SEGUN CUPOS / LISTA DE ESPERA");
  return notes.join(" | ");
}

export function mapToSheetRow(data: InscripcionForm, legajo: string): string[] {
  const edad = edadAl30DeJunio(data.fechaNacimiento) ?? "";
  const turno = TURNOS.find((t) => t.id === data.turno)?.label ?? data.turno;
  const disciplinas = new Set(data.disciplinas);

  return [
    legajo,
    nombrePlanilla(data.apellido, data.nombre),
    soloDigitos(data.dni),
    soloDigitos(data.cuil),
    formatFechaAR(data.fechaNacimiento),
    String(edad),
    soloDigitos(data.telefonoCelular),
    observationsFrom(data),
    ...DISCIPLINAS.map((d) => (disciplinas.has(d.id) ? "X" : "")),
    turno.toUpperCase(),
    data.email.trim().toLowerCase(),
    data.identidadGenero.toUpperCase(),
    data.nacionalidad.toUpperCase(),
    data.localidad.toUpperCase(),
    data.distrito.toUpperCase(),
    data.nombreEscuela.toUpperCase(),
    data.anoEstudio.toUpperCase(),
    data.responsableNombre.trim().toUpperCase(),
    soloDigitos(data.responsableDni),
    data.responsableVinculo.toUpperCase(),
    soloDigitos(data.responsableTelefono),
    data.poseeObraSocial === "si"
      ? `${data.obraSocialNombre.toUpperCase()} ${data.nroAfiliado}`.trim()
      : "NO",
    data.hospitalEmergencia.toUpperCase(),
    `${data.contactoEmergenciaNombre.toUpperCase()} ${soloDigitos(data.contactoEmergenciaTelefono)}`.trim(),
    data.completarAutorizacionImagen && data.imagenConsentimiento ? "SI" : "NO",
    data.propuestaEducativa.trim(),
    String(CICLO_LECTIVO),
  ];
}
