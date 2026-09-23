'use client';

import { useEffect, useMemo, useState } from 'react';
import type { SubTabItem } from '@/app/components/shared/SubTabs';

export const ALL_FILTER_KEY = 'todos';

const readStored = (storageKey: string): string => {
  if (typeof window === 'undefined') return ALL_FILTER_KEY;
  try {
    return window.sessionStorage.getItem(storageKey) || ALL_FILTER_KEY;
  } catch {
    return ALL_FILTER_KEY;
  }
};

const writeStored = (storageKey: string, value: string): void => {
  if (typeof window === 'undefined') return;
  try {
    window.sessionStorage.setItem(storageKey, value);
  } catch {
    // Armazenamento indisponível (modo privado, cota): o filtro só vive na sessão do componente.
  }
};

const normalizeKey = (value: string): string =>
  value
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

/**
 * useSectionFilter — filtro de header de lista (RF6.CA02 / RF6.CA10 / RF31.CA04).
 *
 * Deriva as opções a partir dos próprios itens já carregados (sem chamada extra
 * à API), inclui a opção "Todos" e persiste a escolha em sessionStorage para que
 * o filtro continue aplicado ao voltar da página de detalhe (RF6.CA10 / RF31.CA05).
 */
export function useSectionFilter<T>(
  items: T[],
  getValue: (item: T) => string | undefined | null,
  storageKey: string,
  allLabel = 'Todos',
) {
  const [selected, setSelectedState] = useState<string>(ALL_FILTER_KEY);

  useEffect(() => {
    setSelectedState(readStored(storageKey));
  }, [storageKey]);

  const options = useMemo<SubTabItem[]>(() => {
    const counts = new Map<string, { label: string; count: number }>();
    for (const item of items) {
      const raw = (getValue(item) ?? '').trim();
      if (!raw) continue;
      const key = normalizeKey(raw);
      if (!key) continue;
      const entry = counts.get(key);
      if (entry) entry.count += 1;
      else counts.set(key, { label: raw, count: 1 });
    }
    const derived = Array.from(counts.entries())
      .sort((a, b) => a[1].label.localeCompare(b[1].label, 'pt-BR'))
      .map(([key, entry]) => ({ key, label: entry.label, count: entry.count }));
    return [{ key: ALL_FILTER_KEY, label: allLabel, count: items.length }, ...derived];
  }, [allLabel, getValue, items]);

  // Se o valor persistido não existe mais na lista (ex.: item excluído), volta para "Todos".
  const effectiveSelected = options.some((option) => option.key === selected) ? selected : ALL_FILTER_KEY;

  const filtered = useMemo(() => {
    if (effectiveSelected === ALL_FILTER_KEY) return items;
    return items.filter((item) => normalizeKey((getValue(item) ?? '').trim()) === effectiveSelected);
  }, [effectiveSelected, getValue, items]);

  const setSelected = (key: string) => {
    setSelectedState(key);
    writeStored(storageKey, key);
  };

  return { selected: effectiveSelected, setSelected, options, filtered };
}
