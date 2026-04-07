import { NextRequest, NextResponse } from 'next/server';

const SHAPES = ['none', 'orb', 'diamond', 'mesh'] as const;

function paletteStops(palette: string, prompt: string) {
  const normalized = `${palette} ${prompt}`.toLowerCase();
  if (normalized.includes('flower') || normalized.includes('floral')) return ['#3f1d63', '#be185d', '#f9a8d4'];
  if (normalized.includes('luxury')) return ['#111827', '#6b7280', '#e5e7eb'];
  if (normalized.includes('black') || normalized.includes('mono')) return ['#0b1120', '#94a3b8', '#e2e8f0'];
  if (normalized.includes('warm') || normalized.includes('gold')) return ['#7c2d12', '#f59e0b', '#fde68a'];
  if (normalized.includes('neon')) return ['#0f172a', '#22d3ee', '#d946ef'];
  if (normalized.includes('emerald')) return ['#022c22', '#10b981', '#67e8f9'];
  return ['#0f172a', '#6366f1', '#a855f7'];
}

function buildArtworkSvg(prompt: string, palette: string) {
  const safePrompt = prompt.slice(0, 120).replace(/[<>]/g, '');
  const stops = paletteStops(palette, prompt);
  const lowerPrompt = prompt.toLowerCase();
  const isFloral = lowerPrompt.includes('flower') || lowerPrompt.includes('floral') || lowerPrompt.includes('petal');

  const floralLayer = isFloral
    ? `
      <g opacity='0.65'>
        <g transform='translate(180 200) scale(1.2)'>
          <circle r='18' fill='rgba(255,255,255,0.85)'/>
          <ellipse rx='12' ry='36' fill='rgba(244,114,182,0.65)' transform='rotate(0)'/>
          <ellipse rx='12' ry='36' fill='rgba(244,114,182,0.65)' transform='rotate(60)'/>
          <ellipse rx='12' ry='36' fill='rgba(244,114,182,0.65)' transform='rotate(120)'/>
        </g>
        <g transform='translate(980 180) scale(0.9)'>
          <circle r='18' fill='rgba(255,255,255,0.8)'/>
          <ellipse rx='10' ry='32' fill='rgba(251,113,133,0.62)' transform='rotate(0)'/>
          <ellipse rx='10' ry='32' fill='rgba(251,113,133,0.62)' transform='rotate(72)'/>
          <ellipse rx='10' ry='32' fill='rgba(251,113,133,0.62)' transform='rotate(144)'/>
        </g>
      </g>`
    : '';

  return `data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='800'>
    <defs>
      <linearGradient id='g' x1='0' x2='1' y1='0' y2='1'>
        <stop offset='0%' stop-color='${stops[0]}'/>
        <stop offset='55%' stop-color='${stops[1]}'/>
        <stop offset='100%' stop-color='${stops[2]}'/>
      </linearGradient>
      <radialGradient id='glow' cx='0.7' cy='0.2' r='0.6'>
        <stop offset='0%' stop-color='rgba(255,255,255,0.22)'/>
        <stop offset='100%' stop-color='rgba(255,255,255,0)'/>
      </radialGradient>
    </defs>
    <rect width='1200' height='800' fill='url(#g)'/>
    <rect width='1200' height='800' fill='url(#glow)'/>
    ${floralLayer}
    <path d='M60 620 C220 520, 360 700, 520 600 S860 500, 1140 620' stroke='rgba(255,255,255,0.22)' stroke-width='3' fill='none'/>
    <text x='52' y='750' fill='rgba(255,255,255,0.45)' font-size='26' font-family='Arial'>${safePrompt}</text>
  </svg>`)}`;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      prompt?: string;
      rawPrompt?: string;
      palette?: string;
      style?: string;
      mood?: string;
    };

    const rawPrompt = body.rawPrompt?.trim() || body.prompt?.trim() || 'Luxury editorial abstract background';
    const enrichedPrompt = `${rawPrompt}${body.style ? `, ${body.style}` : ''}${body.mood ? `, ${body.mood}` : ''}`;
    const palette = body.palette?.trim().toLowerCase() || rawPrompt.toLowerCase();
    const stops = paletteStops(palette, rawPrompt);

    const gradients = [0, 1, 2].map((index) => ({
      background_mode: 'gradient' as const,
      gradient: {
        type: index === 1 ? 'radial' as const : 'linear' as const,
        angle: 90 + index * 45,
        intensity: 95 + index * 8,
        stops: [
          { color: stops[index % stops.length], position: 0 },
          { color: stops[(index + 1) % stops.length], position: 55 },
          { color: stops[(index + 2) % stops.length], position: 100 },
        ],
      },
      shape: SHAPES[index % SHAPES.length],
      label: `AI Gradient ${index + 1}`,
    }));

    const images = [
      buildArtworkSvg(enrichedPrompt, palette),
      buildArtworkSvg(`${rawPrompt} variation one`, palette),
      buildArtworkSvg(`${rawPrompt} variation two`, palette),
    ];

    return NextResponse.json({ images, gradients, promptUsed: rawPrompt });
  } catch {
    return NextResponse.json({ error: 'Unable to generate artwork.' }, { status: 500 });
  }
}
