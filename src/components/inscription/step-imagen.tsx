"use client";

import { useEffect } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { edadAl30DeJunio, esMenorDeEdad } from "@/lib/age";
import { TIPOS_DOCUMENTO, VINCULOS_IMAGEN } from "@/lib/constants";
import type { InscripcionForm } from "@/lib/schema";
import { Field, FieldError, Input, Label, Select } from "@/components/ui/field";

function SiNo({
  name,
  error,
}: {
  name: "imagenConsentimiento" | "retiroSolo";
  error?: string;
}) {
  const { register } = useFormContext<InscripcionForm>();
  return (
    <div>
      <div className="flex gap-2">
        {[
          { id: "si", label: "SÍ" },
          { id: "no", label: "NO" },
        ].map((opt) => (
          <label
            key={opt.id}
            className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-stone-200 bg-white px-5 py-2 text-sm font-semibold has-[:checked]:border-[#C8102E] has-[:checked]:bg-[#C8102E] has-[:checked]:text-white"
          >
            <input
              type="radio"
              value={opt.id}
              className="size-4 accent-[#C8102E]"
              {...register(name)}
            />
            {opt.label}
          </label>
        ))}
      </div>
      <FieldError message={error} />
    </div>
  );
}

export function StepImagen() {
  const {
    register,
    control,
    setValue,
    formState: { errors },
  } = useFormContext<InscripcionForm>();
  const apellido = useWatch({ control, name: "apellido" });
  const nombre = useWatch({ control, name: "nombre" });
  const dni = useWatch({ control, name: "dni" });
  const fecha = useWatch({ control, name: "fechaNacimiento" });
  const responsableNombre = useWatch({ control, name: "responsableNombre" });
  const responsableDni = useWatch({ control, name: "responsableDni" });
  const responsableVinculo = useWatch({ control, name: "responsableVinculo" });
  const firmante = useWatch({ control, name: "imagenAdultoNombre" });
  const menor = fecha ? esMenorDeEdad(fecha) : true;
  const edad = fecha ? edadAl30DeJunio(fecha) : null;
  const estudiante = [nombre, apellido].filter(Boolean).join(" ").trim();

  useEffect(() => {
    if (!firmante) {
      if (menor && responsableNombre) {
        setValue("imagenAdultoNombre", responsableNombre);
        if (responsableDni) setValue("imagenAdultoDni", responsableDni);
        if (
          responsableVinculo === "madre" ||
          responsableVinculo === "padre" ||
          responsableVinculo === "tutor"
        ) {
          setValue("imagenVinculo", responsableVinculo);
        }
      } else if (!menor && nombre && apellido) {
        setValue("imagenAdultoNombre", `${nombre} ${apellido}`.trim());
        if (dni) setValue("imagenAdultoDni", dni);
        setValue("imagenVinculo", "titular");
      }
    }
  }, [
    firmante,
    menor,
    responsableNombre,
    responsableDni,
    responsableVinculo,
    nombre,
    apellido,
    dni,
    setValue,
  ]);

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-[#1A3D8F]/20 bg-white p-5 sm:p-8">
        <p className="text-center text-sm font-semibold text-[#1A3D8F]">
          Centro de Educación Física N.º 123
        </p>
        <p className="text-center text-xs italic text-stone-600">“Jorge Newbery”</p>
        <h2 className="mt-3 text-center font-serif text-xl text-stone-900 sm:text-2xl">
          Autorización de uso de imagen de estudiantes
        </h2>
        <p className="mt-2 text-center text-sm text-stone-600">
          Completá esta ficha marcando <strong>SÍ</strong> o <strong>NO</strong>. Es obligatoria
          antes de abonar cooperadora.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <Field>
            <Label htmlFor="imagenLugar" required>
              Lugar
            </Label>
            <Input id="imagenLugar" {...register("imagenLugar")} />
            <FieldError message={errors.imagenLugar?.message} />
          </Field>
          <Field>
            <Label>Fecha</Label>
            <Input readOnly value={new Date().toLocaleDateString("es-AR")} />
          </Field>
        </div>

        <p className="mt-6 text-sm text-stone-800">A quien corresponda,</p>
        <p className="mt-2 text-sm text-stone-700">Por medio de la presente, quien suscribe:</p>
        <div className="mt-3 grid gap-4 sm:grid-cols-3">
          <Field className="sm:col-span-3">
            <Label htmlFor="imagenAdultoNombre" required>
              Nombre y apellido del firmante
            </Label>
            <Input id="imagenAdultoNombre" {...register("imagenAdultoNombre")} />
            <FieldError message={errors.imagenAdultoNombre?.message} />
          </Field>
          <Field>
            <Label htmlFor="imagenAdultoDocTipo" required>
              Documento tipo
            </Label>
            <Select id="imagenAdultoDocTipo" {...register("imagenAdultoDocTipo")}>
              {TIPOS_DOCUMENTO.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.label}
                </option>
              ))}
            </Select>
          </Field>
          <Field className="sm:col-span-2">
            <Label htmlFor="imagenAdultoDni" required>
              Número
            </Label>
            <Input id="imagenAdultoDni" inputMode="numeric" {...register("imagenAdultoDni")} />
            <FieldError message={errors.imagenAdultoDni?.message} />
          </Field>
        </div>

        <fieldset className="mt-6 space-y-3">
          <legend className="text-sm font-medium text-stone-900">
            SÍ / NO (marcar lo que corresponda) AUTORIZO como *
          </legend>
          <SiNo name="imagenConsentimiento" error={errors.imagenConsentimiento?.message} />
          <Field>
            <Label htmlFor="imagenVinculo" required>
              Padre / Madre / Tutor representante
            </Label>
            <Select id="imagenVinculo" {...register("imagenVinculo")}>
              <option value="">Seleccionar…</option>
              {VINCULOS_IMAGEN.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.label}
                </option>
              ))}
            </Select>
            <FieldError message={errors.imagenVinculo?.message} />
          </Field>
        </fieldset>

        <p className="mt-5 text-sm leading-relaxed text-stone-700">
          a la Dirección General de Cultura y Educación de la Provincia de Buenos Aires y/o a quien
          ellos indiquen, de forma gratuita y sin límite de tiempo, a la utilización, exhibición
          y/o reproducción por cualquier medio físico o digital, gráfico y/o audiovisual,
          actualmente conocido o que se invente en el futuro, y con fines estrictamente educativos,
          de las imágenes, videos y sonidos registrados en las diferentes actividades educativas
          que se realizan bajo supervisión de autoridades escolares dependientes de la Dirección
          General de Cultura y Educación de la Provincia de Buenos Aires, de
        </p>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field>
            <Label>el/la ESTUDIANTE</Label>
            <Input readOnly value={estudiante || "Se completa con los datos del alumno"} />
          </Field>
          <Field>
            <Label>Documento tipo DNI N.º</Label>
            <Input readOnly value={dni || "—"} />
          </Field>
        </div>

        <p className="mt-6 text-[11px] leading-relaxed text-stone-600">
          Por la presente cumplo con lo preceptuado por el art. 53 del Código Civil y Comercial de
          la Nación y art. 31 de la Ley 11.723, significando éste el aviso que prevé la normativa
          vigente.
        </p>
        <p className="mt-3 text-[11px] leading-relaxed text-stone-600">
          <strong>Artículo 53 C.C.C.N. Derecho a la imagen.</strong> Para captar o reproducir la
          imagen o la voz de una persona, de cualquier modo que se haga, es necesario su
          consentimiento, excepto en los casos previstos por la ley (actos públicos; interés
          científico, cultural o educacional; ejercicio regular del derecho a informar).
        </p>
        <p className="mt-3 text-[11px] leading-relaxed text-stone-600">
          <strong>Art. 31 Ley de Propiedad Intelectual 11.723.</strong> El retrato fotográfico de
          una persona no puede ser puesto en el comercio sin el consentimiento expreso de la
          persona. Quien haya dado su consentimiento puede revocarlo resarciendo daños y
          perjuicios. Es libre la publicación del retrato cuando se relacione con fines
          científicos, didácticos y en general culturales, o con hechos de interés público.
        </p>
      </div>

      <div className="rounded-3xl border border-[#1A3D8F]/20 bg-white p-5 sm:p-8">
        <h3 className="text-center font-serif text-xl text-stone-900">Autorización de retiro</h3>
        <p className="mt-3 text-sm leading-relaxed text-stone-700">
          Por medio de la presente, autorizo a mi hijo/a{" "}
          <strong>{estudiante || "………………"}</strong> DNI N.º <strong>{dni || "………………"}</strong>{" "}
          Fecha de nac.: <strong>{fecha ? new Date(`${fecha}T00:00:00`).toLocaleDateString("es-AR") : "………………"}</strong>{" "}
          Edad: <strong>{edad != null ? `${edad} años` : "………………"}</strong> a retirarse solo/a del
          CEF 123 cuando finalice el horario de su propuesta.
        </p>
        <fieldset className="mt-4">
          <legend className="mb-2 text-sm font-medium">Marcá SÍ o NO *</legend>
          <SiNo name="retiroSolo" error={errors.retiroSolo?.message} />
        </fieldset>
        <p className="mt-4 text-xs text-stone-500">
          La firma manuscrita se registrará en el CEF, con fotocopia de DNI, para dar validez al
          trámite.
        </p>
      </div>
    </div>
  );
}
