'use client';

import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import AddWardrobeItemView from '@/app/views/AddWardrobeItemView';

interface AddPieceModalProps {
  open: boolean;
  onClose: () => void;
}

export default function AddPieceModal({ open, onClose }: AddPieceModalProps) {
  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; };
  }, []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open || typeof document === 'undefined') return null;

  return createPortal(
    <div
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        zIndex: 9000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(2,6,23,0.85)',
        backdropFilter: 'blur(6px)',
        padding: '1rem',
      }}
      onClick={onClose}
    >
      <div
        className="sa-premium-gradient-surface"
        style={{
          width: '100%',
          maxWidth: '64rem',
          maxHeight: '90vh',
          borderRadius: '1.5rem',
          border: '1px solid rgba(255,255,255,0.15)',
          boxShadow: '0 20px 80px rgba(0,0,0,0.55)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '1.25rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)',
          flexShrink: 0,
        }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#fff', margin: 0 }}>Add Piece</h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)', margin: '0.25rem 0 0' }}>
              Quick creator action to publish a new wardrobe piece.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              borderRadius: '0.5rem', border: '1px solid rgba(255,255,255,0.25)',
              padding: '0.375rem 0.875rem', fontSize: '0.875rem', color: '#fff',
              background: 'transparent', cursor: 'pointer',
            }}
          >
            Fechar
          </button>
        </div>

        {/* Conteúdo com scroll */}
        <div style={{ overflowY: 'auto', flex: 1, padding: '1.25rem 1.5rem' }}>
          <AddWardrobeItemView mode="modal" onPieceCreated={onClose} />
        </div>
      </div>
    </div>,
    document.body
  );
}