'use client';

import EditWardrobeItemView from '@/app/views/EditWardrobeItemView';

interface EditPieceModalProps {
  open: boolean;
  itemId: string | null;
  onClose: () => void;
  onSaved?: () => void;
  onDeleted?: () => void;
}

export default function EditPieceModal({ open, itemId, onClose, onSaved, onDeleted }: EditPieceModalProps) {
  if (!open || !itemId) return null;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="sa-premium-gradient-surface w-full max-w-3xl rounded-3xl border border-white/20 p-5 shadow-[0_20px_80px_rgba(0,0,0,0.55)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">Editar Peça</h2>
            <p className="text-sm text-white/70">Altere as informações desta peça do seu guarda-roupa.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-white/25 px-3 py-1 text-sm text-white hover:border-fuchsia-300/60"
          >
            Fechar
          </button>
        </div>

        <div className="max-h-[80vh] overflow-y-auto pr-1">
          <EditWardrobeItemView
            itemId={itemId}
            mode="modal"
            onSaved={() => {
              onSaved?.();
              onClose();
            }}
            onDeleted={() => {
              onDeleted?.();
              onClose();
            }}
          />
        </div>
      </div>
    </div>
  );
}
