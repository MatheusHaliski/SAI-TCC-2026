import { NextRequest, NextResponse } from 'next/server';

type WorkerConfig =
  | { type: 'runpod'; workerUrl: string; token: string }
  | { type: 'meshy'; baseUrl: string; token: string };

function resolveWorkerConfig(): WorkerConfig | null {
  // Prefer the RunPod GPU worker: job IDs in this route are always RunPod worker IDs,
  // never Meshy task IDs. Polling Meshy with a RunPod jobId would return 404.
  const workerUrl = (
    process.env.GPU_WORKER_URL ?? process.env.BLENDER_CLOUD_API_URL ?? ''
  ).trim().replace(/\/+$/, '');
  const token = (
    process.env.GPU_WORKER_TOKEN ?? process.env.BLENDER_CLOUD_API_TOKEN ?? ''
  ).trim();
  if (workerUrl && token) {
    return { type: 'runpod', workerUrl, token };
  }

  // Fallback to Meshy only when no RunPod worker is configured.
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

  const abort = new AbortController();
  const abortTimer = setTimeout(() => abort.abort(), 15000);

  let response: Response;
  try {
    response = await fetch(statusUrl, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${config.token}`,
      },
      cache: 'no-store',
      signal: abort.signal,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Network error';
    return NextResponse.json(
      { error: 'upstream_timeout', message },
      { status: 503 }
    );
  } finally {
    clearTimeout(abortTimer);
  }

  const contentType = response.headers.get('content-type') ?? 'application/json';
  const data = await response.text();

  return new Response(data, {
    status: response.status,
    headers: { 'Content-Type': contentType },
  });
}
