import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { getAdminFirestore } from '@/app/lib/firebaseAdmin';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

type GarmentCategory = 'tops' | 'bottoms' | 'full-body';


const toAbsolutePublicUrl = (inputUrl: string, requestUrl: string): string => {
  if (/^https?:\/\//i.test(inputUrl)) return inputUrl;
  return new URL(inputUrl, requestUrl).toString();
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as { garmentId: string; garmentImageUrl: string; garmentCategory: GarmentCategory; mannequinImageUrl: string };
    if (!body.garmentId || !body.garmentImageUrl || !body.garmentCategory || !body.mannequinImageUrl) {
      return NextResponse.json({ status: 'error', resultImageUrl: null, error: 'Invalid payload.' }, { status: 400 });
    }

    const mannequinImageUrl = toAbsolutePublicUrl(body.mannequinImageUrl, request.url);

    const removeBgRes = await fetch('https://api.remove.bg/v1.0/removebg', {
      method: 'POST',
      headers: { 'X-Api-Key': process.env.REMOVE_BG_API_KEY ?? '' },
      body: new URLSearchParams({ image_url: body.garmentImageUrl, size: 'auto' }),
    });
    if (!removeBgRes.ok) {
      return NextResponse.json({ status: 'error', resultImageUrl: null, error: 'Background removal failed.' }, { status: 502 });
    }

    const cutoutBuffer = Buffer.from(await removeBgRes.arrayBuffer());
    const blob = await put(`dress-tester-temp/${body.garmentId}-${Date.now()}.png`, cutoutBuffer, { access: 'public', contentType: 'image/png', addRandomSuffix: true });

    const fashnRunRes = await fetch('https://api.fashn.ai/v1/run', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${process.env.FASHN_API_KEY ?? ''}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model_image: mannequinImageUrl, garment_image: blob.url, category: body.garmentCategory }),
    });
    const fashnRunPayload = await fashnRunRes.json() as { id?: string; predictionId?: string };
    const predictionId = fashnRunPayload.predictionId ?? fashnRunPayload.id;
    if (!fashnRunRes.ok || !predictionId) {
      return NextResponse.json({ status: 'error', resultImageUrl: null, error: 'Virtual try-on request failed.' }, { status: 502 });
    }

    const start = Date.now();
    while (Date.now() - start < 60000) {
      await sleep(1500);
      const statusRes = await fetch(`https://api.fashn.ai/v1/status/${predictionId}`, { headers: { Authorization: `Bearer ${process.env.FASHN_API_KEY ?? ''}` } });
      const statusPayload = await statusRes.json() as { status?: string; output?: string; resultImageUrl?: string; error?: string };
      if (statusPayload.status === 'completed') {
        const resultImageUrl = statusPayload.resultImageUrl ?? statusPayload.output ?? null;
        if (resultImageUrl) {
          await getAdminFirestore().collection('sai-wardrobeItems').doc(body.garmentId).set(
            {
              tryOn2dResultUrl: resultImageUrl,
              updated_at: new Date().toISOString(),
            },
            { merge: true },
          );
        }
        return NextResponse.json({ status: 'completed', resultImageUrl, error: null });
      }
      if (statusPayload.status === 'error' || statusPayload.status === 'failed') {
        return NextResponse.json({ status: 'error', resultImageUrl: null, error: statusPayload.error ?? 'Virtual try-on failed.' }, { status: 502 });
      }
    }

    return NextResponse.json({ status: 'error', resultImageUrl: null, error: 'Virtual try-on timed out.' }, { status: 504 });
  } catch (error) {
    return NextResponse.json({ status: 'error', resultImageUrl: null, error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}
