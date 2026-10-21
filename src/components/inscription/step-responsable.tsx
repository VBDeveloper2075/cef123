"use client";

import { useFormContext } from "react-hook-form";
import {
  CONDICIONES_LABORALES,
  NIVELES_ESTUDIO,
  VINCULOS,
} from "@/lib/constants";
import type { InscripcionForm } from "@/lib/schema";
import { Field, FieldError, Input, Label, Select } from "@/components/ui/field";

export function StepResponsable() {
  const {
    register,
    formState: { errors },
  } = useFormContext<InscripcionForm>();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-2xl text-stone-900">Adulto responsable</h2>
        <p className="mt-1 text-sm text-stone-600">
          El estudiante es menor de 18 años al 30 de junio del ciclo lectivo. Completá los datos de
          padre, madre o tutor/a.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field className="sm:col-span-2">
          <Label htmlFor="responsableNombre" required>
            Nombre y apellido
          </Label>
          <Input id="responsableNombre" {...register("responsableNombre")} />
          <FieldError message={errors.responsableNombre?.message} />
        </Field>
        <Field>
          <Label htmlFor="responsableDni" required>
            DNI
          </Label>
          <Input id="responsableDni" inputMode="numeric" {...register("responsableDni")} />
          <FieldError message={errors.responsableDni?.message} />
        </Field>
        <Field>
          <Label htmlFor="responsableNacionalidad" required>
            Nacionalidad
          </Label>
          <Input id="responsableNacionalidad" {...register("responsableNacionalidad")} />
          <FieldError message={errors.responsableNacionalidad?.message} />
        </Field>
        <Field>
          <Label htmlFor="responsableVinculo" required>
            Vínculo
          </Label>
          <Select id="responsableVinculo" {...register("responsableVinculo")}>
            <option value="">Seleccionar…</option>
            {VINCULOS.map((v) => (
              <option key={v.id} value={v.id}>
                {v.label}
              </option>
            ))}
          </Select>
          <FieldError message={errors.responsableVinculo?.message} />
        </Field>
        <Field>
          <Label htmlFor="responsableNivelEstudios" required>
            Nivel de estudios alcanzado
          </Label>
          <Select id="responsableNivelEstudios" {...register("responsableNivelEstudios")}>
            <option value="">Seleccionar…</option>
            {NIVELES_ESTUDIO.map((v) => (
              <option key={v.id} value={v.id}>
                {v.label}
              </option>
            ))}
          </Select>
          <FieldError message={errors.responsableNivelEstudios?.message} />
        </Field>
        <Field>
          <Label htmlFor="responsableCondicionLaboral" required>
            Condición laboral
          </Label>
          <Select id="responsableCondicionLaboral" {...register("responsableCondicionLaboral")}>
            <option value="">Seleccionar…</option>
            {CONDICIONES_LABORALES.map((v) => (
              <option key={v.id} value={v.id}>
                {v.label}
              </option>
            ))}
          </Select>
          <FieldError message={errors.responsableCondicionLaboral?.message} />
        </Field>
        <Field>
          <Label htmlFor="responsableTelefono" required>
            Teléfono / contacto
          </Label>
          <Input id="responsableTelefono" inputMode="tel" {...register("responsableTelefono")} />
          <FieldError message={errors.responsableTelefono?.message} />
        </Field>
      </div>
    </div>
  );
}
