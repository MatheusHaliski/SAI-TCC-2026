'use client';

import { MannequinProfile } from '@/app/lib/fashion-ai/types/mannequin';
import { useEffect, useState } from 'react';

interface Props {
  mannequins: MannequinProfile[];
  selectedId: MannequinProfile['id'];
  onChange: (id: MannequinProfile['id']) => void;
}

export default function Tester2DMannequinSelector({ mannequins, selectedId, onChange }: Props) {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const check = () => setIsDark(document.documentElement.getAttribute('data-theme') !== 'light');
    check();
    const observer = new MutationObserver(check);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);

  return (
    <div className="flex flex-wrap gap-2">
      {mannequins.map((mannequin) => {
        const active = selectedId === mannequin.id;
        return (
          <button
            key={mannequin.id}
            onClick={() => onChange(mannequin.id)}
            className="rounded-xl border px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em]"
            style={{
              background: active ? '#7c3aed' : 'transparent',
              borderColor: active ? '#7c3aed' : isDark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.2)',
              color: active ? '#ffffff' : isDark ? '#ffffff' : '#0f172a',
            }}
          >
            {mannequin.label}
          </button>
        );
      })}
    </div>
  );
}