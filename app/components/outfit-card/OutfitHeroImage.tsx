interface OutfitHeroImageProps {
  src: string;
  alt: string;
  className?: string;
}

export default function OutfitHeroImage({ src, alt, className }: OutfitHeroImageProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/60 bg-slate-200/60 shadow-sm">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} className={`h-[320px] w-full object-cover object-center sm:h-[420px] ${className ?? ''}`} />
    </div>
  );
}
