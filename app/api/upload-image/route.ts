import { getAdminStorageBucket } from '@/app/lib/firebaseAdmin';
import { NextResponse } from 'next/server';

const MAX_FILE_SIZE_BYTES = 8 * 1024 * 1024;

const extensionFromMimeType = (mimeType: string) => {
  if (mimeType === 'image/jpeg') return 'jpg';
  if (mimeType === 'image/png') return 'png';
  if (mimeType === 'image/webp') return 'webp';
  if (mimeType === 'image/gif') return 'gif';
  return 'bin';
};

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('image');

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'Image file is required.' }, { status: 400 });
    }

    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Only image files are allowed.' }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json({ error: 'Image must be smaller than 8MB.' }, { status: 400 });
    }

    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const bucket = getAdminStorageBucket();
    const fileExtension = extensionFromMimeType(file.type);
    const path = `wardrobe-images/${Date.now()}-${crypto.randomUUID()}.${fileExtension}`;
    const bucketFile = bucket.file(path);
    const downloadToken = crypto.randomUUID();

    await bucketFile.save(fileBuffer, {
      metadata: {
        contentType: file.type,
        metadata: {
          firebaseStorageDownloadTokens: downloadToken,
        },
      },
      resumable: false,
      public: false,
      validation: 'md5',
    });

    const encodedPath = encodeURIComponent(path);
    const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodedPath}?alt=media&token=${downloadToken}`;

    return NextResponse.json({ image_url: imageUrl }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Unable to upload image.' }, { status: 500 });
  }
}
