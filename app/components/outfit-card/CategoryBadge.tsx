import { PieceCategory, getCategoryBadgeStyle } from '@/app/lib/outfit-card';

interface CategoryBadgeProps {
  category?: PieceCategory;
}

export default function CategoryBadge({ category }: CategoryBadgeProps) {
  const resolvedCategory: PieceCategory = category ?? 'Standard';

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold tracking-wide ${getCategoryBadgeStyle(
        resolvedCategory,
      )}`}
    >
      {resolvedCategory}
    </span>
  );
}
