import type { FabricMaterialConfig } from '@/app/lib/materialPresets';
import type { OutfitBackgroundConfig } from '@/app/lib/outfit-card';

type FabricTextureRenderInput = {
  width: number;
  height: number;
  color: string;
  material: FabricMaterialConfig;
};

export type FabricTextureRenderResult = {
  textureDataUrl: string | null;
  decorativeDataUrl: string | null;
};

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const parseHex = (hex: string) => {
  const normalized = /^#[0-9A-F]{6}$/i.test(hex) ? hex : '#3f3f46';
  return {
    r: Number.parseInt(normalized.slice(1, 3), 16),
    g: Number.parseInt(normalized.slice(3, 5), 16),
    b: Number.parseInt(normalized.slice(5, 7), 16),
  };
};

const tint = (hex: string, delta: number, alpha = 1) => {
  const { r, g, b } = parseHex(hex);
  const next = (channel: number) => clamp(Math.round(channel + delta), 0, 255);
  return `rgba(${next(r)}, ${next(g)}, ${next(b)}, ${alpha})`;
};

function directionToAngle(direction: FabricMaterialConfig['threadDirection']) {
  if (direction === 'horizontal') return 0;
  if (direction === 'vertical') return Math.PI / 2;
  if (direction === 'diagonal') return Math.PI / 4;
  return Math.PI / 4;
}

function drawThreadField(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  material: FabricMaterialConfig,
  color: string,
  angle: number,
) {
  const density = clamp(material.density, 10, 140);
  const spacing = Math.max(4, Math.round(26 - density * 0.2));
  const threadLength = Math.max(6, Math.round(spacing * 1.5));
  const thickness = clamp(material.threadThickness, 0.4, 5);
  const emboss = clamp(material.embossIntensity, 0, 100) / 100;

  ctx.lineCap = 'round';
  for (let y = -height; y < height * 2; y += spacing) {
    for (let x = -width; x < width * 2; x += spacing) {
      const jitter = ((x * 13 + y * 7) % 9) - 4;
      const cx = x + jitter;
      const cy = y - jitter * 0.3;
      const dx = Math.cos(angle) * threadLength * 0.5;
      const dy = Math.sin(angle) * threadLength * 0.5;

      ctx.strokeStyle = tint(color, 42, 0.16 + emboss * 0.1);
      ctx.lineWidth = thickness + 0.45;
      ctx.beginPath();
      ctx.moveTo(cx - dx + 0.8, cy - dy + 0.8);
      ctx.lineTo(cx + dx + 0.8, cy + dy + 0.8);
      ctx.stroke();

      ctx.strokeStyle = tint(color, -36, 0.22 + emboss * 0.12);
      ctx.lineWidth = thickness;
      ctx.beginPath();
      ctx.moveTo(cx - dx, cy - dy);
      ctx.lineTo(cx + dx, cy + dy);
      ctx.stroke();
    }
  }
}

export function renderFabricTextureToCanvas(input: FabricTextureRenderInput): FabricTextureRenderResult {
  if (typeof document === 'undefined') {
    return { textureDataUrl: null, decorativeDataUrl: null };
  }

  const width = clamp(Math.round(input.width), 220, 1200);
  const height = clamp(Math.round(input.height), 260, 1600);
  const { material } = input;

  const textureCanvas = document.createElement('canvas');
  textureCanvas.width = width;
  textureCanvas.height = height;
  const textureCtx = textureCanvas.getContext('2d');

  if (!textureCtx) return { textureDataUrl: null, decorativeDataUrl: null };

  textureCtx.fillStyle = tint(input.color, -6, 0.95);
  textureCtx.fillRect(0, 0, width, height);

  const noiseAlpha = 0.035 + clamp(material.surfaceContrast, 0, 100) / 2200;
  for (let y = 0; y < height; y += 2) {
    for (let x = 0; x < width; x += 2) {
      const grain = ((x * 37 + y * 19) % 100) / 100;
      textureCtx.fillStyle = grain > 0.5 ? tint(input.color, 18, noiseAlpha) : tint(input.color, -14, noiseAlpha);
      textureCtx.fillRect(x, y, 2, 2);
    }
  }

  const primaryAngle = directionToAngle(material.threadDirection);
  drawThreadField(textureCtx, width, height, material, input.color, primaryAngle);
  if (material.threadDirection === 'cross' || material.threadDirection === 'diagonal') {
    drawThreadField(textureCtx, width, height, material, input.color, primaryAngle + Math.PI / 2.5);
  }

  const finishGradient = textureCtx.createLinearGradient(0, 0, width, height);
  if (material.finish === 'satin') {
    finishGradient.addColorStop(0, tint(input.color, 26, 0.18));
    finishGradient.addColorStop(0.4, 'rgba(255,255,255,0.02)');
    finishGradient.addColorStop(1, tint(input.color, -28, 0.28));
  } else {
    finishGradient.addColorStop(0, tint(input.color, 14, 0.08));
    finishGradient.addColorStop(1, tint(input.color, -18, 0.14));
  }
  textureCtx.fillStyle = finishGradient;
  textureCtx.fillRect(0, 0, width, height);

  const decorativeCanvas = document.createElement('canvas');
  decorativeCanvas.width = width;
  decorativeCanvas.height = height;
  const decoCtx = decorativeCanvas.getContext('2d');
  if (!decoCtx) return { textureDataUrl: textureCanvas.toDataURL('image/png'), decorativeDataUrl: null };

  if (material.stitchBorder) {
    const pad = Math.round(Math.min(width, height) * 0.05);
    decoCtx.strokeStyle = tint(material.stitchColor, -8, 0.9);
    decoCtx.lineWidth = Math.max(1, material.threadThickness + 0.8);
    decoCtx.setLineDash([9, 7]);
    decoCtx.lineCap = 'round';
    decoCtx.beginPath();
    decoCtx.roundRect(pad, pad, width - pad * 2, height - pad * 2, Math.round(pad * 0.35));
    decoCtx.stroke();

    decoCtx.strokeStyle = 'rgba(255,255,255,0.22)';
    decoCtx.lineWidth = 1;
    decoCtx.setLineDash([2, 12]);
    decoCtx.beginPath();
    decoCtx.roundRect(pad + 4, pad + 4, width - (pad + 4) * 2, height - (pad + 4) * 2, Math.round(pad * 0.3));
    decoCtx.stroke();
  }

  return {
    textureDataUrl: textureCanvas.toDataURL('image/png'),
    decorativeDataUrl: decorativeCanvas.toDataURL('image/png'),
  };
}

export function buildFabricScopeStyle(scope: NonNullable<OutfitBackgroundConfig['materialLayer']>['scope']) {
  if (scope === 'hero_block') {
    return { inset: '8% 6% 45% 6%' };
  }
  if (scope === 'content_block') {
    return { inset: '50% 6% 8% 6%' };
  }
  return { inset: '0' };
}
