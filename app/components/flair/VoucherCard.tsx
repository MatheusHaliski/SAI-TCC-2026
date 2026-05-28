'use client';

import Image from 'next/image';
import type { StoreVoucher } from '@/app/lib/flair';

interface Props {
  voucher: StoreVoucher;
  onRedeem?: (voucherId: string) => void;
}

export function VoucherCard({ voucher, onRedeem }: Props) {
  const daysLeft = Math.max(
    0,
    Math.ceil((new Date(voucher.expiresAt).getTime() - Date.now()) / 86400000)
  );
  const expired = daysLeft === 0;

  return (
    <div
      className={`
        rounded-2xl border overflow-hidden
        ${expired ? 'opacity-50 grayscale' : ''}
        ${voucher.redeemed ? 'border-white/10' : 'border-white/20'}
      `}
      style={{
        background: voucher.redeemed
          ? 'rgba(15,15,20,0.8)'
          : 'linear-gradient(135deg, rgba(20,20,30,0.98) 0%, rgba(30,20,40,0.98) 100%)',
      }}
    >
      {/* Dashed divider effect */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-dashed border-white/10">
        {/* Brand logo */}
        <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center overflow-hidden shrink-0">
          {voucher.brandLogoUrl ? (
            <Image src={voucher.brandLogoUrl} alt={voucher.brandName} width={36} height={36} className="object-contain" />
          ) : (
            <span className="text-xl">🏷️</span>
          )}
        </div>

        <div className="flex-1">
          <p className="font-black text-white text-sm">{voucher.brandName}</p>
          <p className="text-[9px] text-white/40 uppercase tracking-widest">voucher exclusivo FLAIR</p>
        </div>

        {/* Discount badge */}
        <div className="shrink-0 text-right">
          {voucher.discountBRL > 0 && (
            <p className="font-black text-2xl text-emerald-400">R${voucher.discountBRL}</p>
          )}
          {voucher.discountPct && (
            <p className="font-black text-2xl text-emerald-400">{voucher.discountPct}%</p>
          )}
          <p className="text-[8px] text-white/30">de desconto</p>
        </div>
      </div>

      {/* Barcode / QR area */}
      <div className="px-4 py-3 flex items-center justify-between">
        <div>
          <p className="font-mono text-[11px] text-white/60 tracking-[0.15em]">
            {voucher.code}
          </p>
          {voucher.minPurchaseBRL && (
            <p className="text-[9px] text-white/30 mt-0.5">
              Compra mín. R${voucher.minPurchaseBRL}
            </p>
          )}
          <p className={`text-[9px] mt-1 font-bold ${daysLeft <= 7 ? 'text-red-400' : 'text-white/40'}`}>
            {expired ? 'Expirado' : `Expira em ${daysLeft}d`}
          </p>
        </div>

        {!voucher.redeemed && !expired && onRedeem && (
          <button
            onClick={() => onRedeem(voucher.voucherId)}
            className="rounded-xl px-3 py-1.5 text-[11px] font-black bg-emerald-500 text-black
              hover:bg-emerald-400 active:scale-95 transition-all"
          >
            USAR
          </button>
        )}
        {voucher.redeemed && (
          <div className="rounded-xl px-3 py-1.5 text-[11px] font-black border border-white/20 text-white/30">
            USADO ✓
          </div>
        )}
      </div>
    </div>
  );
}
