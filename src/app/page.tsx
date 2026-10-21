import { InscriptionWizard } from "@/components/inscription/wizard";
import { CICLO_LECTIVO } from "@/lib/constants";

export default function Home() {
  return (
    <div className="min-h-full">
      <header className="border-b border-stone-200/80 bg-[#0d4f51] text-white">
        <div className="mx-auto flex max-w-5xl items-end justify-between px-4 py-8 sm:px-6">
          <div>
            <p className="text-xs font-semibold tracking-[0.28em] text-amber-300 uppercase">
              Centro de Educación Física
            </p>
            <h1 className="mt-2 font-serif text-4xl leading-none sm:text-5xl">
              Inscripción {CICLO_LECTIVO}
            </h1>
            <p className="mt-3 max-w-xl text-sm text-teal-50/80">
              Digitalizá la ficha de inscripción, la ficha médica y la autorización de imagen. El
              registro se anexa automáticamente a la planilla del CEF.
            </p>
          </div>
          <p className="hidden rounded-full border border-white/20 px-3 py-1 text-xs sm:block">
            Edad al 30 de junio
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
        <InscriptionWizard />
      </main>
    </div>
  );
}
