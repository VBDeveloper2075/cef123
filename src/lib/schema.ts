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
    disciplinas: z
      .array(z.enum(disciplinaIds))
      .min(1, "Seleccioná al menos una disciplina"),
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
    cuil: opcional,
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
    nivelModalidad: z.enum(
      ["inicial", "primaria", "secundaria", "especial", "adultos", "no_asiste"],
      { required_error: "Seleccioná el nivel" },
    ),
    gestion: z.enum(["estatal", "privada", "social"], {
      required_error: "Seleccioná la gestión",
    }),
    dependencia: opcional,
    nombreEscuela: texto(),
    anoEstudio: texto(1, 40),

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

    completarAutorizacionImagen: z.boolean().default(false),
    imagenAdultoNombre: opcional,
    imagenAdultoDni: opcional,
    imagenVinculo: opcional,
    imagenConsentimiento: z.boolean().default(false),
  })
  .superRefine((data, ctx) => {
    const dniRequerido =
      data.situacionDni === "fisico" || data.situacionDni === "cpi";
    if (dniRequerido && !data.dni.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["dni"],
        message: "Ingresá el número de DNI / documento",
      });
    }
    if (data.dni && !/^\d{7,9}$/.test(data.dni.replace(/\D/g, ""))) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["dni"],
        message: "El DNI debe tener entre 7 y 9 dígitos",
      });
    }

    if (esMenorDeEdad(data.fechaNacimiento)) {
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

    if (data.completarAutorizacionImagen) {
      if (!data.imagenAdultoNombre.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["imagenAdultoNombre"],
          message: "Nombre del adulto que autoriza",
        });
      }
      if (!data.imagenAdultoDni.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["imagenAdultoDni"],
          message: "DNI del adulto que autoriza",
        });
      }
      if (!data.imagenVinculo.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["imagenVinculo"],
          message: "Indicá el vínculo con el alumno",
        });
      }
      if (!data.imagenConsentimiento) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["imagenConsentimiento"],
          message: "El consentimiento explícito es obligatorio",
        });
      }
    }
  });

export type InscripcionForm = z.infer<typeof inscripcionSchema>;
export type InscripcionInput = z.input<typeof inscripcionSchema>;

export const defaultValues: InscripcionInput = {
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
  nivelModalidad: undefined as unknown as InscripcionForm["nivelModalidad"],
  gestion: undefined as unknown as InscripcionForm["gestion"],
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
  completarAutorizacionImagen: false,
  imagenAdultoNombre: "",
  imagenAdultoDni: "",
  imagenVinculo: "",
  imagenConsentimiento: false,
};

export const CAMPOS_PASO_ESTUDIANTE: (keyof InscripcionForm)[] = [
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
  "completarAutorizacionImagen",
  "imagenAdultoNombre",
  "imagenAdultoDni",
  "imagenVinculo",
  "imagenConsentimiento",
];
