import { NextRequest, NextResponse } from 'next/server';

function buildSvg(prompt: string, palette: string) {
  const [start, end] = palette.includes('black') ? ['#09090b', '#d1d5db'] : palette.includes('warm') ? ['#78350f', '#fde68a'] : ['#0f172a', '#8b5cf6'];
  const safe = prompt.slice(0, 80).replace(/</g, '').replace(/>/g, '');
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='800'><defs><linearGradient id='g' x1='0' x2='1' y1='0' y2='1'><stop offset='0%' stop-color='${start}'/><stop offset='100%' stop-color='${end}'/></linearGradient></defs><rect width='1200' height='800' fill='url(#g)'/><ellipse cx='280' cy='640' rx='360' ry='130' fill='rgba(255,255,255,0.09)'/><ellipse cx='980' cy='220' rx='300' ry='120' fill='rgba(255,255,255,0.06)'/><text x='64' y='740' fill='rgba(255,255,255,0.42)' font-size='26' font-family='Arial'>${safe}</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { prompt?: string; palette?: string; style?: string; mood?: string };
    const prompt = body.prompt?.trim() || 'Luxury editorial abstract background';
    const palette = body.palette?.trim() || 'cool luxury';
    const result = [
      buildSvg(`${prompt} ${body.style || ''} ${body.mood || ''}`, palette),
      buildSvg(`${prompt} variation one`, palette),
      buildSvg(`${prompt} variation two`, palette),
    ];
    return NextResponse.json({ images: result });
  } catch {
    return NextResponse.json({ error: 'Unable to generate artwork.' }, { status: 500 });
  }
}
