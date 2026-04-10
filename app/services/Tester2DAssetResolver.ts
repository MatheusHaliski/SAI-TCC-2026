export interface Wardrobe2DAssetShape {
  image_url?: string | null;
  raw_upload_image_url?: string | null;
  normalized_2d_preview_url?: string | null;
  approved_catalog_2d_url?: string | null;
  segmented_png_url?: string | null;
  image_assets?: {
    raw_upload_image_url?: string | null;
    normalized_2d_preview_url?: string | null;
    approved_catalog_2d_url?: string | null;
    segmented_png_url?: string | null;
  };
}

export type Tester2DAssetSource =
  | 'approved_catalog_2d_url'
  | 'normalized_2d_preview_url'
  | 'segmented_png_url'
  | 'raw_upload_image_url'
  | 'image_url'
  | 'none';

export interface Tester2DResolvedAsset {
  url: string;
  source: Tester2DAssetSource;
  geometryReliable: boolean;
}

export function getBestTester2DAssetForWardrobeItem(item: Wardrobe2DAssetShape): Tester2DResolvedAsset {
  const prioritized: Array<{ source: Tester2DAssetSource; value?: string | null }> = [
    { source: 'approved_catalog_2d_url', value: item.image_assets?.approved_catalog_2d_url ?? item.approved_catalog_2d_url },
    { source: 'normalized_2d_preview_url', value: item.image_assets?.normalized_2d_preview_url ?? item.normalized_2d_preview_url },
    { source: 'segmented_png_url', value: item.image_assets?.segmented_png_url ?? item.segmented_png_url },
    { source: 'raw_upload_image_url', value: item.image_assets?.raw_upload_image_url ?? item.raw_upload_image_url },
    { source: 'image_url', value: item.image_url },
  ];

  const found = prioritized.find((entry) => Boolean(entry.value));
  if (!found?.value) return { url: '', source: 'none', geometryReliable: false };

  const geometryReliable = found.source !== 'raw_upload_image_url' && found.source !== 'image_url';
  if (!geometryReliable && process.env.NODE_ENV !== 'production') {
    console.warn(`[Tester2D] Falling back to ${found.source}; overlay geometry may be unreliable.`);
  }

  return { url: found.value, source: found.source, geometryReliable };
}

export function getBest2DAssetForWardrobeItem(item: Wardrobe2DAssetShape): string {
  return getBestTester2DAssetForWardrobeItem(item).url;
}
