export interface Wardrobe2DAssetShape {
  image_url?: string | null;
  raw_upload_image_url?: string | null;
  normalized_2d_preview_url?: string | null;
  approved_catalog_2d_url?: string | null;
  image_assets?: {
    raw_upload_image_url?: string | null;
    normalized_2d_preview_url?: string | null;
    approved_catalog_2d_url?: string | null;
  };
}

export function getBest2DAssetForWardrobeItem(item: Wardrobe2DAssetShape): string {
  return (
    item.image_assets?.approved_catalog_2d_url
    || item.approved_catalog_2d_url
    || item.image_assets?.normalized_2d_preview_url
    || item.normalized_2d_preview_url
    || item.image_assets?.raw_upload_image_url
    || item.raw_upload_image_url
    || item.image_url
    || ''
  );
}
