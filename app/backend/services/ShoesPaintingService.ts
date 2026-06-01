import sharp from 'sharp';

export interface ShoesBbox {
  x: number;
  y: number;
  w: number;
  h: number;
}

/**
 * Extracts pigmentation (color + texture) from a bg-removed shoe image and
 * paints it onto a base image at the provided bounding box. The shoe is
 * perspective-compressed vertically to simulate a front-facing foot view.
 */
export async function paintShoesOntoImage(
  baseImageBuffer: Buffer,
  bgRemovedShoeBuffer: Buffer,
  bbox: ShoesBbox,
  sourceCanvas?: { width: number; height: number },
): Promise<Buffer> {
  const baseMeta = await sharp(baseImageBuffer).metadata();
  const baseWidth = baseMeta.width ?? sourceCanvas?.width ?? 1200;
  const baseHeight = baseMeta.height ?? sourceCanvas?.height ?? 2000;
  const canvasWidth = sourceCanvas?.width ?? baseWidth;
  const canvasHeight = sourceCanvas?.height ?? baseHeight;
  const scaleX = baseWidth / canvasWidth;
  const scaleY = baseHeight / canvasHeight;
  const targetBox = {
    x: Math.round(bbox.x * scaleX),
    y: Math.round(bbox.y * scaleY),
    w: Math.max(1, Math.round(bbox.w * scaleX)),
    h: Math.max(1, Math.round(bbox.h * scaleY)),
  };

  const shoe = sharp(bgRemovedShoeBuffer);
  const shoeMeta = await shoe.metadata();

  // Perspective simulation: vertical compression brings the side-view shoe
  // closer to the front-facing foot silhouette. 0.55 was calibrated empirically.
  const VERTICAL_PERSPECTIVE_RATIO = 0.55;

  const targetW = targetBox.w;
  const targetH = Math.round(targetBox.h * VERTICAL_PERSPECTIVE_RATIO);

  // Preserve the shoe's natural proportions before compressing height.
  // First resize to targetW (keep aspect), then crop/pad to targetH.
  const shoeNativeW = shoeMeta.width ?? 1;
  const shoeNativeH = shoeMeta.height ?? 1;
  const aspectScaledH = Math.round((targetW / shoeNativeW) * shoeNativeH);

  // Step 1: resize to target width, maintaining aspect ratio
  const shoeResized = await shoe
    .resize(targetW, Math.max(aspectScaledH, 1), { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

  // Step 2: crop to target height centered vertically (keeps the sole + upper,
  // discards excess whitespace at top)
  const resizedMeta = await sharp(shoeResized).metadata();
  const rH = resizedMeta.height ?? aspectScaledH;
  const extractTop = rH > targetH ? Math.round((rH - targetH) / 2) : 0;
  const finalExtractH = Math.min(targetH, rH);

  const shoeLayer = await sharp(shoeResized)
    .extract({ left: 0, top: extractTop, width: targetW, height: finalExtractH })
    .png()
    .toBuffer();

  // Step 3: pad to full bbox height so the shoe sits at the bottom of the bbox
  // (simulates shoe resting on the ground, toe-forward)
  const padTop = targetBox.h - finalExtractH;
  const shoeWithPad = await sharp(shoeLayer)
    .extend({ top: padTop, bottom: 0, left: 0, right: 0, background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

  // Step 4: composite onto the base image at the bbox position
  const result = await sharp(baseImageBuffer)
    .composite([{ input: shoeWithPad, left: targetBox.x, top: targetBox.y, blend: 'over' }])
    .jpeg({ quality: 90 })
    .toBuffer();

  return result;
}
