"use client";

import { useFormContext, useWatch } from "react-hook-form";
import { VINCULOS } from "@/lib/constants";
import type { InscripcionForm } from "@/lib/schema";
import { Field, FieldError, Input, Label, Select } from "@/components/ui/field";

export function StepImagen() {
  const {
    register,
    control,
    setValue,
    formState: { errors },
  } = useFormContext<InscripcionForm>();
  const activo = useWatch({ control, name: "completarAutorizacionImagen" });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-2xl text-stone-900">Autorización de uso de imagen</h2>
        <p className="mt-1 text-sm text-stone-600">
          Este módulo es opcional. Completalo si un adulto responsable autoriza el uso de imagen del
          alumno en actividades educativas y difusión institucional.
        </p>
      </div>

      <button
        type="button"
        onClick={() => setValue("completarAutorizacionImagen", !activo, { shouldValidate: true })}
        className={`flex w-full items-center justify-between rounded-2xl border px-5 py-4 text-left text-sm font-medium transition ${
          activo
            ? "border-[#1A3D8F] bg-blue-50 text-[#152f6e]"
            : "border-stone-200 bg-white text-stone-800"
        }`}
      >
        Completar autorización de uso de imagen para menores
        <span className="rounded-full bg-white px-3 py-1 text-xs">
          {activo ? "Activado" : "Opcional"}
        </span>
      </button>

      {activo ? (
        <div className="grid gap-4 rounded-2xl border border-[#1A3D8F]/15 bg-white p-5 sm:grid-cols-2">
          <Field className="sm:col-span-2">
            <Label htmlFor="imagenAdultoNombre" required>
              Nombre del adulto responsable
            </Label>
            <Input id="imagenAdultoNombre" {...register("imagenAdultoNombre")} />
            <FieldError message={errors.imagenAdultoNombre?.message} />
          </Field>
          <Field>
            <Label htmlFor="imagenAdultoDni" required>
              DNI
            </Label>
            <Input id="imagenAdultoDni" inputMode="numeric" {...register("imagenAdultoDni")} />
            <FieldError message={errors.imagenAdultoDni?.message} />
          </Field>
          <Field>
            <Label htmlFor="imagenVinculo" required>
              Vínculo con el alumno
            </Label>
            <Select id="imagenVinculo" {...register("imagenVinculo")}>
              <option value="">Seleccionar…</option>
              {VINCULOS.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.label}
                </option>
              ))}
            </Select>
            <FieldError message={errors.imagenVinculo?.message} />
          </Field>
          <label className="sm:col-span-2 flex items-start gap-3 text-sm text-stone-800">
            <input
              type="checkbox"
              className="mt-0.5 size-4 accent-[#1A3D8F]"
              {...register("imagenConsentimiento")}
            />
            <span>
              Autorizo de manera explícita al CEF a captar, reproducir y difundir la imagen del
              alumno en el marco de actividades educativas, muestras institucionales y canales
              oficiales, conforme a la normativa vigente de protección de datos personales y derechos
              de niñas, niños y adolescentes.
            </span>
          </label>
          <FieldError message={errors.imagenConsentimiento?.message} />
        </div>
      ) : (
        <p className="text-sm text-stone-500">
          Podés continuar sin completar este módulo. La autorización de retiro de alumnos no forma
          parte de este trámite.
        </p>
      )}
    </div>
  );
}
