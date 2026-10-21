import { CICLO_LECTIVO } from "./constants";

/** Edad en años cumplidos al 30 de junio del ciclo lectivo. */
export function edadAl30DeJunio(
  fechaNacimiento: string,
  cicloLectivo = CICLO_LECTIVO,
): number | null {
  if (!fechaNacimiento) return null;
  const nacimiento = parseISODate(fechaNacimiento);
  if (!nacimiento) return null;

  const corte = new Date(cicloLectivo, 5, 30);
  let edad = corte.getFullYear() - nacimiento.getFullYear();
  const cumpleEnCiclo = new Date(
    cicloLectivo,
    nacimiento.getMonth(),
    nacimiento.getDate(),
  );
  if (cumpleEnCiclo > corte) edad -= 1;
  return edad < 0 ? 0 : edad;
}

export function esMenorDeEdad(fechaNacimiento: string, ciclo = CICLO_LECTIVO) {
  const edad = edadAl30DeJunio(fechaNacimiento, ciclo);
  return edad !== null && edad < 18;
}

export function formatFechaAR(iso: string) {
  const d = parseISODate(iso);
  if (!d) return "";
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `${dd}/${mm}/${d.getFullYear()}`;
}

export function parseISODate(iso: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]) - 1;
  const day = Number(match[3]);
  const d = new Date(year, month, day);
  if (d.getFullYear() !== year || d.getMonth() !== month || d.getDate() !== day) {
    return null;
  }
  return d;
}

export function soloDigitos(valor: string) {
  return valor.replace(/\D/g, "");
}

export function formatCuil(valor: string) {
  const d = soloDigitos(valor).slice(0, 11);
  if (d.length === 11) return `${d.slice(0, 2)} - ${d.slice(2, 10)} - ${d.slice(10)}`;
  return d;
}

export function formatCuilDisplay(valor: string) {
  const d = soloDigitos(valor).slice(0, 11);
  return {
    pre: d.slice(0, 2),
    mid: d.slice(2, 10),
    last: d.slice(10, 11),
    formatted: d.length === 11 ? `${d.slice(0, 2)} - ${d.slice(2, 10)} - ${d.slice(10)}` : "",
  };
}

export function nombrePlanilla(apellido: string, nombre: string) {
  return `${apellido.trim()}, ${nombre.trim()}`.toUpperCase();
}
