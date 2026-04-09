import {
  buildHealthUrl,
  buildStatusUrl,
  buildSubmitUrl,
  isBlenderCloudConfigured,
  resolveBlenderCloudConfig,
  type BlenderCloudConfig,
} from './blenderCloudConfig';

interface PodSubmitResponse {
  id?: string;
  job_id?: string;
  jobId?: string;
  status?: string;
  output?: Record<string, unknown>;
  artifacts?: Record<string, unknown>;
  error?: unknown;
}

interface PodStatusResponse {
  id?: string;
  job_id?: string;
  jobId?: string;
  status?: string;
  artifacts?: Record<string, unknown>;
  metrics?: Record<string, unknown>;
  logs?: Record<string, unknown>;
  output?: Record<string, unknown>;
  error?: unknown;
}

export interface SubmitBlenderCloudJobInput {
  modelUrl: string;
  imageUrl?: string;
  jobType: string;
  options?: Record<string, unknown>;
}

export interface BlenderCloudJobStatus {
  cloudJobId: string;
  status: 'queued' | 'submitted' | 'in_progress' | 'completed' | 'failed' | 'cancelled';
  artifacts: Record<string, unknown> | null;
  metrics: Record<string, unknown> | null;
  logs: Record<string, unknown> | null;
  raw: Record<string, unknown>;
  errorMessage: string | null;
}

interface BlenderCloudSubmitResult {
  cloudJobId: string;
  status: BlenderCloudJobStatus['status'];
  artifacts: Record<string, unknown> | null;
  raw: Record<string, unknown>;
}

function toRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' ? (value as Record<string, unknown>) : {};
}

function getJobId(source: Record<string, unknown>): string {
  const candidate = source.job_id ?? source.jobId ?? source.id;
  return typeof candidate === 'string' ? candidate.trim() : '';
}

function normalizeStatus(statusLike: unknown): BlenderCloudJobStatus['status'] {
  const normalized = String(statusLike ?? '').trim().toLowerCase().replace(/\s+/g, '_');
  if (['completed', 'succeeded', 'done', 'success'].includes(normalized)) return 'completed';
  if (['failed', 'error', 'timed_out', 'timeout'].includes(normalized)) return 'failed';
  if (['cancelled', 'canceled', 'terminated'].includes(normalized)) return 'cancelled';
  if (['running', 'in_progress', 'processing', 'started'].includes(normalized)) return 'in_progress';
  if (['submitted', 'accepted'].includes(normalized)) return 'submitted';
  return 'queued';
}

function extractArtifacts(payload: Record<string, unknown>): Record<string, unknown> | null {
  const output = toRecord(payload.output);
  const outputArtifacts = toRecord(output.artifacts);
  const topLevelArtifacts = toRecord(payload.artifacts);

  if (Object.keys(topLevelArtifacts).length > 0) return topLevelArtifacts;
  if (Object.keys(outputArtifacts).length > 0) return outputArtifacts;

  const directUrlKeys = [
    'model_3d_url',
    'modelUrl',
    'outputModelUrl',
    'outputUrl',
    'glbUrl',
    'artifact_url',
    'artifactUrl',
    'url',
  ];

  const fromOutput = directUrlKeys.reduce<Record<string, unknown>>((acc, key) => {
    const candidate = output[key];
    if (typeof candidate === 'string' && candidate.trim().length > 0) {
      acc[key] = candidate.trim();
    }
    return acc;
  }, {});

  const fromTop = directUrlKeys.reduce<Record<string, unknown>>((acc, key) => {
    const candidate = payload[key];
    if (typeof candidate === 'string' && candidate.trim().length > 0) {
      acc[key] = candidate.trim();
    }
    return acc;
  }, {});

  const combined = { ...fromTop, ...fromOutput };
  return Object.keys(combined).length > 0 ? combined : null;
}

function extractErrorMessage(payload: Record<string, unknown>): string | null {
  const candidate = payload.error ?? toRecord(payload.output).error;
  if (typeof candidate === 'string' && candidate.trim()) return candidate.trim();
  if (candidate && typeof candidate === 'object') return JSON.stringify(candidate);
  return null;
}

function clipForLog(value: unknown, max = 500): string {
  const raw = typeof value === 'string' ? value : JSON.stringify(value ?? {});
  return raw.length > max ? `${raw.slice(0, max)}…` : raw;
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

  private buildHeaders(config: BlenderCloudConfig): Record<string, string> {
    return {
      'Content-Type': 'application/json',
      ...(config.authToken ? { Authorization: `Bearer ${config.authToken}` } : {}),
    };
  }

  private mapSubmitPayload(config: BlenderCloudConfig, input: SubmitBlenderCloudJobInput): Record<string, unknown> {
    const internalPayload = {
      modelUrl: input.modelUrl,
      ...(input.imageUrl ? { imageUrl: input.imageUrl } : {}),
      jobType: input.jobType,
      options: input.options ?? {},
    };

    return config.payloadMode === 'input' ? { input: internalPayload } : internalPayload;
  }

  isConfigured(): boolean {
    return isBlenderCloudConfigured();
  }

  async getDiagnostics() {
    const config = resolveBlenderCloudConfig();
    const submitUrl = buildSubmitUrl(config);
    const healthUrl = buildHealthUrl(config);

    let health: { ok: boolean; status: number | null; bodyExcerpt: string | null; error: string | null } = {
      ok: false,
      status: null,
      bodyExcerpt: null,
      error: null,
    };

    try {
      const response = await this.fetchWithTimeout(healthUrl, {
        method: 'GET',
        headers: config.authToken ? { Authorization: `Bearer ${config.authToken}` } : {},
      }, config.healthTimeoutMs);

      const text = await response.text().catch(() => '');
      health = {
        ok: response.ok,
        status: response.status,
        bodyExcerpt: clipForLog(text || null),
        error: null,
      };
    } catch (error) {
      health = {
        ok: false,
        status: null,
        bodyExcerpt: null,
        error: error instanceof Error ? error.message : String(error),
      };
    }

    return {
      apiUrl: config.apiUrl,
      submitUrl,
      statusPathTemplate: config.statusPathTemplate,
      healthUrl,
      payloadMode: config.payloadMode,
      authSource: config.authSource,
      health,
    };
  }

  async submitBlenderCloudJob(input: SubmitBlenderCloudJobInput): Promise<BlenderCloudSubmitResult> {
    const config = resolveBlenderCloudConfig();
    const submitUrl = buildSubmitUrl(config);
    const requestBody = this.mapSubmitPayload(config, input);

    console.info('[blender-cloud] submit request', {
      submitUrl,
      payloadMode: config.payloadMode,
      authSource: config.authSource,
      jobType: input.jobType,
    });

    let response: Response;
    try {
      response = await this.fetchWithTimeout(submitUrl, {
        method: 'POST',
        headers: this.buildHeaders(config),
        body: JSON.stringify(requestBody),
      }, config.submitTimeoutMs);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(`Blender Cloud submit request failed. url=${submitUrl} timeoutMs=${config.submitTimeoutMs} error=${message}`);
    }

    const body = toRecord((await response.json().catch(() => ({}))) as PodSubmitResponse);

    console.info('[blender-cloud] submit response', {
      submitUrl,
      responseStatus: response.status,
      bodyExcerpt: clipForLog(body),
    });

    if (!response.ok) {
      throw new Error(`Blender Cloud submit failed. url=${submitUrl} status=${response.status} body=${clipForLog(body)}`);
    }

    const cloudJobId = getJobId(body);
    const normalizedStatus = normalizeStatus(body.status);
    const artifacts = extractArtifacts(body);

    if (cloudJobId) {
      return {
        cloudJobId,
        status: normalizedStatus,
        artifacts,
        raw: body,
      };
    }

    if (artifacts) {
      return {
        cloudJobId: 'inline-response',
        status: 'completed',
        artifacts,
        raw: body,
      };
    }

    throw new Error(`Blender Cloud submit returned no job id and no artifacts. url=${submitUrl} body=${clipForLog(body)}`);
  }

  async getBlenderCloudJobStatus(cloudJobId: string, inlineRaw?: Record<string, unknown>): Promise<BlenderCloudJobStatus> {
    if (cloudJobId === 'inline-response') {
      const artifacts = inlineRaw ? extractArtifacts(inlineRaw) : null;
      return {
        cloudJobId,
        status: 'completed',
        artifacts,
        metrics: null,
        logs: null,
        raw: inlineRaw ?? { status: 'completed' },
        errorMessage: null,
      };
    }

    const config = resolveBlenderCloudConfig();
    const statusUrl = buildStatusUrl(config, cloudJobId);

    console.info('[blender-cloud] status request', {
      cloudJobId,
      statusUrl,
      authSource: config.authSource,
    });

    let response: Response;
    try {
      response = await this.fetchWithTimeout(statusUrl, {
        method: 'GET',
        headers: config.authToken ? { Authorization: `Bearer ${config.authToken}` } : {},
      }, config.statusTimeoutMs);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(`Blender Cloud status request failed. url=${statusUrl} timeoutMs=${config.statusTimeoutMs} error=${message}`);
    }

    const body = toRecord((await response.json().catch(() => ({}))) as PodStatusResponse);

    console.info('[blender-cloud] status response', {
      cloudJobId,
      statusUrl,
      responseStatus: response.status,
      bodyExcerpt: clipForLog(body),
    });

    if (!response.ok) {
      throw new Error(`Blender Cloud status failed. url=${statusUrl} status=${response.status} body=${clipForLog(body)}`);
    }

    const output = toRecord(body.output);

    return {
      cloudJobId,
      status: normalizeStatus(body.status ?? output.status),
      artifacts: extractArtifacts(body),
      metrics: Object.keys(toRecord(body.metrics)).length ? toRecord(body.metrics) : Object.keys(toRecord(output.metrics)).length ? toRecord(output.metrics) : null,
      logs: Object.keys(toRecord(body.logs)).length ? toRecord(body.logs) : Object.keys(toRecord(output.logs)).length ? toRecord(output.logs) : null,
      raw: body,
      errorMessage: extractErrorMessage(body),
    };
  }
}
