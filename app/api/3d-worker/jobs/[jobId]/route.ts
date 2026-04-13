import { NextResponse } from 'next/server';

interface RouteContext {
  params: {
    jobId?: string;
  };
}

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

export async function GET(_req: Request, context: RouteContext) {
  const config = resolveWorkerConfig();
  if (!config) {
    return NextResponse.json({ error: 'Worker not configured' }, { status: 500 });
  }

  const jobId = String(context.params.jobId ?? '').trim();
  if (!jobId) {
    return NextResponse.json({ error: 'Missing jobId' }, { status: 400 });
  }

  const response = await fetch(`${config.workerUrl}/jobs/${encodeURIComponent(jobId)}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${config.token}`,
    },
    cache: 'no-store',
  });

  const contentType = response.headers.get('content-type') ?? 'application/json';
  const data = await response.text();

  return new Response(data, {
    status: response.status,
    headers: { 'Content-Type': contentType },
  });
}
