"use client";

import { soloDigitos } from "@/lib/age";
import { Input } from "./field";

type Props = {
  id?: string;
  value: string;
  onChange: (digits: string) => void;
  onBlur?: () => void;
};

export function CuilInput({ id, value, onChange, onBlur }: Props) {
  const d = soloDigitos(value).slice(0, 11);
  const pre = d.slice(0, 2);
  const mid = d.slice(2, 10);
  const last = d.slice(10, 11);

  function join(next: { pre?: string; mid?: string; last?: string }) {
    const a = soloDigitos(next.pre ?? pre).slice(0, 2);
    const b = soloDigitos(next.mid ?? mid).slice(0, 8);
    const c = soloDigitos(next.last ?? last).slice(0, 1);
    onChange(`${a}${b}${c}`);
  }

  return (
    <div className="flex items-center gap-2" onBlur={onBlur}>
      <Input
        id={id}
        inputMode="numeric"
        autoComplete="off"
        maxLength={2}
        placeholder="20"
        className="w-16 text-center font-mono tracking-widest"
        value={pre}
        onChange={(e) => join({ pre: e.target.value })}
        aria-label="Prefijo CUIL"
      />
      <span className="select-none text-lg font-bold text-[#1A3D8F]" aria-hidden>
        -
      </span>
      <Input
        inputMode="numeric"
        autoComplete="off"
        maxLength={8}
        placeholder="12345678"
        className="flex-1 text-center font-mono tracking-widest"
        value={mid}
        onChange={(e) => join({ mid: e.target.value })}
        aria-label="Número de documento del CUIL"
      />
      <span className="select-none text-lg font-bold text-[#1A3D8F]" aria-hidden>
        -
      </span>
      <Input
        inputMode="numeric"
        autoComplete="off"
        maxLength={1}
        placeholder="9"
        className="w-12 text-center font-mono tracking-widest"
        value={last}
        onChange={(e) => join({ last: e.target.value })}
        aria-label="Dígito verificador CUIL"
      />
    </div>
  );
}
