import { NextRequest, NextResponse } from 'next/server';
import { getAdminFirestore, getAdminStorageBucket } from '@/app/lib/firebaseAdmin';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as { pieceId: string; imageUrl: string };
    if (!body.pieceId || !body.imageUrl) {
      return NextResponse.json({ bgRemovedUrl: null, error: 'Missing pieceId or imageUrl.' }, { status: 400 });
    }

    // Check if already processed
    const db = getAdminFirestore();
    const doc = await db.collection('saiWardrobeItems').doc(body.pieceId).get();
    const existing = doc.data()?.bgRemovedImageUrl as string | undefined;
    if (existing) {
      return NextResponse.json({ bgRemovedUrl: existing, error: null });
    }

    const imageFetch = await fetch(body.imageUrl);
    if (!imageFetch.ok) {
      return NextResponse.json({ bgRemovedUrl: null, error: `Could not fetch image (${imageFetch.status}).` }, { status: 502 });
    }
    const imageBuffer = Buffer.from(await imageFetch.arrayBuffer());
    const contentType = imageFetch.headers.get('content-type') ?? 'image/jpeg';

    const form = new FormData();
    form.append('image_file', new Blob([imageBuffer], { type: contentType }), 'piece.jpg');
    form.append('size', 'auto');

    const removeBgRes = await fetch('https://api.remove.bg/v1.0/removebg', {
      method: 'POST',
      headers: { 'X-Api-Key': process.env.REMOVE_BG_API_KEY ?? '' },
      body: form,
    });
    if (!removeBgRes.ok) {
      const errText = await removeBgRes.text().catch(() => '');
      return NextResponse.json({ bgRemovedUrl: null, error: `Background removal failed (${removeBgRes.status}): ${errText}` }, { status: 502 });
    }

    const cutoutBuffer = Buffer.from(await removeBgRes.arrayBuffer());
    const bucket = getAdminStorageBucket();
    const ts = Date.now();
    const filePath = `wardrobe-bg-removed/${body.pieceId}-${ts}.png`;
    const file = bucket.file(filePath);
    await file.save(cutoutBuffer, { metadata: { contentType: 'image/png' } });
    await file.makePublic();
    const bgRemovedUrl = `https://storage.googleapis.com/${bucket.name}/${filePath}`;

    await db.collection('saiWardrobeItems').doc(body.pieceId).set(
      { bgRemovedImageUrl: bgRemovedUrl, updatedAt: new Date().toISOString() },
      { merge: true },
    );

    return NextResponse.json({ bgRemovedUrl, error: null });
  } catch (error) {
    return NextResponse.json({ bgRemovedUrl: null, error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}
