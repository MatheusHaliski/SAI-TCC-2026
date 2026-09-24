'use client';

import { useState } from 'react';
import { OutfitPiece, OutfitPieceListFormat, OutfitPieceStyle } from '@/app/lib/outfit-card';

interface PieceStyleEditorPanelProps {
  pieces: OutfitPiece[];
  /** Current piece list layout — drives row/column "apply to" logic. */
  format?: OutfitPieceListFormat;
  onChangePieces: (pieces: OutfitPiece[]) => void;
}

type StyleField = keyof Pick<OutfitPieceStyle, 'cellBackground' | 'textColor' | 'borderColor' | 'accentColor'>;
type ApplyScope = 'piece' | 'row' | 'column' | 'all';

const COLOR_SWATCHES = ['#0a0a0a', '#ffffff', '#c0c0c0', '#2e1065', '#7c3aed', '#047857', '#1d4ed8', '#db2777', '#f59e0b', '#ddc7a1'];

const CELL_IMAGE_OPTIONS: Array<{ fileName: string; label: string; url: string }> = [
  { fileName: 'a3.png', label: 'Pastel Kaleidoscope' },
  { fileName: 'a6.png', label: 'Solar Mandala' },
  { fileName: 'a18.png', label: 'Neon Labyrinth' },
  { fileName: 'c4.png', label: 'Colagem Urbana' },
  { fileName: 'streetvibes.jpg', label: 'Neon Graffiti' },
  { fileName: 'flw.jpg', label: 'Paper Florals' },
].map((opt) => ({ ...opt, url: `/${encodeURIComponent(opt.fileName)}` }));

const columnsForFormat = (format?: OutfitPieceListFormat): number => {
  if (format === 'grid-3') return 3;
  if (format === 'grid-2') return 2;
  return 1; // stack/row/magazine/plate -> "row"/"column" collapse to "all"
};

export default function PieceStyleEditorPanel({ pieces, format, onChangePieces }: PieceStyleEditorPanelProps) {
  const [selectedId, setSelectedId] = useState<string | null>(pieces[0]?.id ?? null);
  const [scope, setScope] = useState<ApplyScope>('piece');

  if (pieces.length === 0) {
    return (
      <section className="rounded-xl border border-white/20 bg-white/10 p-3">
        <p className="text-xs uppercase tracking-[0.12em] text-white/65">Editor de peças</p>
        <p className="mt-1 text-[11px] text-white/55">Adicione peças ao look para personalizar cada célula individualmente.</p>
      </section>
    );
  }

  const columns = columnsForFormat(format);
  const selectedIndex = pieces.findIndex((piece) => piece.id === selectedId);
  const activeIndex = selectedIndex >= 0 ? selectedIndex : 0;
  const selectedPiece = pieces[activeIndex];

  const targetIndexes = (): number[] => {
    if (scope === 'all') return pieces.map((_, idx) => idx);
    if (columns <= 1 || scope === 'piece') {
      return scope === 'piece' ? [activeIndex] : pieces.map((_, idx) => idx);
    }
    if (scope === 'row') {
      const row = Math.floor(activeIndex / columns);
      return pieces.map((_, idx) => idx).filter((idx) => Math.floor(idx / columns) === row);
    }
    // column
    const col = activeIndex % columns;
    return pieces.map((_, idx) => idx).filter((idx) => idx % columns === col);
  };

  const applyPatch = (patch: Partial<OutfitPieceStyle>) => {
    const targets = new Set(targetIndexes());
    const next = pieces.map((piece, idx) =>
      targets.has(idx) ? { ...piece, style: { ...piece.style, ...patch } } : piece,
    );
    onChangePieces(next);
  };

  const setField = (field: StyleField, value: string) => applyPatch({ [field]: value } as Partial<OutfitPieceStyle>);

  const clearSelectedStyle = () => {
    const targets = new Set(targetIndexes());
    const next = pieces.map((piece, idx) => {
      if (!targets.has(idx)) return piece;
      const clone = { ...piece };
      delete clone.style;
      return clone;
    });
    onChangePieces(next);
  };

  const style = selectedPiece?.style ?? {};
  const scopeOptions: Array<{ value: ApplyScope; label: string; disabled?: boolean }> = [
    { value: 'piece', label: 'Só esta peça' },
    { value: 'row', label: 'Linha', disabled: columns <= 1 },
    { value: 'column', label: 'Coluna', disabled: columns <= 1 },
    { value: 'all', label: 'Todas' },
  ];

  return (
    <section className="rounded-xl border border-white/20 bg-white/10 p-3">
      <p className="text-xs uppercase tracking-[0.12em] text-white/65">Editor de peças</p>
      <p className="mt-1 text-[11px] text-white/55">
        Personalize cada célula da lista: cor de fundo, texto, borda, imagem e realce. Use o alcance para aplicar a linha, coluna ou todas as peças.
      </p>

      {/* Piece picker */}
      <div className="mt-3 flex flex-wrap gap-2">
        {pieces.map((piece) => {
          const isSelected = piece.id === selectedPiece?.id;
          return (
            <button
              key={piece.id}
              type="button"
              onClick={() => setSelectedId(piece.id)}
              className={`rounded-lg border px-2.5 py-1.5 text-[11px] font-semibold transition ${isSelected ? 'border-fuchsia-400/60 bg-fuchsia-900/25 text-white' : 'border-white/15 bg-white/5 text-white/75 hover:border-white/30'}`}
            >
              {piece.style ? '● ' : ''}{piece.name || piece.pieceType || 'Peça'}
            </button>
          );
        })}
      </div>

      {/* Apply scope */}
      <div className="mt-3">
        <p className="text-[10px] uppercase tracking-[0.12em] text-white/50">Aplicar a</p>
        <div className="mt-1 flex flex-wrap gap-1.5">
          {scopeOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              disabled={option.disabled}
              onClick={() => setScope(option.value)}
              className={`rounded-md border px-2 py-1 text-[10px] font-semibold transition disabled:cursor-not-allowed disabled:opacity-40 ${scope === option.value ? 'border-fuchsia-400/60 bg-fuchsia-900/25 text-white' : 'border-white/15 bg-white/5 text-white/70 hover:border-white/30'}`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Color fields */}
      {([
        { field: 'cellBackground', label: 'Fundo da célula' },
        { field: 'textColor', label: 'Cor do texto' },
        { field: 'borderColor', label: 'Cor da borda' },
        { field: 'accentColor', label: 'Realce / acento' },
      ] as Array<{ field: StyleField; label: string }>).map(({ field, label }) => (
        <div key={field} className="mt-3">
          <div className="flex items-center justify-between">
            <p className="text-[10px] uppercase tracking-[0.12em] text-white/50">{label}</p>
            <input
              type="color"
              value={typeof style[field] === 'string' && /^#[0-9a-fA-F]{6}$/.test(style[field] as string) ? (style[field] as string) : '#7c3aed'}
              onChange={(e) => setField(field, e.target.value)}
              className="h-5 w-8 cursor-pointer rounded border border-white/20 bg-transparent"
              aria-label={`${label} custom`}
            />
          </div>
          <div className="mt-1 flex flex-wrap gap-1.5">
            {COLOR_SWATCHES.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => setField(field, color)}
                title={color}
                className={`h-6 w-6 rounded-md border transition ${style[field] === color ? 'border-white ring-2 ring-fuchsia-400/60' : 'border-white/25 hover:scale-110'}`}
                style={{ background: color }}
              />
            ))}
          </div>
        </div>
      ))}

      {/* Cell background image */}
      <div className="mt-3">
        <p className="text-[10px] uppercase tracking-[0.12em] text-white/50">Imagem de fundo da célula</p>
        <div className="mt-1 grid grid-cols-3 gap-1.5">
          <button
            type="button"
            onClick={() => applyPatch({ cellBackgroundImage: undefined })}
            className="flex h-12 items-center justify-center rounded-md border border-white/20 bg-white/5 text-[10px] text-white/60 hover:border-white/40"
          >
            Nenhuma
          </button>
          {CELL_IMAGE_OPTIONS.map((option) => (
            <button
              key={option.fileName}
              type="button"
              onClick={() => applyPatch({ cellBackgroundImage: option.url })}
              title={option.label}
              className={`h-12 overflow-hidden rounded-md border transition ${style.cellBackgroundImage === option.url ? 'border-fuchsia-400/70 ring-2 ring-fuchsia-400/50' : 'border-white/20 hover:border-white/40'}`}
              style={{ backgroundImage: `url(${option.url})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
            />
          ))}
        </div>
      </div>

      {/* Highlight + clear */}
      <div className="mt-3 flex items-center justify-between gap-2">
        <label className="flex cursor-pointer items-center gap-2 text-[11px] text-white/80">
          <input
            type="checkbox"
            checked={Boolean(style.highlight)}
            onChange={(e) => applyPatch({ highlight: e.target.checked })}
          />
          Destacar como peça-herói
        </label>
        <button
          type="button"
          onClick={clearSelectedStyle}
          className="rounded-md border border-white/20 bg-white/5 px-2.5 py-1 text-[10px] font-semibold text-white/70 transition hover:border-rose-300/50 hover:text-rose-200"
        >
          Limpar estilo
        </button>
      </div>
    </section>
  );
}
