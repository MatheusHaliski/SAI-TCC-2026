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
  baseUrl: string;
  submitPath: string;
  statusPathTemplate: string;
  legacyQueueMode: boolean;
  legacyQueueModeExplicit: boolean;
  authToken: string;
  authSource: 'BLENDER_CLOUD_API_TOKEN' | 'RUNPOD_API_KEY' | 'none';
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

function resolveApiBaseUrl(): string {
  const explicit = process.env.BLENDER_CLOUD_API_URL?.trim();
  if (explicit) return normalizeApiBaseUrl(explicit);

  const endpointUrl = process.env.RUNPOD_ENDPOINT_URL?.trim();
  if (endpointUrl) {
    return normalizeApiBaseUrl(endpointUrl);
  }

  const endpointId = process.env.RUNPOD_ENDPOINT_ID?.trim();
  if (endpointId) {
    return `https://api.runpod.ai/v2/${endpointId}`;
  }

  throw new Error(
    'RunPod is not configured. Set BLENDER_CLOUD_API_URL, RUNPOD_ENDPOINT_URL, or RUNPOD_ENDPOINT_ID.',
  );
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
  return Boolean(
    process.env.BLENDER_CLOUD_API_URL?.trim()
    || process.env.RUNPOD_ENDPOINT_URL?.trim()
    || process.env.RUNPOD_ENDPOINT_ID?.trim(),
  );
}

function resolveLegacyQueueModeExplicit(): boolean | null {
  const explicit = process.env.BLENDER_CLOUD_LEGACY_QUEUE_MODE?.trim().toLowerCase();
  if (explicit === 'true') return true;
  if (explicit === 'false') return false;
  return null;
}

function isLegacyQueueModeEnabled(): boolean {
  const explicit = resolveLegacyQueueModeExplicit();
  if (explicit !== null) return explicit;

  // Auto-detect mode when env is omitted:
  // - RunPod public API (`https://api.runpod.ai/v2/<endpoint-id>`) requires `/run` + `/status/:id`.
  // - Custom Load Balancer URLs usually expose worker routes directly (e.g. `/jobs`).
  const baseUrl = resolveApiBaseUrl().toLowerCase();
  return baseUrl.includes('api.runpod.ai/v2/');
}

function validateBlenderCloudConfiguration(config: BlenderCloudConfig): void {
  try {
    new URL(config.baseUrl);
  } catch {
    throw new Error(`Invalid BLENDER_CLOUD_API_URL / RUNPOD_ENDPOINT_URL value: "${config.baseUrl}"`);
  }

  if (config.legacyQueueMode) {
    return;
  }

  if (!config.submitPath.startsWith('/')) {
    throw new Error(`BLENDER_CLOUD_SUBMIT_PATH must start with "/". Received "${config.submitPath}".`);
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
    baseUrl: resolveApiBaseUrl(),
    submitPath: normalizeApiPath(process.env.BLENDER_CLOUD_SUBMIT_PATH?.trim() || '/jobs'),
    statusPathTemplate: normalizeApiPath(process.env.BLENDER_CLOUD_STATUS_PATH_TEMPLATE?.trim() || '/jobs/:jobId'),
    legacyQueueMode: isLegacyQueueModeEnabled(),
    legacyQueueModeExplicit: resolveLegacyQueueModeExplicit() !== null,
    authToken: auth.authToken,
    authSource: auth.authSource,
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
    const modeAttempts = config.legacyQueueModeExplicit
      ? [config.legacyQueueMode]
      : [config.legacyQueueMode, !config.legacyQueueMode];

    let lastError = '';
    for (let index = 0; index < modeAttempts.length; index += 1) {
      const legacyQueueMode = modeAttempts[index];
      const submitUrl = legacyQueueMode
        ? buildUrl(config.baseUrl, '/run')
        : buildUrl(config.baseUrl, config.submitPath);

      console.info('[blender-cloud] submit request', {
        mode: legacyQueueMode ? 'legacy_queue' : 'lb_custom_routes',
        baseUrl: config.baseUrl,
        submitUrl,
        authSource: config.authSource,
        attempt: index + 1,
      });

      const requestPayload = legacyQueueMode ? { input: payload } : payload;
      const response = await fetch(submitUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(config.authToken ? { Authorization: `Bearer ${config.authToken}` } : {}),
        },
        body: JSON.stringify(requestPayload),
      });

      const body = (await response.json().catch(() => ({}))) as RunpodSubmitResponse & Record<string, unknown>;
      const cloudJobId = typeof body.jobId === 'string'
        ? body.jobId
        : typeof body.id === 'string'
          ? body.id
          : '';

      if (response.ok && cloudJobId) {
        return { cloudJobId, raw: body };
      }

      lastError = `RunPod submit failed. url=${submitUrl} status=${response.status} body=${JSON.stringify(body)}`;
      if (index < modeAttempts.length - 1) {
        console.warn('[blender-cloud] submit failed, retrying with alternate mode', { error: lastError });
      }
    }

    throw new Error(lastError);
  }

  async getBlenderCloudJobStatus(cloudJobId: string): Promise<BlenderCloudJobStatus> {
    const config = resolveBlenderCloudConfiguration();
    const modeAttempts = config.legacyQueueModeExplicit
      ? [config.legacyQueueMode]
      : [config.legacyQueueMode, !config.legacyQueueMode];

    let lastError = '';
    for (let index = 0; index < modeAttempts.length; index += 1) {
      const legacyQueueMode = modeAttempts[index];
      const statusPath = legacyQueueMode
        ? `/status/${cloudJobId}`
        : config.statusPathTemplate.replace(':jobId', encodeURIComponent(cloudJobId));
      const statusUrl = buildUrl(config.baseUrl, statusPath);

      console.info('[blender-cloud] status request', {
        mode: legacyQueueMode ? 'legacy_queue' : 'lb_custom_routes',
        baseUrl: config.baseUrl,
        statusUrl,
        authSource: config.authSource,
        cloudJobId,
        attempt: index + 1,
      });

      const response = await fetch(statusUrl, {
        method: 'GET',
        headers: config.authToken ? { Authorization: `Bearer ${config.authToken}` } : {},
      });

      const body = (await response.json().catch(() => ({}))) as RunpodStatusResponse & Record<string, unknown>;
      if (!response.ok) {
        lastError = `RunPod status failed. url=${statusUrl} status=${response.status} body=${JSON.stringify(body)}`;
        if (index < modeAttempts.length - 1) {
          console.warn('[blender-cloud] status failed, retrying with alternate mode', { error: lastError });
        }
        continue;
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

    throw new Error(lastError);
  }
}
