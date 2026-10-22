export const CICLO_LECTIVO = Number(process.env.NEXT_PUBLIC_CICLO_LECTIVO ?? "2026");

const montoEnv = Number(process.env.NEXT_PUBLIC_COOPERADORA_MONTO);
export const COOPERADORA_MONTO =
  Number.isFinite(montoEnv) && montoEnv > 0 ? montoEnv : 5000;

export const REDES = [
  {
    id: "instagram",
    label: "Instagram",
    href: process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM || "#instagram",
  },
  {
    id: "facebook",
    label: "Facebook",
    href: process.env.NEXT_PUBLIC_SOCIAL_FACEBOOK || "#facebook",
  },
  {
    id: "youtube",
    label: "YouTube",
    href: process.env.NEXT_PUBLIC_SOCIAL_YOUTUBE || "#youtube",
  },
  {
    id: "whatsapp",
    label: "WhatsApp",
    href: process.env.NEXT_PUBLIC_SOCIAL_WHATSAPP || "#whatsapp",
  },
] as const;

export const DISCIPLINAS = [
  { id: "natacion", label: "Natación", sheet: "NATACION" },
  { id: "atletismo", label: "Atletismo", sheet: "ATLETISMO" },
  { id: "basquet7", label: "Básquet -7 años", sheet: "BASQUET 7 años" },
  { id: "basquet12", label: "Básquet +12 años", sheet: "BASQUET +12 años" },
  { id: "deporteAlternativo", label: "Deporte Alternativo", sheet: "DEPORTE ALTERNATIVO" },
  { id: "futbol", label: "Fútbol", sheet: "FUTBOL" },
  { id: "voley", label: "Vóley", sheet: "VOLEY" },
  { id: "handball", label: "Handball", sheet: "HANDBALL" },
  { id: "gimnasia", label: "Gimnasia", sheet: "GIMNASIA" },
  { id: "chikun", label: "Chikún", sheet: "CHIKUN" },
  { id: "stretching", label: "Stretching", sheet: "STRETCHING" },
  { id: "ritmos", label: "Ritmos", sheet: "RITMOS" },
  { id: "folclore", label: "Folclore", sheet: "FOLCLORE" },
  { id: "efi", label: "EFI", sheet: "EFI" },
  { id: "gimnasiaArtistica", label: "Gimnasia Artística", sheet: "GIMNASIA ARTISTICA" },
  { id: "pilates", label: "Pilates", sheet: "PILATES" },
] as const;

export type DisciplinaId = (typeof DISCIPLINAS)[number]["id"];

export const TURNOS = [
  { id: "manana", label: "Mañana" },
  { id: "tarde", label: "Tarde" },
  { id: "vespertino", label: "Vespertino" },
] as const;

export const SITUACIONES_DNI = [
  { id: "fisico", label: "DNI físico" },
  { id: "tramite", label: "En trámite" },
  { id: "no_posee", label: "No posee" },
  { id: "cpi", label: "CPI" },
] as const;

export const IDENTIDADES_GENERO = [
  { id: "mujer", label: "Mujer" },
  { id: "varon", label: "Varón" },
  { id: "no_binaria", label: "No binaria" },
  { id: "otra", label: "Otra / Autopercibida" },
  { id: "no_especifica", label: "Prefiere no especificar" },
] as const;

export const NIVELES_MODALIDAD = [
  { id: "inicial", label: "Inicial" },
  { id: "primaria", label: "Primaria" },
  { id: "secundaria", label: "Secundaria" },
  { id: "especial", label: "Educación especial" },
  { id: "adultos", label: "Adultos" },
  { id: "no_asiste", label: "No asiste / Egresado" },
] as const;

export const GESTIONES = [
  { id: "estatal", label: "Estatal" },
  { id: "privada", label: "Privada" },
  { id: "social", label: "Social / Cooperativa" },
] as const;

export const VINCULOS = [
  { id: "madre", label: "Madre" },
  { id: "padre", label: "Padre" },
  { id: "tutor", label: "Tutor/a legal" },
  { id: "abuelo", label: "Abuelo/a" },
  { id: "otro", label: "Otro" },
] as const;

export const VINCULOS_IMAGEN = [
  { id: "madre", label: "Madre" },
  { id: "padre", label: "Padre" },
  { id: "tutor", label: "Tutor/a representante" },
  { id: "titular", label: "El/la propio/a estudiante (mayor de edad)" },
] as const;

export const TIPOS_DOCUMENTO = [
  { id: "DNI", label: "DNI" },
  { id: "CPI", label: "CPI" },
  { id: "Pasaporte", label: "Pasaporte" },
] as const;

export const LEYENDA_CIERRE =
  "¡Felicitaciones! Completaste todo. Ahora guardá este documento y, con el número de inscripción, acercate en los días y horarios de atención con fotocopia del DNI en mano, a registrar tu firma y dar validez al trámite.";

export const NIVELES_ESTUDIO = [
  { id: "primario", label: "Primario" },
  { id: "secundario", label: "Secundario" },
  { id: "terciario", label: "Terciario" },
  { id: "universitario", label: "Universitario" },
  { id: "otro", label: "Otro" },
] as const;

export const CONDICIONES_LABORALES = [
  { id: "empleado", label: "Empleado/a" },
  { id: "independiente", label: "Independiente" },
  { id: "desocupado", label: "Desocupado/a" },
  { id: "jubilado", label: "Jubilado/a o pensionado/a" },
  { id: "ama_casa", label: "Trabajo no remunerado / hogar" },
  { id: "otro", label: "Otro" },
] as const;

export const CONDICIONES_SALUD = [
  { id: "asma", label: "Asma" },
  { id: "cardiacos", label: "Problemas cardíacos" },
  { id: "diabetes", label: "Diabetes" },
  { id: "presion", label: "Presión arterial alta o baja" },
  { id: "convulsiones", label: "Convulsiones / epilepsia" },
  { id: "traumatismos", label: "Traumatismos recientes o crónicos" },
  { id: "alergias", label: "Alergias graves" },
  { id: "respiratorios", label: "Otros problemas respiratorios" },
  { id: "motoras", label: "Limitaciones motoras" },
  { id: "medicacion", label: "Medicación crónica / permanente" },
] as const;
