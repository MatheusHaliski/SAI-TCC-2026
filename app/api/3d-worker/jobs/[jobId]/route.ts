import { NextRequest, NextResponse } from 'next/server';

type WorkerConfig =
  | { type: 'runpod'; workerUrl: string; token: string }
  | { type: 'meshy'; baseUrl: string; token: string };

function resolveWorkerConfig(): WorkerConfig | null {
  const workerUrl = process.env.GPU_WORKER_URL?.trim() ?? '';
  const token = process.env.GPU_WORKER_TOKEN?.trim() ?? '';

  if (workerUrl && token) {
    return { type: 'runpod', workerUrl: workerUrl.replace(/\/+$/, ''), token };
  }

  const meshyApiKey = process.env.MESHY_API_KEY?.trim() ?? '';
  if (meshyApiKey) {
    const baseUrl = (process.env.MESHY_BASE_URL?.trim() || 'https://api.meshy.ai/openapi/v1').replace(/\/+$/, '');
    return { type: 'meshy', baseUrl, token: meshyApiKey };
  }

  return null;
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  const config = resolveWorkerConfig();

  if (!config) {
    return NextResponse.json(
      { error: 'Worker not configured' },
      { status: 500 }
    );
  }

  const { jobId } = await params;

  if (!jobId) {
    return NextResponse.json(
      { error: 'Missing jobId' },
      { status: 400 }
    );
  }

  const statusUrl = config.type === 'meshy'
    ? `${config.baseUrl}/image-to-3d/${jobId}`
    : `${config.workerUrl}/jobs/${jobId}`;

  const response = await fetch(statusUrl, {
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
