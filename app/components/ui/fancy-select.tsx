'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

type FancyOption = {
  value: string;
  label: string;
  hint?: string;
};

type FancySelectProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  options: FancyOption[];
};

export default function FancySelect({
  value,
  onChange,
  placeholder = 'Select an option',
  options,
}: FancySelectProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const selected = useMemo(
    () => options.find((option) => option.value === value),
    [options, value],
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    window.addEventListener('mousedown', handleClickOutside);
    return () => window.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center justify-between rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-left text-sm text-white shadow-[0_8px_30px_rgba(0,0,0,0.12)] backdrop-blur-md transition hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-violet-500/40"
      >
        <span className={selected ? 'text-white' : 'text-white/60'}>
          {selected?.label ?? placeholder}
        </span>
        <span className="ml-3 text-white/70">{open ? '▲' : '▼'}</span>
      </button>

      {open ? (
        <div className="absolute z-50 mt-2 max-h-72 w-full overflow-auto rounded-2xl border border-white/20 bg-slate-950/80 p-2 shadow-[0_20px_50px_rgba(0,0,0,0.35)] backdrop-blur-xl">
          {options.length === 0 ? (
            <div className="rounded-xl px-3 py-2 text-sm text-white/60">No options available</div>
          ) : (
            options.map((option) => {
              const isActive = option.value === value;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                  className={`mb-1 flex w-full items-start justify-between rounded-xl px-3 py-2 text-left transition ${
                    isActive
                      ? 'bg-gradient-to-r from-violet-600/80 to-fuchsia-600/80 text-white'
                      : 'bg-white/5 text-white hover:bg-white/10'
                  }`}
                >
                  <div>
                    <div className="text-sm font-medium">{option.label}</div>
                    {option.hint ? <div className="text-xs text-white/60">{option.hint}</div> : null}
                  </div>

                  {isActive ? <span className="ml-3 text-sm">✓</span> : null}
                </button>
              );
            })
          )}
        </div>
      ) : null}
    </div>
  );
}
