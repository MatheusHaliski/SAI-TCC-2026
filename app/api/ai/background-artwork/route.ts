import { NextRequest, NextResponse } from 'next/server';

const SHAPES = ['none', 'orb', 'diamond', 'mesh'] as const;

function buildSvg(prompt: string, palette: string) {
  const [start, end] = palette.includes('black') ? ['#09090b', '#d1d5db'] : palette.includes('warm') ? ['#78350f', '#fde68a'] : ['#0f172a', '#8b5cf6'];
  const safe = prompt.slice(0, 80).replace(/</g, '').replace(/>/g, '');
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='800'><defs><linearGradient id='g' x1='0' x2='1' y1='0' y2='1'><stop offset='0%' stop-color='${start}'/><stop offset='100%' stop-color='${end}'/></linearGradient></defs><rect width='1200' height='800' fill='url(#g)'/><ellipse cx='280' cy='640' rx='360' ry='130' fill='rgba(255,255,255,0.09)'/><ellipse cx='980' cy='220' rx='300' ry='120' fill='rgba(255,255,255,0.06)'/><text x='64' y='740' fill='rgba(255,255,255,0.42)' font-size='26' font-family='Arial'>${safe}</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function paletteStops(palette: string) {
  if (palette.includes('black') || palette.includes('mono')) return ['#0b1120', '#94a3b8', '#e2e8f0'];
  if (palette.includes('warm') || palette.includes('gold')) return ['#7c2d12', '#f59e0b', '#fde68a'];
  if (palette.includes('neon')) return ['#0f172a', '#22d3ee', '#d946ef'];
  if (palette.includes('emerald')) return ['#022c22', '#10b981', '#67e8f9'];
  return ['#0f172a', '#6366f1', '#a855f7'];
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { prompt?: string; palette?: string; style?: string; mood?: string };
    const prompt = body.prompt?.trim() || 'Luxury editorial abstract background';
    const palette = body.palette?.trim().toLowerCase() || 'cool luxury';
    const stops = paletteStops(palette);

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
      buildSvg(`${prompt} ${body.style || ''} ${body.mood || ''}`, palette),
      buildSvg(`${prompt} variation one`, palette),
      buildSvg(`${prompt} variation two`, palette),
    ];

    return NextResponse.json({ images, gradients });
  } catch {
    return NextResponse.json({ error: 'Unable to generate artwork.' }, { status: 500 });
  }
}
