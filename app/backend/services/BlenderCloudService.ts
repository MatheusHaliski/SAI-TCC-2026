interface RunpodSubmitResponse {
  id?: string;
  status?: string;
  error?: string;
}

interface RunpodStatusResponse {
  id?: string;
  status?: string;
  output?: Record<string, unknown>;
  error?: string | Record<string, unknown>;
}

export interface SubmitBlenderCloudJobInput {
  modelUrl: string;
  imageUrl?: string;
  jobType: string;
  options?: Record<string, unknown>;
}

export interface BlenderCloudJobStatus {
  cloudJobId: string;
  status: 'queued' | 'in_progress' | 'completed' | 'failed';
  artifacts: Record<string, unknown> | null;
  metrics: Record<string, unknown> | null;
  logs: Record<string, unknown> | null;
  raw: Record<string, unknown>;
}

function resolveRunpodBaseUrl(): string {
  const explicit = process.env.BLENDER_CLOUD_API_URL?.trim();
  if (explicit) return normalizeRunpodApiUrl(explicit);

  const endpointId = process.env.RUNPOD_ENDPOINT_ID?.trim();
  if (endpointId) {
    return `https://api.runpod.ai/v2/${endpointId}`;
  }

  const endpointUrl = process.env.RUNPOD_ENDPOINT_URL?.trim();
  if (endpointUrl) {
    return normalizeRunpodApiUrl(endpointUrl);
  }

  throw new Error(
    'RunPod is not configured. Set BLENDER_CLOUD_API_URL or RUNPOD_ENDPOINT_ID.',
  );
}

function normalizeRunpodApiUrl(rawUrl: string): string {
  const trimmed = rawUrl.trim().replace(/\/+$/, '');

  try {
    const parsed = new URL(trimmed);
    const host = parsed.hostname.toLowerCase();
    const path = parsed.pathname.replace(/\/+$/, '');
    const segments = path.split('/').filter(Boolean);
    const isLoadBalancerHost = host.endsWith('.proxy.runpod.net');
    const usesLoadBalancerPath = segments[0] === 'v2' && segments[1] === 'lb';
    const looksLikeServerlessApiBase = host === 'api.runpod.ai' && segments[0] === 'v2' && segments.length === 2;

    if (isLoadBalancerHost || usesLoadBalancerPath || !looksLikeServerlessApiBase) {
      throw new Error(
        'RunPod API URL must be a serverless endpoint base URL like https://api.runpod.ai/v2/<endpoint-id>. Load-balancer URLs (including /v2/lb/<id> and *.proxy.runpod.net) are not supported.',
      );
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }

    throw new Error(
      'RunPod API URL must be a serverless endpoint base URL like https://api.runpod.ai/v2/<endpoint-id>.',
    );
  }

  return trimmed;
}

function resolveToken(): string {
  return process.env.BLENDER_CLOUD_API_TOKEN?.trim() || process.env.RUNPOD_API_KEY?.trim() || '';
}

function hasRunpodConfiguration(): boolean {
  return Boolean(process.env.BLENDER_CLOUD_API_URL?.trim() || process.env.RUNPOD_ENDPOINT_ID?.trim());
}

function toInternalStatus(status: string): BlenderCloudJobStatus['status'] {
  const normalized = status.toUpperCase();
  if (["COMPLETED"].includes(normalized)) return 'completed';
  if (["FAILED", "CANCELLED", "TIMED_OUT"].includes(normalized)) return 'failed';
  if (["IN_PROGRESS", "PROCESSING", "RUNNING"].includes(normalized)) return 'in_progress';
  return 'queued';
}

export class BlenderCloudService {
  isConfigured(): boolean {
    return hasRunpodConfiguration();
  }

  async submitBlenderCloudJob(input: SubmitBlenderCloudJobInput): Promise<{ cloudJobId: string; raw: Record<string, unknown> }> {
    const baseUrl = resolveRunpodBaseUrl();
    const token = resolveToken();

    const payload = {
      input: {
        modelUrl: input.modelUrl,
        ...(input.imageUrl ? { imageUrl: input.imageUrl } : {}),
        jobType: input.jobType,
        options: input.options ?? {},
      },
    };

    const response = await fetch(`${baseUrl}/run`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(payload),
    });

    const body = (await response.json().catch(() => ({}))) as RunpodSubmitResponse & Record<string, unknown>;
    if (!response.ok || !body.id) {
      throw new Error(`RunPod submit failed (${response.status}): ${JSON.stringify(body)}`);
    }

    return { cloudJobId: body.id, raw: body };
  }

  async getBlenderCloudJobStatus(cloudJobId: string): Promise<BlenderCloudJobStatus> {
    const baseUrl = resolveRunpodBaseUrl();
    const token = resolveToken();
    const response = await fetch(`${baseUrl}/status/${cloudJobId}`, {
      method: 'GET',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });

    const body = (await response.json().catch(() => ({}))) as RunpodStatusResponse & Record<string, unknown>;

    if (!response.ok) {
      throw new Error(`RunPod status failed (${response.status}): ${JSON.stringify(body)}`);
    }

    const output = (body.output ?? {}) as Record<string, unknown>;
    const artifacts = (output.artifacts as Record<string, unknown> | undefined) ?? null;
    const metrics = (output.metrics as Record<string, unknown> | undefined) ?? null;
    const logs = (output.logs as Record<string, unknown> | undefined) ?? null;

    return {
      cloudJobId,
      status: toInternalStatus(String(body.status ?? 'QUEUED')),
      artifacts,
      metrics,
      logs,
      raw: body,
    };
  }
}
