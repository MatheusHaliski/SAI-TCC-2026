'use client';

import type {
  CardSkinId,
  OutfitCardData,
  OutfitCardDisplayMode,
  OutfitCardDisplayOptions,
} from '@/app/lib/outfit-card';
import FancySelect from '@/app/components/ui/fancy-select';

interface ModernPremiumSelectionsProps {
  language?: 'pt-BR' | 'en';
  value: OutfitCardDisplayOptions;
  onChange: (next: OutfitCardDisplayOptions) => void;

  data?: never;
  selectedSkin?: never;
  onSelectSkin?: never;
}

interface LegacyPremiumSelectionsProps {
  language?: 'pt-BR' | 'en';
  data: OutfitCardData;
  selectedSkin?: CardSkinId;
  onSelectSkin: (skinId: CardSkinId) => void;

  value?: never;
  onChange?: never;
}

type PremiumSelectionsProps =
  | ModernPremiumSelectionsProps
  | LegacyPremiumSelectionsProps;

const SUPPORT_COLORS = [
  {
    value: 'rgba(2,6,23,0.72)',
    label: 'Preto translúcido',
    hint: 'Máxima leitura sobre arte AI',
  },
  {
    value: 'rgba(15,23,42,0.56)',
    label: 'Grafite suave',
    hint: 'Mantém contraste sem esconder o fundo',
  },
  {
    value: 'rgba(255,255,255,0.82)',
    label: 'Branco editorial',
    hint: 'Bom para fundos escuros',
  },
  {
    value: 'rgba(120,53,15,0.62)',
    label: 'Caramelo profundo',
    hint: 'Quente e premium',
  },
  {
    value: 'rgba(20,83,45,0.58)',
    label: 'Verde atelier',
    hint: 'Natural e elegante',
  },
  {
    value: 'rgba(76,29,149,0.58)',
    label: 'Violeta noite',
    hint: 'Cenográfico sem ofuscar texto',
  },
];

const DISPLAY_MODES: Array<{
  value: OutfitCardDisplayMode;
  label: string;
  hint: string;
}> = [
  {
    value: 'complete',
    label: 'Card completo',
    hint: 'Foto, detalhes e lista de peças',
  },
  {
    value: 'hide-hero',
    label: 'Sem foto do usuário',
    hint: 'Mantém texto e peças',
  },
  {
    value: 'hide-pieces',
    label: 'Sem lista de peças',
    hint: 'Mantém foto e contexto do look',
  },
  {
    value: 'pieces-only',
    label: 'Só lista de peças',
    hint: 'Remove foto, textos e ações',
  },
];

const CARD_SKINS: Array<{
  value: CardSkinId;
  label: string;
  hint: string;
}> = [
  {
    value: 'atelier',
    label: 'Atelier',
    hint: 'Visual editorial clássico',
  },
  {
    value: 'spread',
    label: 'Spread',
    hint: 'Composição ampla de revista',
  },
  {
    value: 'index',
    label: 'Index',
    hint: 'Organização técnica e objetiva',
  },
  {
    value: 'trading',
    label: 'Trading',
    hint: 'Card colecionável',
  },
  {
    value: 'fai_max',
    label: 'FAI Max',
    hint: 'Destaque visual máximo',
  },
  {
    value: 'stub',
    label: 'Stub',
    hint: 'Estilo ingresso editorial',
  },
  {
    value: 'specimen',
    label: 'Specimen',
    hint: 'Ficha visual de coleção',
  },
];

function LegacySkinSelections({
  language = 'pt-BR',
  data,
  selectedSkin,
  onSelectSkin,
}: LegacyPremiumSelectionsProps) {
  const isPortuguese = language !== 'en';
  const currentSkin = selectedSkin ?? data.cardSkin ?? 'atelier';

  return (
    <section className="rounded-xl border border-white/20 bg-white/10 p-4">
      <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-orange-300">
        Card Skin
      </p>

      <p className="mt-1 text-sm font-semibold text-white">
        {isPortuguese
          ? 'Modelo visual do card'
          : 'Card visual template'}
      </p>

      <p className="mt-0.5 text-[11px] text-white/60">
        {isPortuguese
          ? 'Escolha a estrutura visual usada na pré-visualização do esquema.'
          : 'Choose the visual structure used in the outfit preview.'}
      </p>

      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        {CARD_SKINS.map((skin) => {
          const isSelected = currentSkin === skin.value;

          return (
            <button
              key={skin.value}
              type="button"
              onClick={() => onSelectSkin(skin.value)}
              className={`rounded-xl border p-3 text-left transition ${
                isSelected
                  ? 'border-orange-300/70 bg-orange-400/16'
                  : 'border-white/15 bg-white/5 hover:border-white/35 hover:bg-white/10'
              }`}
            >
              <p className="text-[11px] font-black uppercase tracking-[0.12em] text-white/90">
                {skin.label}
              </p>

              <p className="mt-0.5 text-[10px] text-white/55">
                {skin.hint}
              </p>

              {isSelected ? (
                <p className="mt-2 text-[9px] font-bold uppercase tracking-[0.12em] text-orange-300">
                  Selecionado
                </p>
              ) : null}
            </button>
          );
        })}
      </div>
    </section>
  );
}

function ModernDisplaySelections({
  language = 'pt-BR',
  value,
  onChange,
}: ModernPremiumSelectionsProps) {
  const isPortuguese = language !== 'en';
  const displayMode = value.displayMode ?? 'complete';

  const update = (
    next: Partial<OutfitCardDisplayOptions>,
  ) => {
    onChange({
      ...value,
      ...next,
    });
  };

  return (
    <section className="rounded-xl border border-white/20 bg-white/10 p-4">
      <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-orange-300">
        Card Style
      </p>

      <p className="mt-1 text-sm font-semibold text-white">
        {isPortuguese
          ? 'Composição e legibilidade do card'
          : 'Card composition and readability'}
      </p>

      <p className="mt-0.5 text-[11px] text-white/60">
        {isPortuguese
          ? 'Ajuste a área interna e remova seções sem trocar o fundo artístico.'
          : 'Adjust the internal support area and remove sections without changing the artwork.'}
      </p>

      <div className="mt-4 grid gap-3">
        <FancySelect
          value={
            value.contentPanelColor ??
            SUPPORT_COLORS[0].value
          }
          onChange={(selected) =>
            update({
              contentPanelColor: selected,
            })
          }
          label={
            isPortuguese
              ? 'Cor da div de suporte interna'
              : 'Internal support color'
          }
          options={SUPPORT_COLORS}
        />

        <FancySelect
          value={displayMode}
          onChange={(selected) =>
            update({
              displayMode:
                selected as OutfitCardDisplayMode,
            })
          }
          label={
            isPortuguese
              ? 'Componentes visíveis'
              : 'Visible components'
          }
          options={DISPLAY_MODES}
        />
      </div>
    </section>
  );
}

export default function PremiumSelections(
  props: PremiumSelectionsProps,
) {
  if ('data' in props && props.data !== undefined) {
    return <LegacySkinSelections {...(props as LegacyPremiumSelectionsProps)} />;
  }

  return <ModernDisplaySelections {...(props as ModernPremiumSelectionsProps)} />;
}
