interface PieceExpressionQuoteProps {
  expressao: string;
}

export default function PieceExpressionQuote({ expressao }: PieceExpressionQuoteProps) {
  const text = expressao.trim();
  if (!text) return null;

  return (
    <div className="mt-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
      <p className="mb-0.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-white/35">
        como me sinto
      </p>
      <p className="text-[11px] italic leading-snug text-white/65">
        &ldquo;{text}&rdquo;
      </p>
    </div>
  );
}
