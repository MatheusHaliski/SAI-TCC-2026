interface RunpodSubmitResponse {
  id?: string;
  jobId?: string;
  status?: string;
  error?: string;
}

interface RunpodStatusResponse {
  id?: string;
  jobId?: string;
  status?: string;
  artifacts?: Record<string, unknown>;
  metrics?: Record<string, unknown>;
  logs?: Record<string, unknown>;
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

interface BlenderCloudConfig {
  endpointUrl: string;
  statusPathTemplate: string;
  authToken: string;
  authSource: 'BLENDER_CLOUD_API_TOKEN' | 'RUNPOD_API_KEY' | 'none';
  submitTimeoutMs: number;
  statusTimeoutMs: number;
}

function normalizeApiBaseUrl(rawUrl: string): string {
  return rawUrl.trim().replace(/\/+$/, '');
}

function normalizeApiPath(rawPath: string): string {
  const trimmed = rawPath.trim();
  if (!trimmed) return '/';
  return trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
}

function buildUrl(baseUrl: string, path: string): string {
  const normalizedBase = normalizeApiBaseUrl(baseUrl);
  const normalizedPath = normalizeApiPath(path);
  return `${normalizedBase}${normalizedPath}`;
}

function resolveEndpointUrl(): string {
  const endpointUrl = process.env.RUNPOD_ENDPOINT_URL?.trim();
  if (endpointUrl) {
    return normalizeApiBaseUrl(endpointUrl);
  }

  throw new Error('Missing RUNPOD_ENDPOINT_URL for load balancer endpoint');
}

function resolveAuth(): Pick<BlenderCloudConfig, 'authToken' | 'authSource'> {
  const explicitToken = process.env.BLENDER_CLOUD_API_TOKEN?.trim();
  if (explicitToken) {
    return {
      authToken: explicitToken,
      authSource: 'BLENDER_CLOUD_API_TOKEN',
    };
  }

  const runpodApiKey = process.env.RUNPOD_API_KEY?.trim();
  if (runpodApiKey) {
    return {
      authToken: runpodApiKey,
      authSource: 'RUNPOD_API_KEY',
    };
  }

  return {
    authToken: '',
    authSource: 'none',
  };
}

function hasRunpodConfiguration(): boolean {
  return Boolean(process.env.RUNPOD_ENDPOINT_URL?.trim());
}

function validateBlenderCloudConfiguration(config: BlenderCloudConfig): void {
  try {
    new URL(config.endpointUrl);
  } catch {
    throw new Error(`Invalid RUNPOD_ENDPOINT_URL value: "${config.endpointUrl}"`);
  }

  if (!config.statusPathTemplate.startsWith('/')) {
    throw new Error(
      `BLENDER_CLOUD_STATUS_PATH_TEMPLATE must start with "/". Received "${config.statusPathTemplate}".`,
    );
  }

  if (!config.statusPathTemplate.includes(':jobId')) {
    throw new Error(
      'BLENDER_CLOUD_STATUS_PATH_TEMPLATE must include ":jobId" so the backend can request a specific job status.',
    );
  }
}

function resolveBlenderCloudConfiguration(): BlenderCloudConfig {
  const auth = resolveAuth();
  const config: BlenderCloudConfig = {
    endpointUrl: resolveEndpointUrl(),
    statusPathTemplate: normalizeApiPath(process.env.BLENDER_CLOUD_STATUS_PATH_TEMPLATE?.trim() || '/jobs/:jobId'),
    authToken: auth.authToken,
    authSource: auth.authSource,
    submitTimeoutMs: Number(process.env.BLENDER_CLOUD_SUBMIT_TIMEOUT_MS ?? 15000),
    statusTimeoutMs: Number(process.env.BLENDER_CLOUD_STATUS_TIMEOUT_MS ?? 10000),
  };

  validateBlenderCloudConfiguration(config);

  return config;
}

function toInternalStatus(status: string): BlenderCloudJobStatus['status'] {
  const normalized = status.toUpperCase();
  if (['COMPLETED', 'SUCCEEDED', 'DONE'].includes(normalized)) return 'completed';
  if (['FAILED', 'ERROR', 'CANCELLED', 'TIMED_OUT'].includes(normalized)) return 'failed';
  if (['IN_PROGRESS', 'PROCESSING', 'RUNNING', 'STARTED'].includes(normalized)) return 'in_progress';
  if (['QUEUED', 'PENDING', 'ACCEPTED'].includes(normalized)) return 'queued';
  return 'queued';
}

export class BlenderCloudService {
  private async fetchWithTimeout(url: string, init: RequestInit, timeoutMs: number): Promise<Response> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    try {
      return await fetch(url, {
        ...init,
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timeout);
    }
  }

  isConfigured(): boolean {
    return hasRunpodConfiguration();
  }

  async submitBlenderCloudJob(input: SubmitBlenderCloudJobInput): Promise<{ cloudJobId: string; raw: Record<string, unknown> }> {
    const config = resolveBlenderCloudConfiguration();
    const payload = {
      modelUrl: input.modelUrl,
      ...(input.imageUrl ? { imageUrl: input.imageUrl } : {}),
      jobType: input.jobType,
      options: input.options ?? {},
    };
    const endpointUrl = config.endpointUrl;

    console.info('[blender-cloud] submit request', {
      endpointUrl,
      authSource: config.authSource,
      payload,
    });
    console.log('RUNPOD FINAL URL =', endpointUrl);

    let response: Response;
    try {
      response = await this.fetchWithTimeout(endpointUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(config.authToken ? { Authorization: `Bearer ${config.authToken}` } : {}),
        },
        body: JSON.stringify({ input: payload }),
      }, config.submitTimeoutMs);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(`RunPod submit request failed or timed out after ${config.submitTimeoutMs}ms. url=${endpointUrl} error=${message}`);
    }

    const body = (await response.json().catch(() => ({}))) as RunpodSubmitResponse & Record<string, unknown>;
    const cloudJobId = typeof body.jobId === 'string'
      ? body.jobId
      : typeof body.id === 'string'
        ? body.id
        : '';

    console.info('[blender-cloud] submit response', {
      endpointUrl,
      status: response.status,
      body,
    });

    if (response.ok && cloudJobId) {
      return { cloudJobId, raw: body };
    }

    if (response.ok) {
      return { cloudJobId: 'inline-response', raw: body };
    }

    throw new Error(`RunPod submit failed. url=${endpointUrl} status=${response.status} body=${JSON.stringify(body)}`);
  }

  async getBlenderCloudJobStatus(cloudJobId: string): Promise<BlenderCloudJobStatus> {
    if (cloudJobId === 'inline-response') {
      return {
        cloudJobId,
        status: 'completed',
        artifacts: null,
        metrics: null,
        logs: null,
        raw: { status: 'COMPLETED' },
      };
    }

    const config = resolveBlenderCloudConfiguration();
    const statusPath = config.statusPathTemplate.replace(':jobId', encodeURIComponent(cloudJobId));
    const statusUrl = buildUrl(config.endpointUrl, statusPath);

    console.info('[blender-cloud] status request', {
      endpointUrl: config.endpointUrl,
      statusUrl,
      authSource: config.authSource,
      cloudJobId,
    });

    let response: Response;
    try {
      response = await this.fetchWithTimeout(statusUrl, {
        method: 'GET',
        headers: config.authToken ? { Authorization: `Bearer ${config.authToken}` } : {},
      }, config.statusTimeoutMs);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(`RunPod status request failed or timed out after ${config.statusTimeoutMs}ms. url=${statusUrl} error=${message}`);
    }

    const body = (await response.json().catch(() => ({}))) as RunpodStatusResponse & Record<string, unknown>;
    if (!response.ok) {
      throw new Error(`RunPod status failed. url=${statusUrl} status=${response.status} body=${JSON.stringify(body)}`);
    }

    const output = (body.output ?? {}) as Record<string, unknown>;
    const topLevelArtifacts = body.artifacts as Record<string, unknown> | undefined;
    const topLevelMetrics = body.metrics as Record<string, unknown> | undefined;
    const topLevelLogs = body.logs as Record<string, unknown> | undefined;
    const outputArtifacts = output.artifacts as Record<string, unknown> | undefined;
    const outputMetrics = output.metrics as Record<string, unknown> | undefined;
    const outputLogs = output.logs as Record<string, unknown> | undefined;
    const artifacts = topLevelArtifacts ?? outputArtifacts ?? null;
    const metrics = topLevelMetrics ?? outputMetrics ?? null;
    const logs = topLevelLogs ?? outputLogs ?? null;
    const status = typeof body.status === 'string'
      ? body.status
      : typeof output.status === 'string'
        ? output.status
        : 'QUEUED';

    return {
      cloudJobId,
      status: toInternalStatus(status),
      artifacts,
      metrics,
      logs,
      raw: body,
    };
  }
}
