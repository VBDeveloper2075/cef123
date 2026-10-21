import Image from "next/image";
import { CICLO_LECTIVO } from "@/lib/constants";

export function SiteHeader() {
  return (
    <header className="border-b border-[#1A3D8F]/15 bg-white">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 px-4 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex items-center gap-4">
          <Image
            src="/cef123.jpg"
            alt="CEF 123 Caseros"
            width={112}
            height={112}
            priority
            className="size-24 object-contain sm:size-28"
          />
          <div>
            <p className="text-xs font-bold tracking-[0.22em] text-[#1A3D8F] uppercase">
              Centro de Educación Física
            </p>
            <h1 className="mt-1 text-3xl font-black tracking-tight sm:text-4xl">
              <span className="text-[#1A3D8F]">Cef</span>
              <span className="text-[#C8102E]">123</span>
            </h1>
            <p className="-mt-1 text-lg font-bold tracking-[0.18em] text-[#C8102E] uppercase">
              Caseros
            </p>
          </div>
        </div>
        <div className="text-center sm:text-right">
          <p className="text-sm font-semibold text-[#1A3D8F]">Inscripción {CICLO_LECTIVO}</p>
          <p className="mt-1 max-w-xs text-xs text-stone-600">
            Ficha digital. Ahorramos fotocopias y el registro queda en la planilla del CEF.
          </p>
          <p className="mt-2 inline-block rounded-full border border-[#C8102E]/30 px-3 py-1 text-[11px] font-medium text-[#C8102E]">
            Edad al 30 de junio
          </p>
        </div>
      </div>
    </header>
  );
}
