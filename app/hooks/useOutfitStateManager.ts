'use client';

import { useMemo, useState } from 'react';
import {
  createEmptySelection,
  DRESS_TESTER_CATEGORIES,
  DressTesterCategory,
  Mannequin2D,
  OutfitSelection,
  ResolvedLayer,
  WardrobePiece2D,
} from '@/app/lib/dress-tester-models';

interface UseOutfitStateManagerArgs {
  mannequin: Mannequin2D | null;
  pieces: WardrobePiece2D[];
}

const hasConflict = (piece: WardrobePiece2D, selectedIds: Set<string>) =>
  piece.conflicts_with.some((conflictingId) => selectedIds.has(conflictingId));

export function useOutfitStateManager({ mannequin, pieces }: UseOutfitStateManagerArgs) {
  const [selection, setSelection] = useState<OutfitSelection>(() =>
    createEmptySelection(mannequin?.mannequin_id ?? '', mannequin?.pose_code ?? ''),
  );

  const [activeCategory, setActiveCategory] = useState<DressTesterCategory>('top');

  const piecesById = useMemo(() => new Map(pieces.map((piece) => [piece.piece_id, piece])), [pieces]);

  const resetLook = () => {
    setSelection(createEmptySelection(mannequin?.mannequin_id ?? '', mannequin?.pose_code ?? ''));
  };

  const removeFromCategory = (category: DressTesterCategory) => {
    setSelection((prev) => ({ ...prev, [category]: null }));
  };

  const wearPiece = (piece: WardrobePiece2D) => {
    setSelection((prev) => {
      const next: OutfitSelection = {
        ...prev,
        mannequin_id: mannequin?.mannequin_id ?? prev.mannequin_id,
        pose_code: mannequin?.pose_code ?? prev.pose_code,
        [piece.piece_type]: piece.piece_id,
      };

      if (piece.piece_type === 'dress') {
        next.top = null;
        next.bottom = null;
      }

      if (piece.piece_type === 'top' || piece.piece_type === 'bottom') {
        next.dress = null;
      }

      for (const hiddenCategory of piece.hides_piece_types) {
        next[hiddenCategory] = null;
      }

      const selectedIds = new Set(
        DRESS_TESTER_CATEGORIES.map((category) => next[category]).filter(Boolean) as string[],
      );

      for (const category of DRESS_TESTER_CATEGORIES) {
        const chosenId = next[category];
        if (!chosenId) continue;

        const chosenPiece = piecesById.get(chosenId);
        if (!chosenPiece) {
          next[category] = null;
          continue;
        }

        if (hasConflict(chosenPiece, new Set([...selectedIds].filter((id) => id !== chosenId)))) {
          next[category] = null;
          selectedIds.delete(chosenId);
        }
      }

      return next;
    });
  };

  const selectedPieces = useMemo(
    () =>
      DRESS_TESTER_CATEGORIES.flatMap((category) => {
        const pieceId = selection[category];
        if (!pieceId) return [];
        const piece = piecesById.get(pieceId);
        return piece ? [piece] : [];
      }),
    [selection, piecesById],
  );

  const resolvedLayers = useMemo<ResolvedLayer[]>(() => {
    const selectedIds = new Set(selectedPieces.map((piece) => piece.piece_id));

    return selectedPieces
      .filter((piece) => !hasConflict(piece, new Set([...selectedIds].filter((id) => id !== piece.piece_id))))
      .sort((a, b) => a.render_layer - b.render_layer)
      .map((piece) => ({
        piece_id: piece.piece_id,
        piece_type: piece.piece_type,
        image_url: piece.image_url,
        render_layer: piece.render_layer,
        anchor: piece.anchor,
        name: piece.name,
      }));
  }, [selectedPieces]);

  const availablePieces = useMemo(
    () =>
      pieces.filter(
        (piece) =>
          piece.piece_type === activeCategory &&
          piece.active &&
          (piece.asset_status === 'ready_for_tester' || piece.asset_status === 'published'),
      ),
    [activeCategory, pieces],
  );

  return {
    activeCategory,
    availablePieces,
    removeFromCategory,
    resetLook,
    resolvedLayers,
    selection,
    selectedPieces,
    setActiveCategory,
    wearPiece,
  };
}
