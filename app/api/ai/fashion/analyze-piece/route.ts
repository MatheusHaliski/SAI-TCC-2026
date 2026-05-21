import { readFileSync } from 'fs';
import { join } from 'path';
import { NextRequest, NextResponse } from 'next/server';
import { googleFashionAI } from '@/app/lib/ai/googleFashionAI';
import { BrandLogoReference } from '@/app/lib/ai/providers/types';

const BRAND_LOGO_FILES: Array<{ name: string; file: string; mimeType: string }> = [
  { name: 'Adidas', file: 'adidas.png', mimeType: 'image/png' },
  { name: 'Nike', file: 'nike.png', mimeType: 'image/png' },
  { name: 'Zara', file: 'zara.jpg', mimeType: 'image/jpeg' },
  { name: 'Puma', file: 'puma.jpg', mimeType: 'image/jpeg' },
  { name: 'Lacoste', file: 'lacoste.jpg', mimeType: 'image/jpeg' },
  { name: "Levi's", file: 'levis.jpg', mimeType: 'image/jpeg' },
  { name: 'C&A', file: 'cea.jpg', mimeType: 'image/jpeg' },
];

function loadBrandLogos(): BrandLogoReference[] {
  return BRAND_LOGO_FILES.flatMap(({ name, file, mimeType }) => {
    try {
      const filePath = join(process.cwd(), 'public', file);
      const data = readFileSync(filePath).toString('base64');
      return [{ name, data, mimeType }];
    } catch {
      return [];
    }
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.base64Image && !body.imageUrl) {
      return NextResponse.json(
        { ok: false, provider: 'google', failedStage: 'analyze_piece', message: 'Missing base64Image or imageUrl', fallbackUsed: false },
        { status: 400 }
      );
    }

    const brandLogos = loadBrandLogos();

    const result = await googleFashionAI.analyzeFashionImage({
      base64Image: body.base64Image,
      imageUrl: body.imageUrl,
      mimeType: body.mimeType,
      brandLogos,
    });

    return NextResponse.json({ ok: true, data: result });
  } catch (error: any) {
    console.error('[POST /api/ai/fashion/analyze-piece] Error:', error);
    return NextResponse.json(
      { ok: false, provider: 'google', failedStage: 'analyze_piece', message: error.message || 'Unknown error', fallbackUsed: true },
      { status: 500 }
    );
  }
}
