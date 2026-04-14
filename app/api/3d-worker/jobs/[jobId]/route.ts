import { NextRequest, NextResponse } from 'next/server';

interface RouteContext {
  params: Promise<{
    jobId: string;
  }>;
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

function toRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' ? (value as Record<string, unknown>) : {};
}

function readNumber(value: unknown): number | null {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function normalizeWorkerPayload(payload: unknown): Record<string, unknown> {
  const body = toRecord(payload);
  const error = toRecord(body.error);
  const metrics = toRecord(body.metrics);
  const qualityReport = toRecord(error.qualityReport ?? metrics.qualityReport ?? body.qualityReport);
  const qualityThreshold = readNumber(error.qualityThreshold ?? metrics.cleanedQualityThreshold ?? body.cleanedQualityThreshold);
  const brightness = readNumber(qualityReport.brightness);
  const contrast = readNumber(qualityReport.contrast);
  const qualityScore = readNumber(qualityReport.qualityScore ?? body.qualityScore);
  const errorCode = typeof error.code === 'string' ? error.code.trim() : '';
  const errorMessage = typeof error.message === 'string' ? error.message.trim() : '';
  const cleanedPngUrl =
    (typeof body.cleanedPngUrl === 'string' && body.cleanedPngUrl.trim())
    || (typeof toRecord(body.artifacts).cleaned_png_url === 'string' && String(toRecord(body.artifacts).cleaned_png_url).trim())
    || (typeof toRecord(body.artifacts).cleanedPngUrl === 'string' && String(toRecord(body.artifacts).cleanedPngUrl).trim())
    || null;

  if (errorCode === 'invalid_input_low_quality') {
    console.warn('[3d-worker] cleaned image rejected by quality gate', {
      jobId: body.jobId ?? body.job_id ?? body.id ?? null,
      cleanedQualityThreshold: qualityThreshold,
      brightness,
      contrast,
      qualityScore,
      errorCode,
      errorMessage,
      cleanedPngUrl,
    });

    return {
      ...body,
      diagnostics: {
        ...(toRecord(body.diagnostics)),
        cleanedQualityThreshold: qualityThreshold,
        brightness,
        contrast,
        qualityScore,
        cleanedPngUrl,
      },
      error:
        '3D generation failed: cleaned garment too dark/low contrast. Ready for 2D try-on.',
    };
  }

  return body;
}

export async function GET(_req: NextRequest, context: RouteContext) {
  const config = resolveWorkerConfig();
  if (!config) {
    return NextResponse.json({ error: 'Worker not configured' }, { status: 500 });
  }

  const params = await context.params;
  const jobId = String(params.jobId ?? '').trim();
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

  if (contentType.includes('application/json')) {
    try {
      const parsed = JSON.parse(data || '{}');
      const normalized = normalizeWorkerPayload(parsed);
      return NextResponse.json(normalized, { status: response.status });
    } catch {
      // passthrough as plain body when upstream sends invalid JSON with application/json header
    }
  }

  return new Response(data, {
    status: response.status,
    headers: { 'Content-Type': contentType },
  });
}
