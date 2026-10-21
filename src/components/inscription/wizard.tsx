"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, Check, Download, Loader2, Printer } from "lucide-react";
import { useMemo, useState } from "react";
import { FormProvider, useForm, useWatch, type FieldErrors } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { esMenorDeEdad } from "@/lib/age";
import { CICLO_LECTIVO, DISCIPLINAS, TURNOS } from "@/lib/constants";
import type { Comprobante } from "@/lib/pdf";
import { descargarComprobantePdf } from "@/lib/pdf";
import {
  CAMPOS_PASO_ESTUDIANTE,
  CAMPOS_PASO_IMAGEN,
  CAMPOS_PASO_RESPONSABLE,
  CAMPOS_PASO_SALUD,
  defaultValues,
  inscripcionSchema,
  type InscripcionForm,
  type InscripcionInput,
} from "@/lib/schema";
import { StepEstudiante } from "./step-estudiante";
import { StepImagen } from "./step-imagen";
import { StepResponsable } from "./step-responsable";
import { StepSalud } from "./step-salud";

const BASE_STEPS = [
  { id: "estudiante", title: "Estudiante" },
  { id: "responsable", title: "Responsable" },
  { id: "salud", title: "Ficha médica" },
  { id: "imagen", title: "Imagen" },
] as const;

export function InscriptionWizard() {
  const form = useForm<InscripcionInput, unknown, InscripcionForm>({
    resolver: zodResolver(inscripcionSchema),
    defaultValues,
    mode: "onTouched",
  });
  const [step, setStep] = useState(0);
  const [sending, setSending] = useState(false);
  const [comprobante, setComprobante] = useState<Comprobante | null>(null);
  const fecha = useWatch({ control: form.control, name: "fechaNacimiento" });
  const menor = fecha ? esMenorDeEdad(fecha) : true;

  const steps = useMemo(
    () => (menor ? [...BASE_STEPS] : BASE_STEPS.filter((s) => s.id !== "responsable")),
    [menor],
  );
  const current = steps[step];

  async function next() {
    const id = current.id;
    const fields =
      id === "estudiante"
        ? CAMPOS_PASO_ESTUDIANTE
        : id === "responsable"
          ? CAMPOS_PASO_RESPONSABLE
          : id === "salud"
            ? CAMPOS_PASO_SALUD
            : CAMPOS_PASO_IMAGEN;
    const ok = await form.trigger(fields, { shouldFocus: true });
    if (!ok) {
      toast.error("Hay campos por completar en este paso.");
      return;
    }
    setStep((s) => Math.min(s + 1, steps.length - 1));
  }

  function irAlPrimerError(errors: FieldErrors<InscripcionForm>) {
    const keys = Object.keys(errors);
    const grupos: { id: (typeof BASE_STEPS)[number]["id"]; fields: (keyof InscripcionForm)[] }[] = [
      { id: "estudiante", fields: CAMPOS_PASO_ESTUDIANTE },
      { id: "responsable", fields: CAMPOS_PASO_RESPONSABLE },
      { id: "salud", fields: CAMPOS_PASO_SALUD },
      { id: "imagen", fields: CAMPOS_PASO_IMAGEN },
    ];
    const destino = grupos.find((g) =>
      steps.some((s) => s.id === g.id) && g.fields.some((f) => keys.includes(f)),
    );
    if (destino) {
      const index = steps.findIndex((s) => s.id === destino.id);
      if (index >= 0) setStep(index);
    }
    toast.error("Hay campos por completar. Revisá el paso indicado.");
  }

  async function onSubmit(data: InscripcionForm) {
    setSending(true);
    try {
      const res = await fetch("/api/inscribir", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = (await res.json()) as Comprobante & { ok?: boolean; message?: string };
      if (!res.ok || json.ok === false) {
        throw new Error(json.message ?? "No se pudo registrar la inscripción.");
      }
      setComprobante(json);
      toast.success(`Inscripción ${json.legajo} registrada.`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error de red. Intentá de nuevo.");
    } finally {
      setSending(false);
    }
  }

  if (comprobante) {
    return <SuccessScreen data={comprobante} />;
  }

  return (
    <FormProvider {...form}>
      <form
        noValidate
        onSubmit={form.handleSubmit(onSubmit, irAlPrimerError)}
        className="rounded-[28px] border border-stone-200 bg-white p-5 shadow-sm sm:p-8"
      >
        <ol className="mb-8 flex gap-2 overflow-x-auto pb-1">
          {steps.map((s, i) => (
            <li key={s.id} className="flex min-w-0 flex-1 items-center gap-2">
              <span
                className={`flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                  i < step
                    ? "bg-teal-800 text-white"
                    : i === step
                      ? "bg-amber-400 text-stone-900"
                      : "bg-stone-100 text-stone-500"
                }`}
              >
                {i < step ? <Check className="size-4" /> : i + 1}
              </span>
              <span className="hidden truncate text-xs font-medium sm:inline">{s.title}</span>
            </li>
          ))}
        </ol>

        {current.id === "estudiante" ? <StepEstudiante /> : null}
        {current.id === "responsable" ? <StepResponsable /> : null}
        {current.id === "salud" ? <StepSalud /> : null}
        {current.id === "imagen" ? <StepImagen /> : null}

        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-stone-100 pt-6">
          <Button
            type="button"
            variant="secondary"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0 || sending}
          >
            <ArrowLeft className="size-4" />
            Atrás
          </Button>
          {step < steps.length - 1 ? (
            <Button type="button" onClick={next}>
              Continuar
              <ArrowRight className="size-4" />
            </Button>
          ) : (
            <Button type="submit" disabled={sending}>
              {sending ? <Loader2 className="size-4 animate-spin" /> : null}
              {sending ? "Registrando…" : "Enviar inscripción"}
            </Button>
          )}
        </div>
      </form>
    </FormProvider>
  );
}

function SuccessScreen({ data }: { data: Comprobante }) {
  const disciplinas = data.disciplinas
    .map((id) => DISCIPLINAS.find((d) => d.id === id)?.label ?? id)
    .join(", ");
  const turno = TURNOS.find((t) => t.id === data.turno)?.label ?? data.turno;

  return (
    <div className="rounded-[28px] border border-stone-200 bg-white p-6 shadow-sm sm:p-10 print:border-0 print:shadow-none">
      <p className="text-xs font-semibold tracking-[0.2em] text-teal-800 uppercase">
        Ciclo lectivo {CICLO_LECTIVO}
      </p>
      <h2 className="mt-2 font-serif text-3xl text-stone-900">Inscripción registrada</h2>
      <p className="mt-2 text-stone-600">
        Guardá este comprobante. El registro se anexó a la planilla administrativa.
      </p>
      <dl className="mt-8 grid gap-4 sm:grid-cols-2">
        <Item label="Legajo" value={data.legajo} />
        <Item label="Estudiante" value={data.apellidoNombre} />
        <Item label="DNI" value={data.dni || "Sin DNI"} />
        <Item label="Nacimiento" value={data.fechaNacimiento} />
        <Item label="Edad al 30/06" value={data.edad != null ? `${data.edad}` : "—"} />
        <Item label="Turno" value={turno} />
        <Item label="Disciplinas" value={disciplinas} />
        <Item label="Observaciones" value={data.observaciones || "Ninguna"} />
      </dl>
      <div className="mt-8 flex flex-wrap gap-3 print:hidden">
        <Button type="button" onClick={() => descargarComprobantePdf(data)}>
          <Download className="size-4" />
          Descargar PDF
        </Button>
        <Button type="button" variant="secondary" onClick={() => window.print()}>
          <Printer className="size-4" />
          Imprimir
        </Button>
      </div>
    </div>
  );
}

function Item({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-stone-50 px-4 py-3">
      <dt className="text-xs tracking-wide text-stone-500 uppercase">{label}</dt>
      <dd className="mt-1 font-medium text-stone-900">{value}</dd>
    </div>
  );
}
