import { getAdminStorageBucket } from '@/app/lib/firebaseAdmin';

interface RemoveBackgroundInput {
  imageUrl: string;
  storagePrefix: string;
  fileNameSeed: string;
}

interface RemoveBackgroundResult {
  imageUrl: string;
  provider: 'remove.bg';
}

export class RemoveBgService {
  isConfigured(): boolean {
    return Boolean(process.env.REMOVE_BG_API_KEY?.trim());
  }

  async removeBackground(input: RemoveBackgroundInput): Promise<RemoveBackgroundResult | null> {
    const apiKey = process.env.REMOVE_BG_API_KEY?.trim();
    const sourceUrl = input.imageUrl.trim();
    if (!apiKey || !sourceUrl) return null;

    const imageFetch = await fetch(sourceUrl);
    if (!imageFetch.ok) return null;

    const imageBuffer = Buffer.from(await imageFetch.arrayBuffer());
    const contentType = imageFetch.headers.get('content-type') ?? 'image/jpeg';

    const form = new FormData();
    form.append('image_file', new Blob([imageBuffer], { type: contentType }), 'wardrobe-piece.jpg');
    form.append('size', 'auto');

    const removeBgResponse = await fetch('https://api.remove.bg/v1.0/removebg', {
      method: 'POST',
      headers: { 'X-Api-Key': apiKey },
      body: form,
    });

    if (!removeBgResponse.ok) return null;

    const cutoutBuffer = Buffer.from(await removeBgResponse.arrayBuffer());
    const bucket = getAdminStorageBucket();
    const safeSeed = input.fileNameSeed.replace(/[^a-zA-Z0-9_-]/g, '-').slice(0, 80) || 'piece';
    const filePath = `${input.storagePrefix}/${safeSeed}-${Date.now()}.png`;
    const file = bucket.file(filePath);

    await file.save(cutoutBuffer, {
      metadata: { contentType: 'image/png' },
    });
    await file.makePublic();

    return {
      imageUrl: `https://storage.googleapis.com/${bucket.name}/${filePath}`,
      provider: 'remove.bg',
    };
  }
}
