import { NextResponse } from 'next/server';

function isAllowedMeshyAsset(url: URL) {
  return url.protocol === 'https:' && (url.hostname === 'assets.meshy.ai' || url.hostname.endsWith('.meshy.ai'));
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const rawAssetUrl = String(url.searchParams.get('url') ?? '').trim();
  if (!rawAssetUrl) {
    return NextResponse.json({ error: 'Missing url query parameter.' }, { status: 400 });
  }

  let parsedAssetUrl: URL;
  try {
    parsedAssetUrl = new URL(rawAssetUrl);
  } catch {
    return NextResponse.json({ error: 'Invalid asset URL.' }, { status: 400 });
  }

  if (!isAllowedMeshyAsset(parsedAssetUrl)) {
    return NextResponse.json({ error: 'Only Meshy asset URLs are allowed.' }, { status: 403 });
  }

  const response = await fetch(parsedAssetUrl.toString(), {
    method: 'GET',
    cache: 'no-store',
  });

  if (!response.ok) {
    return NextResponse.json({ error: 'Failed to fetch model asset.' }, { status: response.status });
  }

  const body = await response.arrayBuffer();
  const contentType = response.headers.get('content-type') ?? 'model/gltf-binary';

  return new NextResponse(body, {
    status: 200,
    headers: {
      'Content-Type': contentType,
      'Cache-Control': 'private, max-age=300',
    },
  });
}
