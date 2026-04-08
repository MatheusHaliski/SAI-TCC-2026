'use client';

import type { AssetJobStatus } from '@/app/hooks/use3dAssetJob';

interface Props {
  open: boolean;
  status: AssetJobStatus;
  progressPercent: number;
  error?: string | null;
  onClose: () => void;
  onRetry: () => void;
}

const STATUS_COPY: Record<AssetJobStatus, { title: string; stage: string }> = {
  idle: { title: 'Preparing 3D Viewer', stage: 'Waiting to start' },
  submitting: { title: 'Preparing 3D Viewer', stage: 'Submitting generation request' },
  queued: { title: 'Generating 3D Asset', stage: 'Queue pending' },
  in_progress: { title: 'Generating 3D Asset', stage: 'Processing mesh pipeline' },
  completed: { title: 'Generating 3D Asset', stage: 'Ready' },
  failed: { title: 'Generating 3D Asset', stage: 'Failed' },
};

export default function ThreeDGenerationProgressModal({ open, status, progressPercent, error, onClose, onRetry }: Props) {
  if (!open) return null;

  const ui = STATUS_COPY[status];
  const isFailed = status === 'failed';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-md rounded-2xl border border-cyan-300/30 bg-slate-950/95 p-5 shadow-[0_0_40px_rgba(34,211,238,0.2)]">
        <div className="mb-3 text-xs uppercase tracking-[0.25em] text-cyan-200/90">StylistAI • Virtual Wardrobe</div>
        <h3 className="text-xl font-semibold text-white">{ui.title}</h3>
        <p className="mt-2 rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm text-cyan-100">
          Stage: <span className="font-medium">{ui.stage}</span>
        </p>

        {!isFailed ? (
          <div className="mt-4">
            <div className="mb-1 flex items-center justify-between text-xs text-cyan-100/90">
              <span>Progress</span>
              <span>{Math.max(0, Math.min(100, Math.round(progressPercent)))}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-300 to-violet-400 transition-all duration-500 ease-out"
                style={{ width: `${Math.max(3, Math.min(100, progressPercent))}%` }}
              />
            </div>
          </div>
        ) : null}

        {isFailed ? <p className="mt-4 text-sm text-rose-200">{error ?? '3D generation failed. Please retry.'}</p> : null}

        <div className="mt-5 flex items-center justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded-lg border border-white/25 px-3 py-1.5 text-sm text-white/90">Cancel</button>
          {isFailed ? (
            <button type="button" onClick={onRetry} className="rounded-lg border border-cyan-300/70 bg-cyan-500/20 px-3 py-1.5 text-sm text-cyan-100">Retry</button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
