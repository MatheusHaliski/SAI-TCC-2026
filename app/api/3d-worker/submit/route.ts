import { NextResponse } from 'next/server';

function resolveWorkerConfig() {
  const workerUrl = process.env.GPU_WORKER_URL?.trim() ?? '';
  const token = process.env.GPU_WORKER_TOKEN?.trim() ?? '';

  if (!workerUrl || !token) {
    return null;
  }

  return {
    workerUrl: workerUrl.replace(/\/+$/, ''),
    token,
  };
}

export async function POST(req: Request) {
  const config = resolveWorkerConfig();
  if (!config) {
    return NextResponse.json(
      {
        error: 'Worker not configured',
        hint: 'Set GPU_WORKER_URL and GPU_WORKER_TOKEN in the server environment.',
      },
      { status: 500 },
    );
  }

  const body = await req.json().catch(() => null);
  if (!body || typeof body !== 'object') {
    return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
  }

  const payload = body as Record<string, unknown>;
  const options = payload.options && typeof payload.options === 'object'
    ? { ...(payload.options as Record<string, unknown>) }
    : {};

  const typeFallback = typeof options.type === 'string' ? options.type.trim() : '';
  const pieceType = typeof options.pieceType === 'string' ? options.pieceType.trim() : '';
  if (!pieceType && typeFallback) {
    options.pieceType = typeFallback;
  }

  const imageUrl = typeof payload.imageUrl === 'string' ? payload.imageUrl.trim() : '';
  if (!imageUrl && !String(options.pieceType ?? '').trim()) {
    return NextResponse.json(
      { error: 'Invalid payload: provide imageUrl or options.pieceType.' },
      { status: 400 },
    );
  }

  const normalizedPayload: Record<string, unknown> = {
    ...payload,
    options,
  };

  try {
    const response = await fetch(`${config.workerUrl}/jobs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${config.token}`,
      },
      body: JSON.stringify(normalizedPayload),
      cache: 'no-store',
    });

    const contentType = response.headers.get('content-type') ?? 'application/json';
    const data = await response.text();

    return new Response(data, {
      status: response.status,
      headers: { 'Content-Type': contentType },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      {
        error: 'Worker request failed',
        details: message,
        workerUrl: config.workerUrl,
      },
      { status: 502 },
    );
  }
}
