'use client';

import { useState } from 'react';
import Image from 'next/image';
import { DRESS_TESTER_CATEGORIES, PieceAssetStatus } from '@/app/lib/dress-tester-models';
import QuadCalibrator from '@/app/components/QuadCalibrator';

const ASSET_STATUSES: PieceAssetStatus[] = ['draft', 'asset_pending', 'asset_review', 'ready_for_tester', 'published'];

export interface WardrobePickerItem {
  pieceId: string;
  name: string;
  imageUrl: string;
}

interface AdminAssetStudioProps {
  onCreated: () => Promise<void>;
  wardrobeItems?: WardrobePickerItem[];
}

export default function AdminAssetStudio({ onCreated, wardrobeItems = [] }: AdminAssetStudioProps) {
  const [message, setMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [showCalibrator, setShowCalibrator] = useState(false);
  const [calibratorUrl, setCalibratorUrl] = useState('');
  const [selectedPieceId, setSelectedPieceId] = useState<string | null>(null);

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

  const selectWardrobeItem = (item: WardrobePickerItem) => {
    setSelectedPieceId(item.pieceId);
    setPieceForm((prev) => ({
      ...prev,
      name: prev.name || item.name,
      image_url: item.imageUrl,
      thumbnail_url: item.imageUrl,
    }));
  };

  const submitMannequin = async (event: React.SyntheticEvent) => {
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

  const submitPiece = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    if (!pieceForm.image_url) {
      setMessage('Select a wardrobe item first.');
      return;
    }
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
    setMessage('Asset created. Generating try-on image in background — it will appear as "TRY-ON READY" when done.');
    setSelectedPieceId(null);
    setPieceForm((prev) => ({ ...prev, name: '', image_url: '', thumbnail_url: '' }));
    await onCreated();
  };

  const inputClass = 'w-full rounded-lg border border-white/20 bg-black/30 px-3 py-2 text-sm text-white placeholder:text-white/30';

  return (
    <div className="space-y-4 rounded-3xl border border-white/20 bg-black/25 p-4">
      <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-white">Admin Asset Studio</h3>
      {message ? <p className="text-xs text-white/70">{message}</p> : null}

      {/* ── Mannequin form ── */}
      <form className="space-y-2" onSubmit={submitMannequin}>
        <p className="text-xs uppercase tracking-[0.18em] text-white/60">Create 2D mannequin entry</p>
        <input className={inputClass} placeholder="Mannequin name" value={mannequinForm.name} onChange={(e) => setMannequinForm((prev) => ({ ...prev, name: e.target.value }))} />
        <input className={inputClass} placeholder="Base image URL" value={mannequinForm.base_image_url} onChange={(e) => setMannequinForm((prev) => ({ ...prev, base_image_url: e.target.value }))} />
        <button disabled={submitting} className="rounded-lg border border-white bg-white px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-black disabled:opacity-60">
          Save mannequin
        </button>
      </form>

      {/* ── Piece form ── */}
      <form className="space-y-3" onSubmit={submitPiece}>
        <p className="text-xs uppercase tracking-[0.18em] text-white/60">Register piece from wardrobe</p>

        {/* Wardrobe item picker */}
        {wardrobeItems.length > 0 ? (
          <div className="space-y-1">
            <p className="text-[11px] text-white/40">Select a wardrobe item to use as the piece image:</p>
            <div className="grid max-h-48 grid-cols-4 gap-1.5 overflow-y-auto pr-1">
              {wardrobeItems.map((item) => {
                const isSelected = selectedPieceId === item.pieceId;
                return (
                  <button
                    key={item.pieceId}
                    type="button"
                    onClick={() => selectWardrobeItem(item)}
                    className={`group relative flex flex-col items-center gap-1 rounded-xl border p-1.5 text-center transition-all ${
                      isSelected
                        ? 'border-violet-400 bg-violet-500/20 ring-1 ring-violet-400'
                        : 'border-white/15 bg-black/20 hover:border-white/40 hover:bg-white/10'
                    }`}
                    title={item.name}
                  >
                    <div className="relative h-14 w-full overflow-hidden rounded-lg bg-black/30">
                      <Image src={item.imageUrl} alt={item.name} fill className="object-contain" unoptimized />
                    </div>
                    <span className="w-full truncate text-[9px] uppercase tracking-[0.12em] text-white/70 group-hover:text-white">
                      {item.name}
                    </span>
                    {isSelected ? (
                      <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-violet-500 text-[9px] text-white">✓</span>
                    ) : null}
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <p className="text-[11px] text-white/30">No wardrobe items available. Upload clothes via Add Piece first.</p>
        )}

        {/* Selected item preview */}
        {selectedPieceId && pieceForm.image_url ? (
          <div className="flex items-center gap-2 rounded-xl border border-violet-400/40 bg-violet-500/10 px-3 py-2">
            <div className="relative h-10 w-8 shrink-0 overflow-hidden rounded-md bg-black/30">
              <Image src={pieceForm.image_url} alt="Selected" fill className="object-contain" unoptimized />
            </div>
            <div className="min-w-0">
              <p className="truncate text-xs font-semibold text-white">{pieceForm.name || '—'}</p>
              <p className="truncate text-[10px] text-violet-300/80">Image selected from wardrobe</p>
            </div>
            <button
              type="button"
              onClick={() => { setSelectedPieceId(null); setPieceForm((prev) => ({ ...prev, image_url: '', thumbnail_url: '' })); }}
              className="ml-auto shrink-0 text-[11px] text-white/40 hover:text-white/80"
            >
              ✕
            </button>
          </div>
        ) : null}

        <input className={inputClass} placeholder="Piece name (auto-filled from wardrobe)" value={pieceForm.name} onChange={(e) => setPieceForm((prev) => ({ ...prev, name: e.target.value }))} />

        <select className={inputClass} value={pieceForm.piece_type} onChange={(e) => setPieceForm((prev) => ({ ...prev, piece_type: e.target.value }))}>
          {DRESS_TESTER_CATEGORIES.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
        </select>

        <input className={inputClass} type="number" placeholder="Render layer" value={pieceForm.render_layer} onChange={(e) => setPieceForm((prev) => ({ ...prev, render_layer: Number(e.target.value) }))} />

        <input className={inputClass} placeholder="hides_piece_types (comma-separated)" value={pieceForm.hides_piece_types} onChange={(e) => setPieceForm((prev) => ({ ...prev, hides_piece_types: e.target.value }))} />
        <input className={inputClass} placeholder="conflicts_with piece ids" value={pieceForm.conflicts_with} onChange={(e) => setPieceForm((prev) => ({ ...prev, conflicts_with: e.target.value }))} />
        <input className={inputClass} placeholder="compatible_piece_types" value={pieceForm.compatible_piece_types} onChange={(e) => setPieceForm((prev) => ({ ...prev, compatible_piece_types: e.target.value }))} />

        <select className={inputClass} value={pieceForm.asset_status} onChange={(e) => setPieceForm((prev) => ({ ...prev, asset_status: e.target.value }))}>
          {ASSET_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>

        <button
          disabled={submitting || !pieceForm.image_url}
          className="rounded-lg border border-white bg-white px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-black disabled:cursor-not-allowed disabled:opacity-40"
        >
          {submitting ? 'Saving...' : 'Save asset'}
        </button>
      </form>

      {/* ── Quad Calibrator ── */}
      <div className="border-t border-white/10 pt-3">
        <button
          type="button"
          onClick={() => setShowCalibrator((prev) => !prev)}
          className="text-xs uppercase tracking-[0.16em] text-amber-300/70 hover:text-amber-300"
        >
          {showCalibrator ? '▲ Hide' : '▼ Show'} Quad Calibrator
        </button>

        {showCalibrator ? (
          <div className="mt-3 space-y-3">
            <input
              className={inputClass}
              placeholder="Mannequin base image URL to calibrate"
              value={calibratorUrl}
              onChange={(e) => setCalibratorUrl(e.target.value)}
            />
            {calibratorUrl ? (
              <QuadCalibrator
                mannequinImageUrl={calibratorUrl}
                canvasWidth={mannequinForm.canvas_width}
                canvasHeight={mannequinForm.canvas_height}
              />
            ) : (
              <p className="text-[11px] text-white/30">Enter a mannequin base image URL above to start calibrating.</p>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}
