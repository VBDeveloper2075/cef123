"use client";

import { Controller, useFormContext, useWatch } from "react-hook-form";
import { edadAl30DeJunio } from "@/lib/age";
import {
  CICLO_LECTIVO,
  DISCIPLINAS,
  GESTIONES,
  IDENTIDADES_GENERO,
  NIVELES_MODALIDAD,
  SITUACIONES_DNI,
  TURNOS,
} from "@/lib/constants";
import type { InscripcionForm } from "@/lib/schema";
import { CuilInput } from "@/components/ui/cuil-input";
import { Field, FieldError, Input, Label, Select, Textarea } from "@/components/ui/field";

export function StepEstudiante() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<InscripcionForm>();
  const fecha = useWatch({ control, name: "fechaNacimiento" });
  const edad = fecha ? edadAl30DeJunio(fecha) : null;

  return (
    <div className="space-y-8">
      <section>
        <h2 className="font-serif text-2xl text-stone-900">Propuesta educativa</h2>
        
        <p className="mt-5 text-sm font-medium text-stone-800">Marcá las disciplinas (opcional)</p>
        <Controller
          name="disciplinas"
          control={control}
          render={({ field }) => (
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              {DISCIPLINAS.map((d) => {
                const checked = field.value.includes(d.id);
                return (
                  <label
                    key={d.id}
                    className={`flex cursor-pointer items-center gap-3 rounded-2xl border px-4 py-3 text-sm transition ${
                      checked
                        ? "border-[#1A3D8F] bg-blue-50 text-[#152f6e]"
                        : "border-stone-200 bg-white hover:border-stone-300"
                    }`}
                  >
                    <input
                      type="checkbox"
                      className="size-4 accent-[#1A3D8F]"
                      checked={checked}
                      onChange={() => {
                        field.onChange(
                          checked
                            ? field.value.filter((id) => id !== d.id)
                            : [...field.value, d.id],
                        );
                      }}
                    />
                    {d.label}
                  </label>
                );
              })}
            </div>
          )}
        />
        <FieldError message={errors.disciplinas?.message} />

        <fieldset className="mt-5">
          <legend className="mb-2 text-sm font-medium">Turno *</legend>
          <div className="flex flex-wrap gap-2">
            {TURNOS.map((t) => (
              <label
                key={t.id}
                className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-stone-200 bg-white px-4 py-2 text-sm has-[:checked]:border-[#1A3D8F] has-[:checked]:bg-[#1A3D8F] has-[:checked]:text-white"
              >
                <input type="radio" value={t.id} className="size-4 accent-[#1A3D8F]" {...register("turno")} />
                {t.label}
              </label>
            ))}
          </div>
          <FieldError message={errors.turno?.message} />
        </fieldset>
        <p className="mt-1 text-sm text-stone-600">
          Escribí las disciplinas o actividades en las que querés inscribirte y el detalle que
          consideres necesario.
        </p>
        <Field className="mt-4">
          <Label htmlFor="propuestaEducativa" required>
            Propuesta
          </Label>
          <Textarea
            id="propuestaEducativa"
            rows={6}
            className="min-h-36"
            placeholder="Ej.: Natación turno mañana y atletismo. Si no hay cupo, acepto lista de espera en básquet."
            {...register("propuestaEducativa")}
          />
          <FieldError message={errors.propuestaEducativa?.message} />
          <p className="mt-2 text-sm font-semibold text-[#C8102E]">
            Las solicitudes se considerarán según los cupos disponibles y pueden quedar en lista de
            espera.
          </p>
        </Field>

      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <h2 className="font-serif text-2xl text-stone-900 sm:col-span-2">Datos del Alumna/o</h2>
        <Field>
          <Label htmlFor="apellido" required>
            Apellido
          </Label>
          <Input id="apellido" autoComplete="family-name" {...register("apellido")} />
          <FieldError message={errors.apellido?.message} />
        </Field>
        <Field>
          <Label htmlFor="nombre" required>
            Nombre
          </Label>
          <Input id="nombre" autoComplete="given-name" {...register("nombre")} />
          <FieldError message={errors.nombre?.message} />
        </Field>
        <Field>
          <Label htmlFor="fechaNacimiento" required>
            Fecha de nacimiento
          </Label>
          <Input id="fechaNacimiento" type="date" {...register("fechaNacimiento")} />
          <FieldError message={errors.fechaNacimiento?.message} />
        </Field>
        <Field>
          <Label>Edad al 30 de junio de {CICLO_LECTIVO}</Label>
          <div className="flex h-11 items-center rounded-xl border border-dashed border-stone-300 bg-stone-50 px-3 text-sm text-stone-700">
            {edad === null ? "Se calcula automáticamente" : `${edad} años`}
          </div>
        </Field>
        <Field>
          <Label htmlFor="situacionDni" required>
            Situación DNI
          </Label>
          <Select id="situacionDni" {...register("situacionDni")}>
            <option value="">Seleccionar…</option>
            {SITUACIONES_DNI.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </Select>
          <FieldError message={errors.situacionDni?.message} />
        </Field>
        <Field>
          <Label htmlFor="dni" required>
            Número de DNI
          </Label>
          <Input id="dni" inputMode="numeric" {...register("dni")} />
          <FieldError message={errors.dni?.message} />
        </Field>
        <Field>
          <Label htmlFor="cuil" required>
            CUIL
          </Label>
          <Controller
            name="cuil"
            control={control}
            render={({ field }) => (
              <CuilInput
                id="cuil"
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
              />
            )}
          />
          
          <FieldError message={errors.cuil?.message} />
        </Field>
        <Field>
          <Label htmlFor="identidadGenero" required>
            Identidad de género
          </Label>
          <Select id="identidadGenero" {...register("identidadGenero")}>
            <option value="">Seleccionar…</option>
            {IDENTIDADES_GENERO.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </Select>
          <FieldError message={errors.identidadGenero?.message} />
        </Field>
        <Field>
          <Label htmlFor="lugarNacimiento" required>
            Lugar de nacimiento
          </Label>
          <Input id="lugarNacimiento" {...register("lugarNacimiento")} />
          <FieldError message={errors.lugarNacimiento?.message} />
        </Field>
        <Field>
          <Label htmlFor="nacionalidad" required>
            Nacionalidad
          </Label>
          <Input id="nacionalidad" {...register("nacionalidad")} />
          <FieldError message={errors.nacionalidad?.message} />
        </Field>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <h2 className="font-serif text-2xl text-stone-900 sm:col-span-2">Domicilio y contacto</h2>
        <Field className="sm:col-span-2">
          <Label htmlFor="calle" required>
            Calle
          </Label>
          <Input id="calle" {...register("calle")} />
          <FieldError message={errors.calle?.message} />
        </Field>
        <Field>
          <Label htmlFor="numero" required>
            Número
          </Label>
          <Input id="numero" {...register("numero")} />
          <FieldError message={errors.numero?.message} />
        </Field>
        <Field>
          <Label htmlFor="pisoDepto">Piso / Depto</Label>
          <Input id="pisoDepto" {...register("pisoDepto")} />
        </Field>
        <Field className="sm:col-span-2">
          <Label htmlFor="entreCalles">Entre calles</Label>
          <Input id="entreCalles" {...register("entreCalles")} />
        </Field>
        <Field>
          <Label htmlFor="localidad" required>
            Localidad
          </Label>
          <Input id="localidad" {...register("localidad")} />
          <FieldError message={errors.localidad?.message} />
        </Field>
        <Field>
          <Label htmlFor="distrito" required>
            Distrito
          </Label>
          <Input id="distrito" {...register("distrito")} />
          <FieldError message={errors.distrito?.message} />
        </Field>
        <Field>
          <Label htmlFor="telefonoCelular" required>
            Teléfono celular
          </Label>
          <Input id="telefonoCelular" inputMode="tel" {...register("telefonoCelular")} />
          <FieldError message={errors.telefonoCelular?.message} />
        </Field>
        <Field>
          <Label htmlFor="email" required>
            Correo electrónico
          </Label>
          <Input id="email" type="email" autoComplete="email" {...register("email")} />
          <FieldError message={errors.email?.message} />
        </Field>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <h2 className="font-serif text-2xl text-stone-900 sm:col-span-2">
          Establecimiento educativo de origen
        </h2>
        <p className="text-sm text-stone-600 sm:col-span-2">
          Completá solo si corresponde. Para menores de 18 años.
        </p>
        <Field>
          <Label htmlFor="nivelModalidad">Nivel / Modalidad</Label>
          <Select id="nivelModalidad" {...register("nivelModalidad")}>
            <option value="">Seleccionar…</option>
            {NIVELES_MODALIDAD.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </Select>
        </Field>
        <Field>
          <Label htmlFor="gestion">Gestión</Label>
          <Select id="gestion" {...register("gestion")}>
            <option value="">Seleccionar…</option>
            {GESTIONES.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </Select>
        </Field>
        <Field>
          <Label htmlFor="dependencia">Dependencia</Label>
          <Input id="dependencia" placeholder="Ej. Dirección General de Cultura y Educación" {...register("dependencia")} />
        </Field>
        <Field>
          <Label htmlFor="anoEstudio">Año de estudio</Label>
          <Input id="anoEstudio" placeholder="Ej. 4.º año" {...register("anoEstudio")} />
        </Field>
        <Field className="sm:col-span-2">
          <Label htmlFor="nombreEscuela">Nombre de la escuela</Label>
          <Input
            id="nombreEscuela"
            placeholder="Escuela de Educación Secundaria N° 14"
            {...register("nombreEscuela")}
          />
        </Field>
      </section>
    </div>
  );
}
