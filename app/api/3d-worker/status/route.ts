import { NextRequest, NextResponse } from 'next/server';
import { WardrobeItemsRepository } from '@/app/backend/repositories/WardrobeItemsRepository';
import { getAdminStorageBucket } from '@/app/lib/firebaseAdmin';

const RUNNING_STATUSES = new Set(['queued', 'submitted', 'in_progress', 'processing', 'started', 'accepted', 'pending', 'waiting']);
const FAILED_STATUSES = new Set(['failed', 'error', 'errored', 'cancelled', 'canceled', 'timed_out', 'timeout']);

function resolveWorkerConfig(): { workerUrl: string; token: string } | null {
  const workerUrl = (
    process.env.GPU_WORKER_URL ??
    process.env.BLENDER_CLOUD_API_URL ??
    ''
  ).trim().replace(/\/+$/, '');
  const token = (
    process.env.GPU_WORKER_TOKEN ??
    process.env.BLENDER_WORKER_TOKEN ??
    process.env.BLENDER_CLOUD_API_TOKEN ??
    ''
  ).trim();
  if (!workerUrl || !token) return null;
  return { workerUrl, token };
}

async function downloadArtifact(
  workerUrl: string,
  token: string,
  jobId: string,
  filename: string,
): Promise<Buffer | null> {
  try {
    const res = await fetch(`${workerUrl}/artifacts/${jobId}/${filename}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    });
    if (!res.ok) return null;
    return Buffer.from(await res.arrayBuffer());
  } catch {
    return null;
  }
}

async function uploadToFirebase(
  storagePath: string,
  buffer: Buffer,
  contentType: string,
): Promise<string> {
  const bucket = getAdminStorageBucket();
  const file = bucket.file(storagePath);
  const token = crypto.randomUUID();
  await file.save(buffer, {
    metadata: {
      contentType,
      metadata: { firebaseStorageDownloadTokens: token },
    },
    resumable: false,
    public: false,
    validation: 'md5',
  });
  const encodedPath = encodeURIComponent(storagePath);
  return `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodedPath}?alt=media&token=${token}`;
}

export async function GET(req: NextRequest) {
  const pieceId = req.nextUrl.searchParams.get('pieceId')?.trim() ?? '';
  const jobId = req.nextUrl.searchParams.get('jobId')?.trim() ?? '';

  if (!pieceId || !jobId) {
    return NextResponse.json(
      { ok: false, error: 'pieceId and jobId are required' },
      { status: 400 },
    );
  }

  const worker = resolveWorkerConfig();
  if (!worker) {
    return NextResponse.json(
      { ok: false, error: 'GPU_WORKER_URL and GPU_WORKER_TOKEN must be set' },
      { status: 500 },
    );
  }

  // --- Fetch job status from RunPod worker ---
  const abort = new AbortController();
  const abortTimer = setTimeout(() => abort.abort(), 15_000);
  let workerRes: Response;
  try {
    workerRes = await fetch(`${worker.workerUrl}/jobs/${jobId}`, {
      headers: { Authorization: `Bearer ${worker.token}` },
      cache: 'no-store',
      signal: abort.signal,
    });
  } catch (err) {
    clearTimeout(abortTimer);
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ ok: false, error: 'worker_unreachable', message: msg }, { status: 503 });
  } finally {
    clearTimeout(abortTimer);
  }

  if (!workerRes.ok) {
    const body = await workerRes.text().catch(() => '');
    return NextResponse.json(
      { ok: false, error: 'worker_error', workerStatus: workerRes.status, body: body.slice(0, 500) },
      { status: 502 },
    );
  }

  const jobData = await workerRes.json() as Record<string, unknown>;
  const rawStatus = String(jobData.status ?? '').toLowerCase().trim();

  const repo = new WardrobeItemsRepository();

  // --- Still running ---
  if (RUNNING_STATUSES.has(rawStatus)) {
    return NextResponse.json({ ok: true, status: 'processing', jobId, rawStatus });
  }

  // --- Failed ---
  if (FAILED_STATUSES.has(rawStatus)) {
    const rawError =
      jobData.error && typeof jobData.error === 'object'
        ? (jobData.error as Record<string, unknown>)
        : null;
    const workerCode = rawError ? String(rawError.code ?? '') : '';
    const errorMsg = rawError
      ? String(rawError.message ?? `RunPod job ${rawStatus}`)
      : `RunPod job ${rawStatus}`;

    await repo.updatePipelineStatus(pieceId, 'failed', errorMsg, {
      stage: 'failed',
      failedStage: workerCode.startsWith('meshy_') ? 'meshy_submit' : 'runpod_worker_failure',
      provider: 'runpod',
      errorCode: workerCode.toUpperCase() || 'WORKER_FAILED',
      retryable: true,
      diagnostics: (rawError?.details as Record<string, unknown> | undefined) ?? {},
    });

    return NextResponse.json({ ok: false, status: 'failed', jobId, rawStatus, error: rawError ?? errorMsg });
  }

  // --- Completed ---
  if (rawStatus === 'completed' || rawStatus === 'succeeded' || rawStatus === 'done' || rawStatus === 'success') {
    const piece = await repo.findById(pieceId);
    if (!piece) {
      return NextResponse.json({ ok: false, error: 'piece_not_found' }, { status: 404 });
    }

    const userId = String(piece.user_id ?? piece.userId ?? '');
    if (!userId) {
      return NextResponse.json({ ok: false, error: 'piece_missing_userId' }, { status: 500 });
    }

    // Extract Meshy thumbnail from debug payload
    const debug = jobData.debug && typeof jobData.debug === 'object'
      ? (jobData.debug as Record<string, unknown>)
      : {};
    const debugSteps = debug.steps && typeof debug.steps === 'object'
      ? (debug.steps as Record<string, unknown>)
      : {};
    const meshyStep = debugSteps.meshy && typeof debugSteps.meshy === 'object'
      ? (debugSteps.meshy as Record<string, unknown>)
      : {};
    const previewUrl = String(meshyStep.thumbnail_url ?? '').trim() || null;

    const storageBase = `wardrobe-3d/${userId}/${pieceId}`;

    // final_model.glb — required
    const glbBuf = await downloadArtifact(worker.workerUrl, worker.token, jobId, 'final_model.glb');
    if (!glbBuf) {
      return NextResponse.json(
        { ok: false, error: 'artifact_download_failed', artifact: 'final_model.glb' },
        { status: 502 },
      );
    }
    const finalModelUrl = await uploadToFirebase(`${storageBase}/final_model.glb`, glbBuf, 'model/gltf-binary');

    // base_meshy.glb — optional
    const baseBuf = await downloadArtifact(worker.workerUrl, worker.token, jobId, 'base_meshy.glb');
    const baseModelUrl = baseBuf
      ? await uploadToFirebase(`${storageBase}/base_meshy.glb`, baseBuf, 'model/gltf-binary')
      : null;

    // final_model.usdz — optional
    const usdzBuf = await downloadArtifact(worker.workerUrl, worker.token, jobId, 'final_model.usdz');
    const usdzUrl = usdzBuf
      ? await uploadToFirebase(`${storageBase}/final_model.usdz`, usdzBuf, 'model/vnd.usdz+zip')
      : null;

    await repo.updateCompletedModel(
      pieceId,
      {
        model_3d_url: finalModelUrl,
        model_base_3d_url: baseModelUrl,
        model_usdz_url: usdzUrl,
        model_preview_url: previewUrl,
      },
      jobId,
    );

    console.info('[3d-worker/status] model completed and synced', {
      pieceId,
      jobId,
      finalModelUrl,
      baseModelUrl,
      usdzUrl,
      previewUrl,
    });

    return NextResponse.json({
      ok: true,
      status: 'completed',
      model_3d_url: finalModelUrl,
      model_base_3d_url: baseModelUrl,
      model_usdz_url: usdzUrl,
      model_preview_url: previewUrl,
    });
  }

  // Unknown status — treat as still running
  return NextResponse.json({ ok: true, status: 'processing', rawStatus, jobId });
}
