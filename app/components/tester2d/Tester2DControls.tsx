'use client';

interface Props {
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
  showAnchors: boolean;
  onToggleAnchors: () => void;
}

export default function Tester2DControls({ zoom, onZoomIn, onZoomOut, onReset, showAnchors, onToggleAnchors }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <button onClick={onReset} className="rounded-xl border border-white/25 px-3 py-2 text-xs uppercase tracking-[0.18em] text-white">Reset outfit</button>
      <button onClick={onZoomOut} className="rounded-xl border border-white/25 px-3 py-2 text-xs uppercase tracking-[0.18em] text-white">Zoom -</button>
      <button onClick={onZoomIn} className="rounded-xl border border-white/25 px-3 py-2 text-xs uppercase tracking-[0.18em] text-white">Zoom +</button>
      <button onClick={onToggleAnchors} className="rounded-xl border border-white/25 px-3 py-2 text-xs uppercase tracking-[0.18em] text-white">{showAnchors ? 'Hide slots' : 'Show slots'}</button>
      <span className="ml-auto text-xs text-white/70">Zoom: {Math.round(zoom * 100)}%</span>
    </div>
  );
}
