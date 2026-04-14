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
    return NextResponse.json({ error: 'Worker not configured' }, { status: 500 });
  }

  const body = await req.json().catch(() => null);
  if (!body || typeof body !== 'object') {
    return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
  }

  const response = await fetch(`${config.workerUrl}/jobs`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${config.token}`,
    },
    body: JSON.stringify(body),
    cache: 'no-store',
  });

  const contentType = response.headers.get('content-type') ?? 'application/json';
  const data = await response.text();

  return new Response(data, {
    status: response.status,
    headers: { 'Content-Type': contentType },
  });
}
