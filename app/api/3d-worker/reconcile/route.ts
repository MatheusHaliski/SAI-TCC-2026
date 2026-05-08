import { NextRequest, NextResponse } from 'next/server';
import { reconcileJob, resolveWorkerConfig } from '@/app/api/3d-worker/status/route';

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON body' }, { status: 400 });
  }

  const pieceId = String(body.pieceId ?? '').trim();
  const jobId = String(body.jobId ?? '').trim();

  if (!pieceId || !jobId) {
    return NextResponse.json(
      { ok: false, error: 'pieceId and jobId are required' },
      { status: 400 },
    );
  }

  if (!resolveWorkerConfig()) {
    return NextResponse.json(
      { ok: false, error: 'GPU_WORKER_URL and GPU_WORKER_TOKEN must be set' },
      { status: 500 },
    );
  }

  try {
    const result = await reconcileJob(pieceId, jobId);

    if (result.status === 'error') {
      const errResult = result as { ok: false; status: 'error'; error: string };
      const isUnreachable = errResult.error.startsWith('worker_unreachable');
      return NextResponse.json(errResult, { status: isUnreachable ? 503 : 502 });
    }

    if (result.status === 'job_not_found') {
      return NextResponse.json(result, { status: 404 });
    }

    return NextResponse.json(result, { status: result.ok ? 200 : 502 });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[3d-worker/reconcile] unexpected error', { pieceId, jobId, error: message });
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
