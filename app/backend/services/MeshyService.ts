import { ServiceError } from './errors';

interface MeshyGenerationResult {
  model_3d_url: string;
  model_preview_url: string | null;
}

interface MeshyTaskResponse {
  status?: string;
  model_urls?: {
    glb?: string;
    [key: string]: string | undefined;
  };
  thumbnail_url?: string;
  preview_url?: string;
  [key: string]: unknown;
}

const MESHY_BASE_URL ='https://api.meshy.ai/openapi/v1/image-to-3d';
const MESHY_MAX_POLL_ATTEMPTS = Number(process.env.MESHY_MAX_POLL_ATTEMPTS ?? 10);
const MESHY_POLL_DELAY_MS = Number(process.env.MESHY_POLL_DELAY_MS ?? 2500);

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export class MeshyService {
  private readonly apiKey = process.env.MESHY_API_KEY;

  async generate3DModelFromImage(imageUrl: string): Promise<MeshyGenerationResult> {
    if (!this.apiKey) {
      throw new ServiceError('MESHY_API_KEY is not configured.', 500);
    }

    const taskId = await this.createTask(imageUrl);
    const taskResult = await this.waitUntilFinished(taskId);

    const model3dUrl = taskResult.model_urls?.glb;
    if (!model3dUrl) {
      throw new ServiceError('Meshy did not return a GLB model URL.', 502);
    }

    return {
      model_3d_url: model3dUrl,
      model_preview_url: taskResult.thumbnail_url ?? taskResult.preview_url ?? null,
    };
  }

  private async createTask(imageUrl: string): Promise<string> {
    const response = await fetch(`https://api.meshy.ai/openapi/v1/image-to-3d`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image_url: imageUrl,
        should_texture: true,
      }),
    });

    if (!response.ok) {
      const details = await response.text();
      throw new ServiceError(`Failed to create Meshy task: ${details}`, 502);
    }

    const data = (await response.json()) as Record<string, unknown>;
    const taskId = String(data.result ?? data.id ?? '').trim();
    if (!taskId) {
      throw new ServiceError('Meshy did not return a task id.', 502);
    }
    return taskId;
  }

  private async waitUntilFinished(taskId: string): Promise<MeshyTaskResponse> {
    for (let attempt = 1; attempt <= MESHY_MAX_POLL_ATTEMPTS; attempt += 1) {
      const response = await fetch(`https://api.meshy.ai/openapi/v1/image-to-3d/${taskId}`, {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
        },
      });

      if (!response.ok) {
        const details = await response.text();
        throw new ServiceError(`Failed to poll Meshy task ${taskId}: ${details}`, 502);
      }

      const data = (await response.json()) as MeshyTaskResponse;
      const status = String(data.status ?? '').toLowerCase();
      if (status === 'succeeded' || status === 'success' || data.model_urls?.glb) {
        return data;
      }
      if (status === 'failed' || status === 'error') {
        throw new ServiceError(`Meshy task ${taskId} failed.`, 502);
      }

      await sleep(MESHY_POLL_DELAY_MS);
    }

    throw new ServiceError('Meshy task timed out before completion.', 504);
  }
}
