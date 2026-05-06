'use client';

import Image from 'next/image';

interface Props {
  mannequinImageUrl: string;
  displayImageUrl: string;
  loading: boolean;
  error: string | null;
  onRetry: () => void;
}

export default function Tester2DStage({ mannequinImageUrl, displayImageUrl, loading, error, onRetry }: Props) {
  return (
    <div className="rounded-3xl border border-white/20 bg-black/35 p-4">
      <div className="mx-auto w-full max-w-[860px] overflow-hidden rounded-2xl bg-gradient-to-b from-black/30 to-black/65 p-3">
        <div className="relative mx-auto aspect-[2/3] w-full overflow-hidden rounded-xl bg-white">
          <Image
            src={displayImageUrl || mannequinImageUrl}
            alt="Try-on stage"
            fill
            className="object-contain transition-opacity duration-400 ease-in"
            unoptimized
            priority
          />
          {loading ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/35 text-white">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              <p className="mt-3 text-sm">Fitting garment...</p>
            </div>
          ) : null}
          {error ? (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 p-4">
              <div className="rounded-xl border border-rose-300/40 bg-rose-950/70 p-4 text-center text-rose-100">
                <p className="text-sm">⚠️ {error}</p>
                <button type="button" className="mt-3 rounded-lg border border-rose-200/60 px-3 py-1 text-xs" onClick={onRetry}>Try again</button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
