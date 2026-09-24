'use client';

import { useCallback, useId, useRef } from 'react';
import type { KeyboardEvent } from 'react';

/**
 * SubTabs — padrão único de sub-abas / filtros em pílula usado nas telas de
 * Perfil Lookbook (RF6), Marcas (RF14) e Celebridades (RF22).
 *
 * - `variant="tabs"`   → semântica WAI-ARIA de tablist/tab (aria-selected).
 * - `variant="filter"` → grupo de filtros exclusivos (aria-pressed), ex.: o
 *   filtro de ocasião do header da lista (RF6.CA10) e o filtro "todos" (RF31.CA04).
 *
 * Navegação por teclado (RF23.CA06 / RNF7): setas ←/→, Home e End movem o foco
 * e ativam a aba; o foco visível usa o token --ring.
 */
export interface SubTabItem {
  key: string;
  label: string;
  count?: number;
}

interface SubTabsProps {
  items: SubTabItem[];
  activeKey: string;
  onChange: (key: string) => void;
  ariaLabel: string;
  variant?: 'tabs' | 'filter';
  size?: 'sm' | 'md';
  className?: string;
}

export default function SubTabs({
  items,
  activeKey,
  onChange,
  ariaLabel,
  variant = 'tabs',
  size = 'md',
  className,
}: SubTabsProps) {
  const baseId = useId();
  const buttonsRef = useRef<Array<HTMLButtonElement | null>>([]);

  const focusAndActivate = useCallback(
    (index: number) => {
      if (!items.length) return;
      const next = (index + items.length) % items.length;
      const item = items[next];
      if (!item) return;
      buttonsRef.current[next]?.focus();
      onChange(item.key);
    },
    [items, onChange],
  );

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        event.preventDefault();
        focusAndActivate(index + 1);
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        event.preventDefault();
        focusAndActivate(index - 1);
        break;
      case 'Home':
        event.preventDefault();
        focusAndActivate(0);
        break;
      case 'End':
        event.preventDefault();
        focusAndActivate(items.length - 1);
        break;
      default:
        break;
    }
  };

  const isTabs = variant === 'tabs';
  const padding = size === 'sm' ? '0.25rem 0.625rem' : '0.375rem 0.875rem';
  const fontSize = size === 'sm' ? '0.6875rem' : '0.75rem';

  return (
    <div
      role={isTabs ? 'tablist' : 'group'}
      aria-label={ariaLabel}
      className={`sai-subtabs flex flex-wrap items-center gap-2 ${className ?? ''}`}
    >
      {items.map((item, index) => {
        const active = item.key === activeKey;
        return (
          <button
            key={item.key}
            ref={(node) => {
              buttonsRef.current[index] = node;
            }}
            type="button"
            id={`${baseId}-${item.key}`}
            role={isTabs ? 'tab' : undefined}
            aria-selected={isTabs ? active : undefined}
            aria-pressed={isTabs ? undefined : active}
            tabIndex={isTabs ? (active ? 0 : -1) : 0}
            data-active={active ? 'true' : 'false'}
            onClick={() => onChange(item.key)}
            onKeyDown={(event) => handleKeyDown(event, index)}
            className="sai-subtab focus-visible:outline-none"
            style={{
              borderRadius: '9999px',
              padding,
              fontSize,
              fontWeight: active ? 700 : 500,
              letterSpacing: '0.02em',
              lineHeight: 1.2,
              cursor: 'pointer',
              transition: 'background 0.15s, color 0.15s, border-color 0.15s, box-shadow 0.15s',
              border: active ? '1px solid var(--primary)' : '1px solid rgba(255,255,255,0.22)',
              background: active ? 'var(--brand-gradient)' : 'rgba(255,255,255,0.06)',
              color: active ? 'var(--primary-foreground)' : 'rgba(255,255,255,0.72)',
              boxShadow: active ? '0 6px 18px rgba(124,58,237,0.28)' : 'none',
            }}
          >
            {item.label}
            {typeof item.count === 'number' ? (
              <span
                aria-hidden
                style={{
                  marginLeft: '0.375rem',
                  borderRadius: '9999px',
                  padding: '0 0.4rem',
                  fontSize: '0.625rem',
                  fontWeight: 700,
                  background: active ? 'rgba(255,255,255,0.22)' : 'rgba(255,255,255,0.10)',
                }}
              >
                {item.count}
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
