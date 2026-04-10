'use client';

import { TESTER_2D_MANNEQUINS, Tester2DMannequin } from '@/app/config/tester2dMannequins';

interface Props {
  selectedId: Tester2DMannequin['id'];
  onChange: (id: Tester2DMannequin['id']) => void;
}

export default function Tester2DMannequinSelector({ selectedId, onChange }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {TESTER_2D_MANNEQUINS.map((mannequin) => (
        <button
          key={mannequin.id}
          onClick={() => onChange(mannequin.id)}
          className={`rounded-xl border px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] ${selectedId === mannequin.id ? 'border-white bg-white text-black' : 'border-white/25 text-white'}`}
        >
          {mannequin.label}
        </button>
      ))}
    </div>
  );
}
