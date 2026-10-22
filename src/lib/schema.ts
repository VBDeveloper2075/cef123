import { z } from "zod";
import { esMenorDeEdad } from "./age";
import { DISCIPLINAS as DISCIPLINA_CATALOGO } from "./constants";

const requerido = "Campo obligatorio";
const texto = (min = 2, max = 120) =>
  z
    .string({ required_error: requerido })
    .trim()
    .min(min, requerido)
    .max(max, `Máximo ${max} caracteres`);

const opcional = z.string().trim().optional().default("");

export const disciplinaIds = DISCIPLINA_CATALOGO.map((d) => d.id) as [
  (typeof DISCIPLINA_CATALOGO)[number]["id"],
  ...(typeof DISCIPLINA_CATALOGO)[number]["id"][],
];

export const inscripcionSchema = z
  .object({
    propuestaEducativa: z
      .string({ required_error: requerido })
      .trim()
      .min(10, "Contá qué disciplinas o actividades querés cursar")
      .max(800, "Máximo 800 caracteres"),
    disciplinas: z.array(z.enum(disciplinaIds)).default([]),
    turno: z.enum(["manana", "tarde", "vespertino"], {
      required_error: "Seleccioná un turno",
    }),
    apellido: texto(),
    nombre: texto(),
    fechaNacimiento: z
      .string({ required_error: requerido })
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Ingresá una fecha válida"),
    situacionDni: z.enum(["fisico", "tramite", "no_posee", "cpi"], {
      required_error: "Indicá la situación del DNI",
    }),
    dni: opcional,
    cuil: z
      .string({ required_error: "El CUIL es obligatorio" })
      .trim()
      .refine((v) => v.replace(/\D/g, "").length === 11, {
        message: "El CUIL debe tener 11 dígitos (20 - 12345678 - 9)",
      }),
    identidadGenero: z.enum(
      ["mujer", "varon", "no_binaria", "otra", "no_especifica"],
      { required_error: "Seleccioná una opción" },
    ),
    lugarNacimiento: texto(),
    nacionalidad: texto(3, 80),
    calle: texto(),
    numero: texto(1, 20),
    pisoDepto: opcional,
    entreCalles: opcional,
    localidad: texto(),
    distrito: texto(),
    telefonoCelular: z
      .string({ required_error: requerido })
      .trim()
      .min(8, "Ingresá un teléfono válido")
      .max(20),
    email: z
      .string({ required_error: requerido })
      .trim()
      .email("Correo electrónico inválido"),
    nivelModalidad: z
      .enum(["", "inicial", "primaria", "secundaria", "especial", "adultos", "no_asiste"])
      .optional()
      .default(""),
    gestion: z.enum(["", "estatal", "privada", "social"]).optional().default(""),
    dependencia: opcional,
    nombreEscuela: opcional,
    anoEstudio: opcional,

    responsableNombre: opcional,
    responsableDni: opcional,
    responsableNacionalidad: opcional,
    responsableVinculo: opcional,
    responsableNivelEstudios: opcional,
    responsableCondicionLaboral: opcional,
    responsableTelefono: opcional,

    poseeObraSocial: z.enum(["si", "no"], {
      required_error: "Indicá si posee cobertura",
    }),
    obraSocialNombre: opcional,
    nroAfiliado: opcional,
    condicionesSalud: z.array(z.string()).default([]),
    detalleSalud: opcional,
    hospitalEmergencia: texto(3, 160),
    contactoEmergenciaNombre: texto(),
    contactoEmergenciaTelefono: z
      .string({ required_error: requerido })
      .trim()
      .min(8, "Ingresá un teléfono válido"),
    declaracionJuradaSalud: z.literal(true, {
      errorMap: () => ({
        message: "Debés aceptar la declaración jurada de salud",
      }),
    }),

    imagenLugar: texto(2, 80),
    imagenAdultoNombre: texto(),
    imagenAdultoDocTipo: z
      .enum(["DNI", "CPI", "Pasaporte"], { required_error: "Indicá el tipo de documento" })
      .default("DNI"),
    imagenAdultoDni: z
      .string({ required_error: "DNI del firmante" })
      .trim()
      .min(6, "Ingresá el número de documento"),
    imagenVinculo: z.enum(["madre", "padre", "tutor", "titular"], {
      required_error: "Marcá si firmás como madre, padre, tutor o estudiante mayor",
    }),
    imagenConsentimiento: z.enum(["si", "no"], {
      required_error: "Marcá SI o NO en la autorización de imagen",
    }),
    retiroSolo: z.enum(["si", "no"], {
      required_error: "Marcá SI o NO en la autorización de retiro",
    }),
  })
  .superRefine((data, ctx) => {
    if (!data.dni.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["dni"],
        message: "Ingresá el número de DNI / documento",
      });
    } else if (!/^\d{7,9}$/.test(data.dni.replace(/\D/g, ""))) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["dni"],
        message: "El DNI debe tener entre 7 y 9 dígitos",
      });
    }

    if (esMenorDeEdad(data.fechaNacimiento)) {
      const escuela: [keyof typeof data, string][] = [
        ["nombreEscuela", "Indicá el nombre de la escuela"],
        ["nivelModalidad", "Indicá el nivel / modalidad"],
        ["gestion", "Indicá la gestión"],
        ["anoEstudio", "Indicá el año de estudio"],
      ];
      for (const [campo, mensaje] of escuela) {
        if (!String(data[campo] ?? "").trim()) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: [campo],
            message: mensaje,
          });
        }
      }
      const campos: [keyof typeof data, string][] = [
        ["responsableNombre", "Nombre y apellido del adulto responsable"],
        ["responsableDni", "DNI del adulto responsable"],
        ["responsableNacionalidad", "Nacionalidad"],
        ["responsableVinculo", "Vínculo"],
        ["responsableNivelEstudios", "Nivel de estudios"],
        ["responsableCondicionLaboral", "Condición laboral"],
        ["responsableTelefono", "Teléfono de contacto"],
      ];
      for (const [campo, mensaje] of campos) {
        if (!String(data[campo] ?? "").trim()) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: [campo],
            message: mensaje,
          });
        }
      }
    }

    if (data.poseeObraSocial === "si") {
      if (!data.obraSocialNombre.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["obraSocialNombre"],
          message: "Indicá el nombre de la obra social / prepaga",
        });
      }
      if (!data.nroAfiliado.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["nroAfiliado"],
          message: "Indicá el número de afiliado",
        });
      }
    }

  });

export type InscripcionForm = z.infer<typeof inscripcionSchema>;
export type InscripcionInput = z.input<typeof inscripcionSchema>;

export const defaultValues: InscripcionInput = {
  propuestaEducativa: "",
  disciplinas: [],
  turno: undefined as unknown as InscripcionForm["turno"],
  apellido: "",
  nombre: "",
  fechaNacimiento: "",
  situacionDni: undefined as unknown as InscripcionForm["situacionDni"],
  dni: "",
  cuil: "",
  identidadGenero: undefined as unknown as InscripcionForm["identidadGenero"],
  lugarNacimiento: "",
  nacionalidad: "Argentina",
  calle: "",
  numero: "",
  pisoDepto: "",
  entreCalles: "",
  localidad: "",
  distrito: "",
  telefonoCelular: "",
  email: "",
  nivelModalidad: "",
  gestion: "",
  dependencia: "",
  nombreEscuela: "",
  anoEstudio: "",
  responsableNombre: "",
  responsableDni: "",
  responsableNacionalidad: "Argentina",
  responsableVinculo: "",
  responsableNivelEstudios: "",
  responsableCondicionLaboral: "",
  responsableTelefono: "",
  poseeObraSocial: undefined as unknown as InscripcionForm["poseeObraSocial"],
  obraSocialNombre: "",
  nroAfiliado: "",
  condicionesSalud: [],
  detalleSalud: "",
  hospitalEmergencia: "",
  contactoEmergenciaNombre: "",
  contactoEmergenciaTelefono: "",
  declaracionJuradaSalud: false as unknown as true,
  imagenLugar: "Caseros",
  imagenAdultoNombre: "",
  imagenAdultoDocTipo: "DNI",
  imagenAdultoDni: "",
  imagenVinculo: undefined as unknown as InscripcionForm["imagenVinculo"],
  imagenConsentimiento: undefined as unknown as InscripcionForm["imagenConsentimiento"],
  retiroSolo: undefined as unknown as InscripcionForm["retiroSolo"],
};

export const CAMPOS_PASO_ESTUDIANTE: (keyof InscripcionForm)[] = [
  "propuestaEducativa",
  "disciplinas",
  "turno",
  "apellido",
  "nombre",
  "fechaNacimiento",
  "situacionDni",
  "dni",
  "cuil",
  "identidadGenero",
  "lugarNacimiento",
  "nacionalidad",
  "calle",
  "numero",
  "pisoDepto",
  "entreCalles",
  "localidad",
  "distrito",
  "telefonoCelular",
  "email",
  "nivelModalidad",
  "gestion",
  "dependencia",
  "nombreEscuela",
  "anoEstudio",
];

export const CAMPOS_PASO_RESPONSABLE: (keyof InscripcionForm)[] = [
  "responsableNombre",
  "responsableDni",
  "responsableNacionalidad",
  "responsableVinculo",
  "responsableNivelEstudios",
  "responsableCondicionLaboral",
  "responsableTelefono",
];

export const CAMPOS_PASO_SALUD: (keyof InscripcionForm)[] = [
  "poseeObraSocial",
  "obraSocialNombre",
  "nroAfiliado",
  "condicionesSalud",
  "detalleSalud",
  "hospitalEmergencia",
  "contactoEmergenciaNombre",
  "contactoEmergenciaTelefono",
  "declaracionJuradaSalud",
];

export const CAMPOS_PASO_IMAGEN: (keyof InscripcionForm)[] = [
  "imagenLugar",
  "imagenAdultoNombre",
  "imagenAdultoDocTipo",
  "imagenAdultoDni",
  "imagenVinculo",
  "imagenConsentimiento",
  "retiroSolo",
];
