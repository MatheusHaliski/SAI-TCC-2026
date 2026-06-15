'use client';

import { useState } from 'react';

interface OutfitHeroImageProps {
  src: string;
  alt: string;
  className?: string;
}

export default function OutfitHeroImage({ src, alt, className }: OutfitHeroImageProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Imagem pequena clicável */}
      <div
        className={`relative overflow-hidden rounded-2xl border border-white/60 bg-slate-200/60 shadow-sm cursor-pointer hover:opacity-90 transition-opacity ${className ?? ''}`}
        onClick={() => setOpen(true)}
      >
        <img
          src={src}
          alt={alt}
          className="h-full w-full min-h-[128px] object-cover object-center"
        />
        {/* Ícone de expandir */}
        <div className="absolute bottom-2 right-2 rounded-full bg-black/40 p-1 backdrop-blur-sm">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
            <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
          </svg>
        </div>
      </div>

      {/* Modal com imagem completa */}
      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={() => setOpen(false)}
        >
          <div className="relative max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setOpen(false)}
              className="absolute -top-10 right-0 text-white/80 hover:text-white text-sm font-medium"
            >
              Fechar ✕
            </button>
            <img
              src={src}
              alt={alt}
              className="w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl"
            />
          </div>
        </div>
      )}
    </>
  );
}
