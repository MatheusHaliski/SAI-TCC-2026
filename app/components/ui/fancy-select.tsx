'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

type FancyOption = {
  value: string;
  label: string;
  hint?: string;
  group?: string;
};

type FancySelectProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  options: FancyOption[];
  label?: string;
};

export default function FancySelect({
  value,
  onChange,
  placeholder = 'Select an option',
  options,
  label,
}: FancySelectProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  const selected = useMemo(
    () => options.find((option) => option.value === value),
    [options, value],
  );

  const groupedOptions = useMemo(() => {
    const groups = new Map<string, FancyOption[]>();

    for (const option of options) {
      const groupName = option.group ?? 'Options';
      const current = groups.get(groupName) ?? [];
      current.push(option);
      groups.set(groupName, current);
    }

    return Array.from(groups.entries());
  }, [options]);

  useEffect(() => {
    const handleOutside = (event: MouseEvent) => {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    window.addEventListener('mousedown', handleOutside);
    return () => window.removeEventListener('mousedown', handleOutside);
  }, []);

  return (
    <div ref={rootRef} className="relative w-full">
      {label ? (
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/60">
          {label}
        </p>
      ) : null}

      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={`group relative flex w-full items-center justify-between overflow-hidden rounded-2xl border px-4 py-3 text-left shadow-[0_12px_32px_rgba(0,0,0,0.18)] backdrop-blur-xl transition ${
          open
            ? 'border-fuchsia-400/50 bg-white/16 ring-2 ring-violet-500/30'
            : 'border-white/20 bg-white/10 hover:bg-white/14'
        }`}
      >
        <div className="min-w-0">
          <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/45">
            Selection
          </div>
          <div className={`truncate text-sm font-medium ${selected ? 'text-white' : 'text-white/55'}`}>
            {selected?.label ?? placeholder}
          </div>
          <div className="truncate text-xs text-white/45">
            {selected?.hint ?? 'Open to choose an item'}
          </div>
        </div>

        <div
          className={`ml-4 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white/75 transition ${
            open ? 'rotate-180' : ''
          }`}
        >
          ▾
        </div>

        <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-r from-violet-500/0 via-fuchsia-500/0 to-pink-500/0 opacity-0 transition group-hover:opacity-100 group-hover:from-violet-500/5 group-hover:via-fuchsia-500/5 group-hover:to-pink-500/5" />
      </button>

      {open ? (
        <div className="absolute z-50 mt-3 w-full overflow-hidden rounded-3xl border border-white/20 bg-slate-950/80 shadow-[0_24px_60px_rgba(0,0,0,0.38)] backdrop-blur-2xl">
          <div className="max-h-80 overflow-auto p-3">
            {groupedOptions.length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/55">
                No options available
              </div>
            ) : (
              groupedOptions.map(([groupName, groupItems]) => (
                <div key={groupName} className="mb-3 last:mb-0">
                  <div className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/40">
                    {groupName}
                  </div>

                  <div className="space-y-2">
                    {groupItems.map((option) => {
                      const isSelected = option.value === value;

                      return (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => {
                            onChange(option.value);
                            setOpen(false);
                          }}
                          className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left transition ${
                            isSelected
                              ? 'border-fuchsia-400/40 bg-gradient-to-r from-violet-600/70 via-fuchsia-600/70 to-pink-600/70 text-white shadow-[0_10px_30px_rgba(168,85,247,0.28)]'
                              : 'border-white/10 bg-white/5 text-white hover:border-white/20 hover:bg-white/10'
                          }`}
                        >
                          <div className="min-w-0">
                            <div className="truncate text-sm font-semibold">
                              {option.label}
                            </div>
                            {option.hint ? (
                              <div className="truncate text-xs text-white/60">
                                {option.hint}
                              </div>
                            ) : null}
                          </div>

                          <div
                            className={`ml-4 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-xs ${
                              isSelected
                                ? 'border-white/20 bg-white/15 text-white'
                                : 'border-white/10 bg-transparent text-white/40'
                            }`}
                          >
                            {isSelected ? '✓' : '•'}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
