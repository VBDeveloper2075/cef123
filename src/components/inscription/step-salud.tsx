"use client";

import { Controller, useFormContext, useWatch } from "react-hook-form";
import { CONDICIONES_SALUD } from "@/lib/constants";
import type { InscripcionForm } from "@/lib/schema";
import { Field, FieldError, Input, Label, Textarea } from "@/components/ui/field";

export function StepSalud() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<InscripcionForm>();
  const obra = useWatch({ control, name: "poseeObraSocial" });

  return (
    <div className="space-y-8">
      <section>
        <h2 className="font-serif text-2xl text-stone-900">Cobertura médica</h2>
        <fieldset className="mt-3">
          <legend className="mb-2 text-sm font-medium">¿Posee obra social o prepaga? *</legend>
          <div className="flex gap-2">
            {[
              { id: "si", label: "Sí" },
              { id: "no", label: "No" },
            ].map((opt) => (
              <label
                key={opt.id}
                className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-stone-200 bg-white px-4 py-2 text-sm has-[:checked]:border-[#1A3D8F] has-[:checked]:bg-[#1A3D8F] has-[:checked]:text-white"
              >
                <input
                  type="radio"
                  value={opt.id}
                  className="size-4 accent-[#1A3D8F]"
                  {...register("poseeObraSocial")}
                />
                {opt.label}
              </label>
            ))}
          </div>
          <FieldError message={errors.poseeObraSocial?.message} />
        </fieldset>
        {obra === "si" ? (
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field>
              <Label htmlFor="obraSocialNombre" required>
                Nombre de la cobertura
              </Label>
              <Input id="obraSocialNombre" {...register("obraSocialNombre")} />
              <FieldError message={errors.obraSocialNombre?.message} />
            </Field>
            <Field>
              <Label htmlFor="nroAfiliado" required>
                N.º de afiliado
              </Label>
              <Input id="nroAfiliado" {...register("nroAfiliado")} />
              <FieldError message={errors.nroAfiliado?.message} />
            </Field>
          </div>
        ) : null}
      </section>

      <section>
        <h2 className="font-serif text-2xl text-stone-900">Antecedentes de salud</h2>
        <p className="mt-1 text-sm text-stone-600">
          Marcá las condiciones preexistentes. Esta información se usa sólo para resguardo en
          actividades deportivas.
        </p>
        <Controller
          name="condicionesSalud"
          control={control}
          render={({ field }) => (
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {CONDICIONES_SALUD.map((c) => {
                const checked = field.value.includes(c.id);
                return (
                  <label
                    key={c.id}
                    className="flex cursor-pointer items-center gap-3 rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm"
                  >
                    <input
                      type="checkbox"
                      className="size-4 accent-[#1A3D8F]"
                      checked={checked}
                      onChange={() =>
                        field.onChange(
                          checked
                            ? field.value.filter((id) => id !== c.id)
                            : [...field.value, c.id],
                        )
                      }
                    />
                    {c.label}
                  </label>
                );
              })}
            </div>
          )}
        />
        <Field className="mt-4">
          <Label htmlFor="detalleSalud">Detalle de alergias, medicación u otras observaciones</Label>
          <Textarea id="detalleSalud" {...register("detalleSalud")} />
        </Field>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <h2 className="font-serif text-2xl text-stone-900 sm:col-span-2">Contactos de emergencia</h2>
        <Field className="sm:col-span-2">
          <Label htmlFor="hospitalEmergencia" required>
            Hospital / lugar a recurrir ante emergencias
          </Label>
          <Input id="hospitalEmergencia" {...register("hospitalEmergencia")} />
          <FieldError message={errors.hospitalEmergencia?.message} />
        </Field>
        <Field>
          <Label htmlFor="contactoEmergenciaNombre" required>
            Persona de contacto
          </Label>
          <Input id="contactoEmergenciaNombre" {...register("contactoEmergenciaNombre")} />
          <FieldError message={errors.contactoEmergenciaNombre?.message} />
        </Field>
        <Field>
          <Label htmlFor="contactoEmergenciaTelefono" required>
            Teléfono directo
          </Label>
          <Input
            id="contactoEmergenciaTelefono"
            inputMode="tel"
            {...register("contactoEmergenciaTelefono")}
          />
          <FieldError message={errors.contactoEmergenciaTelefono?.message} />
        </Field>
      </section>

      <label className="flex items-start gap-3 rounded-2xl border border-stone-200 bg-amber-50/60 p-4 text-sm text-stone-800">
        <input
          type="checkbox"
          className="mt-0.5 size-4 accent-[#1A3D8F]"
          {...register("declaracionJuradaSalud")}
        />
        <span>
          Declaro bajo juramento que los datos de salud informados son verdaderos y me comprometo a
          comunicar cualquier cambio relevante para la práctica deportiva. *
        </span>
      </label>
      <FieldError message={errors.declaracionJuradaSalud?.message} />
    </div>
  );
}
