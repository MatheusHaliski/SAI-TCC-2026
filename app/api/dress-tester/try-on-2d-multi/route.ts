import { NextRequest, NextResponse } from 'next/server';
import { getAdminStorageBucket } from '@/app/lib/firebaseAdmin';
import { paintShoesOntoImage } from '@/app/backend/services/ShoesPaintingService';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

type FashnCategory = 'tops' | 'bottoms' | 'full-body';
type OutfitSlot = 'upper' | 'lower' | 'shoes' | 'accessory';

const SLOT_TO_FASHN_CATEGORY: Record<OutfitSlot, FashnCategory | null> = {
  upper: 'tops',
  lower: 'bottoms',
  shoes: null, // Fashn.ai does not support footwear — shoes are rendered as a 2D overlay client-side
  accessory: null,
};

const SLOT_PROCESS_ORDER: OutfitSlot[] = ['upper', 'lower'];

interface GarmentItem {
  garmentId: string;
  garmentImageUrl: string;
  slotType: OutfitSlot;
}

interface ShoeOverlayInput {
  imageUrl?: string;
  bgRemovedUrl?: string | null;
  bbox: { x: number; y: number; w: number; h: number };
  canvas?: { width: number; height: number };
}

function validateShoeOverlay(input?: ShoeOverlayInput): input is ShoeOverlayInput & { bbox: { x: number; y: number; w: number; h: number } } {
  if (!input?.bbox) return false;
  const values = [input.bbox.x, input.bbox.y, input.bbox.w, input.bbox.h];
  return values.every((value) => Number.isFinite(value)) && input.bbox.w > 0 && input.bbox.h > 0 && Boolean(input.bgRemovedUrl || input.imageUrl);
}

async function removeShoeBgIfNeeded(
  overlay: ShoeOverlayInput,
  bucket: ReturnType<typeof getAdminStorageBucket>,
  ts: number,
): Promise<string> {
  if (overlay.bgRemovedUrl) return overlay.bgRemovedUrl;
  if (!overlay.imageUrl) throw new Error('Missing shoe imageUrl.');

  const imageFetch = await fetch(overlay.imageUrl);
  if (!imageFetch.ok) throw new Error(`Could not fetch shoe image (${imageFetch.status}).`);
  const imageBuffer = Buffer.from(await imageFetch.arrayBuffer());
  const contentType = imageFetch.headers.get('content-type') ?? 'image/jpeg';

  const form = new FormData();
  form.append('image_file', new Blob([imageBuffer], { type: contentType }), 'shoe.jpg');
  form.append('size', 'auto');

  const removeBgRes = await fetch('https://api.remove.bg/v1.0/removebg', {
    method: 'POST',
    headers: { 'X-Api-Key': process.env.REMOVE_BG_API_KEY ?? '' },
    body: form,
  });
  if (!removeBgRes.ok) {
    const errText = await removeBgRes.text().catch(() => '');
    throw new Error(`Shoe background removal failed (${removeBgRes.status}): ${errText}`);
  }

  const cutoutBuffer = Buffer.from(await removeBgRes.arrayBuffer());
  const filePath = `dress-tester-temp/shoe-cutout-${ts}.png`;
  const file = bucket.file(filePath);
  await file.save(cutoutBuffer, { metadata: { contentType: 'image/png' } });
  await file.makePublic();
  return `https://storage.googleapis.com/${bucket.name}/${filePath}`;
}

async function removeBgAndUpload(
  item: GarmentItem,
  bucket: ReturnType<typeof getAdminStorageBucket>,
  ts: number,
  index: number,
): Promise<string> {
  const garmentFetch = await fetch(item.garmentImageUrl);
  if (!garmentFetch.ok) throw new Error(`Could not fetch garment ${item.garmentId} (${garmentFetch.status})`);
  const garmentBuffer = Buffer.from(await garmentFetch.arrayBuffer());
  const contentType = garmentFetch.headers.get('content-type') ?? 'image/jpeg';

  const removeBgForm = new FormData();
  removeBgForm.append('image_file', new Blob([garmentBuffer], { type: contentType }), 'garment.jpg');
  removeBgForm.append('size', 'auto');

  const removeBgRes = await fetch('https://api.remove.bg/v1.0/removebg', {
    method: 'POST',
    headers: { 'X-Api-Key': process.env.REMOVE_BG_API_KEY ?? '' },
    body: removeBgForm,
  });
  if (!removeBgRes.ok) {
    if (removeBgRes.status === 401) {
      throw new Error('Chave de API remove.bg inválida ou ausente (REMOVE_BG_API_KEY). Verifique as variáveis de ambiente.');
    }
    const errText = await removeBgRes.text().catch(() => '');
    throw new Error(`Background removal failed for ${item.garmentId} (${removeBgRes.status}): ${errText}`);
  }

  const cutoutBuffer = Buffer.from(await removeBgRes.arrayBuffer());
  const filePath = `dress-tester-temp/${item.garmentId}-${ts}-${index}.png`;
  const file = bucket.file(filePath);
  await file.save(cutoutBuffer, { metadata: { contentType: 'image/png' } });
  await file.makePublic();
  return `https://storage.googleapis.com/${bucket.name}/${filePath}`;
}

async function runFashnTryOn(modelImageUrl: string, garmentImageUrl: string, category: FashnCategory): Promise<string> {
  const fashnBody = {
    model_name: 'tryon-v1.6',
    inputs: { model_image: modelImageUrl, garment_image: garmentImageUrl, category },
  };
  console.log('[try-on-2d-multi] fashn.ai request', { category, modelImageUrl: modelImageUrl.slice(-40) });

  const fashnRunRes = await fetch('https://api.fashn.ai/v1/run', {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.FASHN_API_KEY ?? ''}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(fashnBody),
  });
  const fashnRunRaw = await fashnRunRes.text();
  const fashnRunPayload = JSON.parse(fashnRunRaw) as { id?: string; predictionId?: string; error?: string; message?: string };
  const predictionId = fashnRunPayload.predictionId ?? fashnRunPayload.id;
  if (!fashnRunRes.ok || !predictionId) {
    if (fashnRunRes.status === 401) {
      throw new Error('Chave de API Fashn.ai inválida ou ausente (FASHN_API_KEY). Verifique as variáveis de ambiente.');
    }
    const detail = fashnRunPayload.error ?? fashnRunPayload.message ?? fashnRunRaw;
    throw new Error(`Fashn.ai request failed (${fashnRunRes.status}): ${detail}`);
  }

  const start = Date.now();
  while (Date.now() - start < 60000) {
    await sleep(1500);
    const statusRes = await fetch(`https://api.fashn.ai/v1/status/${predictionId}`, {
      headers: { Authorization: `Bearer ${process.env.FASHN_API_KEY ?? ''}` },
    });
    const statusPayload = await statusRes.json() as { status?: string; output?: string | string[]; resultImageUrl?: string; error?: unknown };
    if (statusPayload.status === 'completed') {
      const rawOutput = statusPayload.output;
      const resultImageUrl = statusPayload.resultImageUrl ?? (Array.isArray(rawOutput) ? rawOutput[0] : rawOutput) ?? null;
      if (!resultImageUrl) throw new Error('Fashn.ai completed but returned no image.');
      return resultImageUrl as string;
    }
    if (statusPayload.status === 'error' || statusPayload.status === 'failed') {
      const errRaw = statusPayload.error;
      const errMsg = typeof errRaw === 'string' ? errRaw : (errRaw && typeof errRaw === 'object' ? ((errRaw as { message?: string }).message ?? JSON.stringify(errRaw)) : 'Virtual try-on failed.');
      throw new Error(errMsg);
    }
  }
  throw new Error('Virtual try-on timed out.');
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as { mannequinImageUrl: string; items: GarmentItem[]; shoesOverlay?: ShoeOverlayInput };

    const shoesOverlay = validateShoeOverlay(body.shoesOverlay) ? body.shoesOverlay : null;
    const hasShoeOverlay = Boolean(shoesOverlay);

    if (!body.mannequinImageUrl || !Array.isArray(body.items) || (body.items.length < 1 && !hasShoeOverlay)) {
      return NextResponse.json({ status: 'error', resultImageUrl: null, error: 'Invalid payload: mannequinImageUrl and at least 1 item or shoes overlay required.' }, { status: 400 });
    }
    if (body.items.length > 4) {
      return NextResponse.json({ status: 'error', resultImageUrl: null, error: 'Maximum 4 items allowed.' }, { status: 400 });
    }

    const aiItems = body.items
      .filter((item) => SLOT_TO_FASHN_CATEGORY[item.slotType] !== null)
      .sort((a, b) => SLOT_PROCESS_ORDER.indexOf(a.slotType) - SLOT_PROCESS_ORDER.indexOf(b.slotType));

    if (aiItems.length === 0 && !hasShoeOverlay) {
      return NextResponse.json({ status: 'error', resultImageUrl: null, error: 'No AI-processable items. Accessories are not supported by Fashn.ai virtual try-on.' }, { status: 400 });
    }

    const bucket = getAdminStorageBucket();
    const ts = Date.now();

    const mannequinFetch = await fetch(body.mannequinImageUrl);
    if (!mannequinFetch.ok) {
      return NextResponse.json({ status: 'error', resultImageUrl: null, error: `Could not fetch mannequin image (${mannequinFetch.status}).` }, { status: 502 });
    }
    const mannequinBuffer = Buffer.from(await mannequinFetch.arrayBuffer());
    const mannequinContentType = mannequinFetch.headers.get('content-type') ?? 'image/png';
    const mannequinFilePath = `dress-tester-temp/mannequin-${ts}.png`;
    const mannequinFile = bucket.file(mannequinFilePath);
    await mannequinFile.save(mannequinBuffer, { metadata: { contentType: mannequinContentType } });
    await mannequinFile.makePublic();
    const publicMannequinUrl = `https://storage.googleapis.com/${bucket.name}/${mannequinFilePath}`;

    // Remove background from all garments in parallel, then chain AI requests.
    const garmentUrls = aiItems.length
      ? await Promise.all(aiItems.map((item, idx) => removeBgAndUpload(item, bucket, ts, idx)))
      : [];

    let currentModelUrl = publicMannequinUrl;
    for (let i = 0; i < aiItems.length; i++) {
      const item = aiItems[i];
      const fashnCategory = SLOT_TO_FASHN_CATEGORY[item.slotType] as FashnCategory;
      console.log(`[try-on-2d-multi] Step ${i + 1}/${aiItems.length}: slot=${item.slotType} category=${fashnCategory}`);
      currentModelUrl = await runFashnTryOn(currentModelUrl, garmentUrls[i], fashnCategory);
    }

    // Paint shoes onto the Fashn.ai result, or directly onto the mannequin if
    // shoes are the only selected item.
    let finalResultUrl = currentModelUrl;
    if (shoesOverlay) {
      try {
        console.log('[try-on-2d-multi] painting shoes onto result');
        const shoeCutoutUrl = await removeShoeBgIfNeeded(shoesOverlay, bucket, ts);
        const [baseRes, shoeRes] = await Promise.all([
          fetch(currentModelUrl),
          fetch(shoeCutoutUrl),
        ]);
        if (baseRes.ok && shoeRes.ok) {
          const [baseBuffer, shoeBuffer] = await Promise.all([
            baseRes.arrayBuffer().then(Buffer.from),
            shoeRes.arrayBuffer().then(Buffer.from),
          ]);
          const paintedBuffer = await paintShoesOntoImage(baseBuffer, shoeBuffer, shoesOverlay.bbox, shoesOverlay.canvas);
          const paintedPath = `dress-tester-temp/painted-${ts}.jpg`;
          const paintedFile = bucket.file(paintedPath);
          await paintedFile.save(paintedBuffer, { metadata: { contentType: 'image/jpeg' } });
          await paintedFile.makePublic();
          finalResultUrl = `https://storage.googleapis.com/${bucket.name}/${paintedPath}`;
        }
      } catch (paintErr) {
        console.error('[try-on-2d-multi] shoes painting failed, using unpainted result', paintErr);
      }
    }

    return NextResponse.json({ status: 'completed', resultImageUrl: finalResultUrl, error: null });
  } catch (error) {
    console.error('[try-on-2d-multi] error', error);
    return NextResponse.json({ status: 'error', resultImageUrl: null, error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}
