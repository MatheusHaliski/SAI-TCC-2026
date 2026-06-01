'use client';

import { useEffect, useMemo, useState } from 'react';
import PageHeader from '@/app/components/shell/PageHeader';
import SectionBlock from '@/app/components/shared/SectionBlock';
import PieceSearchInput from '@/app/components/pieces/PieceSearchInput';
import PieceFilterBar from '@/app/components/pieces/PieceFilterBar';
import PieceDiscoveryCard, { DiscoverablePiece } from '@/app/components/pieces/PieceDiscoveryCard';
import PieceDetailModal from '@/app/components/pieces/PieceDetailModal';

export default function SearchPiecesView() {
  const [pieces, setPieces] = useState<DiscoverablePiece[]>([]);
  const [query, setQuery] = useState('');
  const [pieceType, setPieceType] = useState('');
  const [brand, setBrand] = useState('');
  const [rarity, setRarity] = useState('');
  const [selectedPiece, setSelectedPiece] = useState<DiscoverablePiece | null>(null);

  useEffect(() => {
    const params = new URLSearchParams();
    if (query.trim()) params.set('query', query.trim());
    if (pieceType) params.set('piece_type', pieceType);
    if (brand.trim()) params.set('brand', brand.trim());
    if (rarity) params.set('rarity', rarity);

    fetch(`/api/wardrobe-items?${params.toString()}`)
      .then((response) => response.json())
      .then((data) => setPieces(Array.isArray(data) ? data : []))
      .catch(() => setPieces([]));
  }, [query, pieceType, brand, rarity]);

  const trendingPieces = useMemo(() => pieces.slice(0, 4), [pieces]);

  return (
    <div className="space-y-6">
      <PageHeader title="Peças Públicas" subtitle="Feed global de peças públicas de criadores da plataforma." />

      <SectionBlock title="Descobrir Peças" subtitle="Busque, filtre e abra detalhes premium com prévia 3D quando disponível.">
        <div className="mt-4 space-y-2">
          <PieceSearchInput value={query} onChange={setQuery} />
          <PieceFilterBar
            pieceType={pieceType}
            brand={brand}
            rarity={rarity}
            onPieceTypeChange={setPieceType}
            onBrandChange={setBrand}
            onRarityChange={setRarity}
          />
          <p className="text-xs text-muted-foreground">{pieces.length} peças encontradas.</p>
        </div>
      </SectionBlock>

      <SectionBlock title="Peças em Destaque" subtitle="Seleções visuais rápidas do feed global ao vivo.">
        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {trendingPieces.map((piece) => (
            <PieceDiscoveryCard key={`trend-${piece.wardrobe_item_id}`} piece={piece} onOpen={setSelectedPiece} />
          ))}
          {!trendingPieces.length ? <p className="text-sm text-muted-foreground">No trending pieces yet.</p> : null}
        </div>
      </SectionBlock>

      <SectionBlock title="All Discoverable Pieces" subtitle="Premium fashion-tech feed with creator context and quick 3D access.">
        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {pieces.map((piece) => (
            <PieceDiscoveryCard key={piece.wardrobe_item_id} piece={piece} onOpen={setSelectedPiece} />
          ))}
          {!pieces.length ? <p className="text-sm text-muted-foreground">No pieces matched your current filters.</p> : null}
        </div>
      </SectionBlock>

      <PieceDetailModal open={Boolean(selectedPiece)} piece={selectedPiece} onClose={() => setSelectedPiece(null)} />
    </div>
  );
}
