'use client';

import { useCallback } from 'react';
import type { OutfitCardData, CardSkinId } from '@/app/lib/outfit-card';
import { DEFAULT_CARD_SKIN, updateCardSkin } from '@/app/lib/outfits/cardSkin';
import { SKIN_REGISTRY } from '@/app/components/outfit-card/skins/skinRegistry';

interface PremiumSelectionsProps {
  data: OutfitCardData;
  selectedSkin: CardSkinId | undefined;
  language?: 'pt-BR' | 'en';
  onSelectSkin: (skinId: CardSkinId) => void;
}

const THUMB_W = 120;
const THUMB_H = 187;
const CARD_W = 360;
const CARD_H = 560;
const SCALE = THUMB_W / CARD_W;

const LABELS: Record<string, { title: string; subtitle: string }> = {
  'pt-BR': {
    title: 'Estilos premium de card',
    subtitle: 'Escolha o estilo visual do seu card de outfit.',
  },
  'en': {
    title: 'Premium card styles',
    subtitle: 'Choose the visual style for your outfit card.',
  },
};

export default function PremiumSelections({
  data,
  selectedSkin,
  language = 'pt-BR',
  onSelectSkin,
}: PremiumSelectionsProps) {
  const activeSkin = selectedSkin ?? DEFAULT_CARD_SKIN;
  const label = LABELS[language] ?? LABELS['pt-BR']!;

  const handleSelect = useCallback(
    async (skinId: CardSkinId) => {
      onSelectSkin(skinId);
      if (data.schemeId) {
        try {
          await updateCardSkin(data.schemeId, skinId);
        } catch {
          // Firestore update is best-effort; UI state is already updated
        }
      }
    },
    [data.schemeId, onSelectSkin],
  );

  return (
    <section className="rounded-xl border border-orange-500/30 bg-black/40 p-4">
      {/* Eyebrow */}
      <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-orange-500 mb-0.5">
        Card Style
      </p>
      <p className="text-sm font-semibold text-white">{label.title}</p>
      <p className="mt-0.5 text-[11px] text-white/60">{label.subtitle}</p>

      {/* 2-column grid (4 rows, last slot empty) */}
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-2">
        {SKIN_REGISTRY.map((skin) => {
          const isSelected = activeSkin === skin.id;
          const SkinComponent = skin.Component;
          return (
            <button
              key={skin.id}
              type="button"
              onClick={() => void handleSelect(skin.id)}
              className="group relative flex flex-col items-center gap-1.5 rounded-lg p-0 transition-transform hover:-translate-y-0.5"
              style={{
                boxShadow: isSelected
                  ? '0 0 0 3px #f97316, 0 0 16px rgba(249,115,22,0.35)'
                  : '0 0 0 1px rgba(255,255,255,0.12)',
                borderRadius: 8,
              }}
            >
              {/* Thumbnail */}
              <div
                style={{
                  width: THUMB_W,
                  height: THUMB_H,
                  overflow: 'hidden',
                  borderRadius: 6,
                  position: 'relative',
                  flexShrink: 0,
                }}
              >
                <div
                  style={{
                    width: CARD_W,
                    height: CARD_H,
                    transform: `scale(${SCALE})`,
                    transformOrigin: 'top left',
                    pointerEvents: 'none',
                    userSelect: 'none',
                  }}
                >
                  <SkinComponent data={data} showHero={true} />
                </div>
              </div>

              {/* Label */}
              <span
                className="font-mono text-[9px] uppercase tracking-[0.18em] pb-1"
                style={{ color: isSelected ? '#f97316' : 'rgba(255,255,255,0.55)' }}
              >
                {language === 'pt-BR' ? skin.labelPt : skin.labelEn}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
