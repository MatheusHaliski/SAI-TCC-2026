'use client';

import { FormEvent, useState } from 'react';
import { DRESS_TESTER_CATEGORIES, PieceAssetStatus } from '@/app/lib/dress-tester-models';

const ASSET_STATUSES: PieceAssetStatus[] = ['draft', 'asset_pending', 'asset_review', 'ready_for_tester', 'published'];

interface AdminAssetStudioProps {
  onCreated: () => Promise<void>;
}

export default function AdminAssetStudio({ onCreated }: AdminAssetStudioProps) {
  const [message, setMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [pieceForm, setPieceForm] = useState({
    name: '',
    piece_type: 'top',
    render_layer: 20,
    image_url: '',
    thumbnail_url: '',
    hides_piece_types: '',
    conflicts_with: '',
    compatible_piece_types: '',
    asset_status: 'draft',
  });

  const [mannequinForm, setMannequinForm] = useState({
    name: 'Editorial Muse',
    gender: 'female',
    body_type: 'balanced',
    pose_code: 'pose_a',
    canvas_width: 1200,
    canvas_height: 1800,
    preview_width: 560,
    preview_height: 840,
    base_image_url: '',
    shadow_image_url: '',
    hair_back_url: '',
    hair_front_url: '',
    face_layer_url: '',
  });

  const submitMannequin = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setMessage(null);
    const response = await fetch('/api/dress-tester/mannequins', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(mannequinForm),
    });
    setSubmitting(false);
    if (!response.ok) {
      setMessage('Unable to create mannequin entry.');
      return;
    }
    setMessage('Mannequin created.');
    await onCreated();
  };

  const submitPiece = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setMessage(null);
    const response = await fetch('/api/dress-tester/pieces', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...pieceForm,
        hides_piece_types: pieceForm.hides_piece_types.split(',').map((item) => item.trim()).filter(Boolean),
        conflicts_with: pieceForm.conflicts_with.split(',').map((item) => item.trim()).filter(Boolean),
        compatible_piece_types: pieceForm.compatible_piece_types.split(',').map((item) => item.trim()).filter(Boolean),
      }),
    });
    setSubmitting(false);
    if (!response.ok) {
      setMessage('Unable to create wardrobe asset.');
      return;
    }
    setMessage('Wardrobe asset created.');
    await onCreated();
  };

  const inputClass = 'w-full rounded-lg border border-white/20 bg-black/30 px-3 py-2 text-sm text-white';

  return (
    <div className="space-y-4 rounded-3xl border border-white/20 bg-black/25 p-4">
      <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-white">Admin Asset Studio</h3>
      {message ? <p className="text-xs text-white/70">{message}</p> : null}

      <form className="space-y-2" onSubmit={submitMannequin}>
        <p className="text-xs uppercase tracking-[0.18em] text-white/60">Create 2D mannequin entry</p>
        <input className={inputClass} placeholder="Mannequin name" value={mannequinForm.name} onChange={(event) => setMannequinForm((prev) => ({ ...prev, name: event.target.value }))} />
        <input className={inputClass} placeholder="Base image URL" value={mannequinForm.base_image_url} onChange={(event) => setMannequinForm((prev) => ({ ...prev, base_image_url: event.target.value }))} />
        <button disabled={submitting} className="rounded-lg border border-white bg-white px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-black">
          Save mannequin
        </button>
      </form>

      <form className="space-y-2" onSubmit={submitPiece}>
        <p className="text-xs uppercase tracking-[0.18em] text-white/60">Upload aligned PNG metadata</p>
        <input className={inputClass} placeholder="Piece name" value={pieceForm.name} onChange={(event) => setPieceForm((prev) => ({ ...prev, name: event.target.value }))} />
        <select className={inputClass} value={pieceForm.piece_type} onChange={(event) => setPieceForm((prev) => ({ ...prev, piece_type: event.target.value }))}>
          {DRESS_TESTER_CATEGORIES.map((category) => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
        <input className={inputClass} type="number" placeholder="Render layer" value={pieceForm.render_layer} onChange={(event) => setPieceForm((prev) => ({ ...prev, render_layer: Number(event.target.value) }))} />
        <input className={inputClass} placeholder="Full mannequin PNG URL" value={pieceForm.image_url} onChange={(event) => setPieceForm((prev) => ({ ...prev, image_url: event.target.value }))} />
        <input className={inputClass} placeholder="Thumbnail URL" value={pieceForm.thumbnail_url} onChange={(event) => setPieceForm((prev) => ({ ...prev, thumbnail_url: event.target.value }))} />
        <input className={inputClass} placeholder="hides_piece_types (comma-separated)" value={pieceForm.hides_piece_types} onChange={(event) => setPieceForm((prev) => ({ ...prev, hides_piece_types: event.target.value }))} />
        <input className={inputClass} placeholder="conflicts_with piece ids" value={pieceForm.conflicts_with} onChange={(event) => setPieceForm((prev) => ({ ...prev, conflicts_with: event.target.value }))} />
        <input className={inputClass} placeholder="compatible_piece_types" value={pieceForm.compatible_piece_types} onChange={(event) => setPieceForm((prev) => ({ ...prev, compatible_piece_types: event.target.value }))} />
        <select className={inputClass} value={pieceForm.asset_status} onChange={(event) => setPieceForm((prev) => ({ ...prev, asset_status: event.target.value }))}>
          {ASSET_STATUSES.map((status) => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
        <button disabled={submitting} className="rounded-lg border border-white bg-white px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-black">
          Save asset
        </button>
      </form>
    </div>
  );
}
