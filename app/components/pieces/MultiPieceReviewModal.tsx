'use client';

import { useState } from 'react';

interface DetectedPiece {
  name: string;
  piece_type: string;
  color: string;
  material: string;
  occasion_tags: string[];
  style_tags: string[];
  brand: string;
  description: string;
  selected: boolean;
}

interface MultiPieceReviewModalProps {
  pieces: DetectedPiece[];
  imagePreview: string;
  onConfirm: (pieces: DetectedPiece[]) => Promise<void>;
  onClose: () => void;
}

const PIECE_TYPE_LABELS: Record<string, string> = {
  upper_piece: '👕 Parte de cima',
  lower_piece: '👖 Parte de baixo',
  footwear: '👟 Calçado',
  accessory_piece: '🧢 Acessório',
};

const OCCASION_OPTIONS = ['Trabalho', 'Casual', 'Festa', 'Academia', 'Evento'];
const STYLE_OPTIONS = ['Casual', 'Formal', 'Streetwear', 'Sport', 'Luxury', 'Classic', 'Vintage', 'Minimal'];
const PIECE_TYPE_OPTIONS = ['upper_piece', 'lower_piece', 'footwear', 'accessory_piece'];

export default function MultiPieceReviewModal({ pieces: initialPieces, imagePreview, onConfirm, onClose }: MultiPieceReviewModalProps) {
  const [pieces, setPieces] = useState<DetectedPiece[]>(
    initialPieces.map((p) => ({ ...p, selected: true }))
  );
  const [saving, setSaving] = useState(false);

  const updatePiece = (index: number, field: keyof DetectedPiece, value: unknown) => {
    setPieces((prev) => prev.map((p, i) => i === index ? { ...p, [field]: value } : p));
  };

  const toggleTag = (index: number, field: 'occasion_tags' | 'style_tags', tag: string) => {
    setPieces((prev) => prev.map((p, i) => {
      if (i !== index) return p;
      const tags = p[field] as string[];
      const exists = tags.includes(tag);
      return { ...p, [field]: exists ? tags.filter((t) => t !== tag) : [...tags, tag] };
    }));
  };

  const selectedCount = pieces.filter((p) => p.selected).length;

  const handleConfirm = async () => {
    setSaving(true);
    try {
      await onConfirm(pieces.filter((p) => p.selected));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="sa-premium-gradient-surface w-full max-w-3xl rounded-3xl border border-white/20 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        style={{ maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/15 p-5">
          <div>
            <h2 className="text-lg font-bold text-white">
              ✨ {pieces.length} peça{pieces.length !== 1 ? 's' : ''} detectada{pieces.length !== 1 ? 's' : ''}
            </h2>
            <p className="text-sm text-white/60">Revise e edite cada peça antes de salvar</p>
          </div>
          <button onClick={onClose} className="rounded-lg border border-white/25 px-3 py-1 text-sm text-white">
            Fechar
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-5 space-y-4 flex-1">
          {/* Imagem original */}
          <div className="rounded-xl overflow-hidden border border-white/15" style={{ maxHeight: '160px' }}>
            <img src={imagePreview} alt="Foto analisada" className="w-full h-40 object-cover" />
          </div>

          {/* Lista de peças */}
          {pieces.map((piece, index) => (
            <div
              key={index}
              className="rounded-2xl border p-4 space-y-3 transition"
              style={{
                borderColor: piece.selected ? 'rgba(124,58,237,0.5)' : 'rgba(255,255,255,0.1)',
                background: piece.selected ? 'rgba(124,58,237,0.08)' : 'rgba(255,255,255,0.04)',
              }}
            >
              {/* Toggle seleção + nome */}
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={piece.selected}
                  onChange={(e) => updatePiece(index, 'selected', e.target.checked)}
                  className="mt-1 h-4 w-4 accent-violet-500 cursor-pointer"
                />
                <div className="flex-1 space-y-2">
                  <input
                    type="text"
                    value={piece.name}
                    onChange={(e) => updatePiece(index, 'name', e.target.value)}
                    className="w-full rounded-lg border border-white/20 bg-white/10 px-3 py-1.5 text-sm font-semibold text-white placeholder:text-white/40 focus:outline-none focus:border-violet-400/60"
                  />
                  <p className="text-xs text-white/50 italic">{piece.description}</p>
                </div>
              </div>

              {piece.selected && (
                <>
                  {/* Tipo + Cor + Material */}
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-[10px] font-semibold text-white/50 mb-1">Tipo</label>
                      <select
                        value={piece.piece_type}
                        onChange={(e) => updatePiece(index, 'piece_type', e.target.value)}
                        className="w-full rounded-lg border border-white/20 bg-white/10 px-2 py-1.5 text-xs text-white focus:outline-none"
                        style={{ background: 'rgba(255,255,255,0.08)' }}
                      >
                        {PIECE_TYPE_OPTIONS.map((t) => (
                          <option key={t} value={t} style={{ background: '#1e1a2e' }}>
                            {PIECE_TYPE_LABELS[t]}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-white/50 mb-1">Cor</label>
                      <input
                        type="text"
                        value={piece.color}
                        onChange={(e) => updatePiece(index, 'color', e.target.value)}
                        className="w-full rounded-lg border border-white/20 bg-white/10 px-2 py-1.5 text-xs text-white focus:outline-none"
                        placeholder="ex: Preto"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-white/50 mb-1">Material</label>
                      <input
                        type="text"
                        value={piece.material}
                        onChange={(e) => updatePiece(index, 'material', e.target.value)}
                        className="w-full rounded-lg border border-white/20 bg-white/10 px-2 py-1.5 text-xs text-white focus:outline-none"
                        placeholder="ex: Algodão"
                      />
                    </div>
                  </div>

                  {/* Tags de ocasião */}
                  <div>
                    <label className="block text-[10px] font-semibold text-white/50 mb-1">Ocasião</label>
                    <div className="flex flex-wrap gap-1.5">
                      {OCCASION_OPTIONS.map((tag) => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => toggleTag(index, 'occasion_tags', tag)}
                          className="rounded-full border px-2.5 py-0.5 text-[11px] font-medium transition"
                          style={{
                            borderColor: piece.occasion_tags.includes(tag) ? '#7c3aed' : 'rgba(255,255,255,0.2)',
                            background: piece.occasion_tags.includes(tag) ? 'rgba(124,58,237,0.25)' : 'transparent',
                            color: piece.occasion_tags.includes(tag) ? '#c4b5fd' : 'rgba(255,255,255,0.6)',
                          }}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Tags de estilo */}
                  <div>
                    <label className="block text-[10px] font-semibold text-white/50 mb-1">Estilo</label>
                    <div className="flex flex-wrap gap-1.5">
                      {STYLE_OPTIONS.map((tag) => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => toggleTag(index, 'style_tags', tag)}
                          className="rounded-full border px-2.5 py-0.5 text-[11px] font-medium transition"
                          style={{
                            borderColor: piece.style_tags.includes(tag) ? '#db2777' : 'rgba(255,255,255,0.2)',
                            background: piece.style_tags.includes(tag) ? 'rgba(219,39,119,0.2)' : 'transparent',
                            color: piece.style_tags.includes(tag) ? '#f9a8d4' : 'rgba(255,255,255,0.6)',
                          }}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="border-t border-white/15 p-5">
          <button
            type="button"
            onClick={handleConfirm}
            disabled={saving || selectedCount === 0}
            className="w-full rounded-xl py-3 text-sm font-bold text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ background: 'linear-gradient(135deg,#7c3aed,#db2777)' }}
          >
            {saving
              ? `Salvando ${selectedCount} peça${selectedCount !== 1 ? 's' : ''}...`
              : `Salvar ${selectedCount} peça${selectedCount !== 1 ? 's' : ''} selecionada${selectedCount !== 1 ? 's' : ''}`}
          </button>
        </div>
      </div>
    </div>
  );
}