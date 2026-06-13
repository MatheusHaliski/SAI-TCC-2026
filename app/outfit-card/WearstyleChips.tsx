import { inferWearstylesByPieceType, normalizeWearstyles } from '@/app/lib/outfit-card';
import VisualToken from '@/app/components/outfit-card/VisualToken';

interface WearstyleChipsProps {
  wearstyles?: string[];
  pieceType?: string;
}

export default function WearstyleChips({ wearstyles, pieceType }: WearstyleChipsProps) {
  const normalized = normalizeWearstyles(wearstyles);
  const resolvedWearstyles = normalized.length ? normalized : inferWearstylesByPieceType(pieceType);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
      <p style={{ fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(255,255,255,0.55)', margin: 0 }}>
        WearStyle Badges
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
        {resolvedWearstyles.map(ws => (
          <VisualToken key={ws} type="wearstyle" value={ws} />
        ))}
      </div>
    </div>
  );
}
