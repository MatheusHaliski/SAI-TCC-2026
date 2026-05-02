export interface Quad {
  topLeft:     { x: number; y: number };
  topRight:    { x: number; y: number };
  bottomLeft:  { x: number; y: number };
  bottomRight: { x: number; y: number };
}

/**
 * Draws garmentImg mapped over the quad region on the mannequin canvas,
 * using horizontal scanline slicing (poor-man's homography) to warp the
 * texture to the torso geometry. blendMode 'multiply' preserves fabric
 * folds and shadows from the base image.
 */
export async function applyTextureToQuad(params: {
  canvas: HTMLCanvasElement;
  mannequinImageUrl: string;
  garmentImageUrl: string;
  quad: Quad;
  blendMode?: GlobalCompositeOperation;
  opacity?: number;
}): Promise<void> {
  const { canvas, mannequinImageUrl, garmentImageUrl, quad, blendMode = 'multiply', opacity = 0.92 } = params;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const [mannequin, garment] = await Promise.all([
    loadImage(mannequinImageUrl),
    loadImage(garmentImageUrl),
  ]);

  canvas.width  = mannequin.naturalWidth;
  canvas.height = mannequin.naturalHeight;
  ctx.drawImage(mannequin, 0, 0);

  const numSlices = 200;
  const gw = garment.naturalWidth;
  const gh = garment.naturalHeight;

  ctx.save();
  ctx.globalAlpha = opacity;
  ctx.globalCompositeOperation = blendMode;

  for (let i = 0; i < numSlices; i++) {
    const t0 = i       / numSlices;
    const t1 = (i + 1) / numSlices;

    const x0L = lerp(quad.topLeft.x,  quad.bottomLeft.x,  t0);
    const y0L = lerp(quad.topLeft.y,  quad.bottomLeft.y,  t0);
    const x0R = lerp(quad.topRight.x, quad.bottomRight.x, t0);
    const y0R = lerp(quad.topRight.y, quad.bottomRight.y, t0);

    const x1L = lerp(quad.topLeft.x,  quad.bottomLeft.x,  t1);
    const y1L = lerp(quad.topLeft.y,  quad.bottomLeft.y,  t1);
    const x1R = lerp(quad.topRight.x, quad.bottomRight.x, t1);
    const y1R = lerp(quad.topRight.y, quad.bottomRight.y, t1);

    const srcY0  = gh * t0;
    const srcY1  = gh * t1;
    const sliceH = srcY1 - srcY0;

    const dstW0 = dist(x0L, y0L, x0R, y0R);
    const dstW1 = dist(x1L, y1L, x1R, y1R);
    const dstW  = Math.max(dstW0, dstW1);
    if (dstW < 1) continue;

    // Draw this horizontal strip of the garment into a temporary canvas
    const tmp = document.createElement('canvas');
    tmp.width  = Math.ceil(gw);
    tmp.height = Math.ceil(sliceH + 1);
    const tc = tmp.getContext('2d');
    if (!tc) continue;
    tc.drawImage(garment, 0, srcY0, gw, sliceH, 0, 0, gw, sliceH + 1);

    // Affine transform that maps the strip to the destination quad slice
    const angle  = Math.atan2(y0R - y0L, x0R - x0L);
    const scaleX = dstW / gw;
    const scaleY = Math.hypot(x1L - x0L, y1L - y0L) / (sliceH || 1);

    ctx.save();
    ctx.transform(
      Math.cos(angle) * scaleX,  Math.sin(angle) * scaleX,
      -Math.sin(angle) * scaleY, Math.cos(angle) * scaleY,
      x0L, y0L,
    );
    ctx.drawImage(tmp, 0, 0);
    ctx.restore();
  }

  ctx.restore();
}

function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }
function dist(x1: number, y1: number, x2: number, y2: number) { return Math.hypot(x2 - x1, y2 - y1); }

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload  = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}
