import sharp from 'sharp';

export interface ShoesBbox {
  x: number;
  y: number;
  w: number;
  h: number;
}

const CHANNELS_RGBA = 4;
const MIN_TEXTURE_ALPHA = 28;
const MIN_TARGET_LUMINANCE = 105;
const MAX_TARGET_CHROMA = 82;
const FALLBACK_TARGET_LUMINANCE = 138;
const VERTICAL_PERSPECTIVE_RATIO = 0.55;

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function luminance(r: number, g: number, b: number): number {
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function chroma(r: number, g: number, b: number): number {
  return Math.max(r, g, b) - Math.min(r, g, b);
}

function isPaintableShoeSurface(r: number, g: number, b: number): boolean {
  const lum = luminance(r, g, b);
  const colorSpread = chroma(r, g, b);

  return lum >= MIN_TARGET_LUMINANCE && (colorSpread <= MAX_TARGET_CHROMA || lum >= FALLBACK_TARGET_LUMINANCE);
}

function mapTextureOntoSurface(baseChannel: number, textureChannel: number, shade: number, strength: number): number {
  const mapped = clamp(textureChannel * shade, 0, 255);
  return Math.round(baseChannel * (1 - strength) + mapped * strength);
}

/**
 * Extracts pigmentation (color + texture) from a bg-removed shoe image and
 * paints it onto the existing light shoe surface in the base image. The shoe
 * texture is perspective-compressed vertically, then used as a color mask
 * instead of being composited as a raw product photo.
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

  const boundedBox = {
    x: clamp(targetBox.x, 0, Math.max(0, baseWidth - 1)),
    y: clamp(targetBox.y, 0, Math.max(0, baseHeight - 1)),
    w: Math.min(targetBox.w, baseWidth - clamp(targetBox.x, 0, Math.max(0, baseWidth - 1))),
    h: Math.min(targetBox.h, baseHeight - clamp(targetBox.y, 0, Math.max(0, baseHeight - 1))),
  };

  if (boundedBox.w <= 0 || boundedBox.h <= 0) {
    return sharp(baseImageBuffer).jpeg({ quality: 90 }).toBuffer();
  }

  const shoe = sharp(bgRemovedShoeBuffer);
  const shoeMeta = await shoe.metadata();

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

  // Pad to the full bbox so the texture sits at the bottom of the foot area.
  const padTop = targetBox.h - finalExtractH;
  const shoeTexture = await sharp(shoeLayer)
    .extend({ top: padTop, bottom: 0, left: 0, right: 0, background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .resize(boundedBox.w, boundedBox.h, { fit: 'fill' })
    .png()
    .toBuffer();

  const baseRaw = await sharp(baseImageBuffer)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const textureRaw = await sharp(shoeTexture)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const output = Buffer.from(baseRaw.data);
  const baseInfo = baseRaw.info;
  const textureInfo = textureRaw.info;

  for (let y = 0; y < boundedBox.h; y += 1) {
    for (let x = 0; x < boundedBox.w; x += 1) {
      const baseX = boundedBox.x + x;
      const baseY = boundedBox.y + y;
      const baseIndex = (baseY * baseInfo.width + baseX) * CHANNELS_RGBA;
      const textureIndex = (y * textureInfo.width + x) * CHANNELS_RGBA;

      const textureAlpha = textureRaw.data[textureIndex + 3] ?? 0;
      if (textureAlpha < MIN_TEXTURE_ALPHA) continue;

      const baseR = output[baseIndex] ?? 0;
      const baseG = output[baseIndex + 1] ?? 0;
      const baseB = output[baseIndex + 2] ?? 0;

      if (!isPaintableShoeSurface(baseR, baseG, baseB)) continue;

      const textureR = textureRaw.data[textureIndex] ?? 0;
      const textureG = textureRaw.data[textureIndex + 1] ?? 0;
      const textureB = textureRaw.data[textureIndex + 2] ?? 0;
      const baseLum = luminance(baseR, baseG, baseB);
      const shade = clamp(baseLum / 230, 0.52, 1.14);
      const alphaStrength = clamp(textureAlpha / 255, 0, 1);
      const surfaceStrength = clamp((baseLum - MIN_TARGET_LUMINANCE) / 110, 0.35, 0.88);
      const strength = clamp(alphaStrength * surfaceStrength, 0, 0.84);

      output[baseIndex] = mapTextureOntoSurface(baseR, textureR, shade, strength);
      output[baseIndex + 1] = mapTextureOntoSurface(baseG, textureG, shade, strength);
      output[baseIndex + 2] = mapTextureOntoSurface(baseB, textureB, shade, strength);
    }
  }

  return sharp(output, {
    raw: {
      width: baseInfo.width,
      height: baseInfo.height,
      channels: CHANNELS_RGBA,
    },
  })
    .jpeg({ quality: 90 })
    .toBuffer();
}
