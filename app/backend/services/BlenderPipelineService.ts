import { PipelineJobsRepository } from '@/app/backend/repositories/PipelineJobsRepository';
import { WardrobeItemsRepository } from '@/app/backend/repositories/WardrobeItemsRepository';
import { ServiceError } from './errors';

interface BlenderApiJobResult {
  stage?: string;
  artifacts?: Record<string, unknown>;
  metrics?: Record<string, unknown>;
}

export class BlenderPipelineService {
  constructor(
    private readonly pipelineJobsRepository = new PipelineJobsRepository(),
    private readonly wardrobeItemsRepository = new WardrobeItemsRepository(),
  ) {}

  async createUvJob(input: Record<string, unknown>) {
    const user_id = String(input.user_id ?? '').trim();
    const wardrobe_item_id = String(input.wardrobe_item_id ?? '').trim();
    const category = String(input.category ?? '').trim() || 'upper_body';
    const garment_prompt = String(input.garment_prompt ?? '').trim();
    const color = String(input.color ?? '').trim() || 'unspecified';
    const brand = String(input.brand ?? '').trim() || 'unspecified';
    const base_model_id = String(input.base_model_id ?? '').trim() || 'upper_body_v1';
    const generation_mode = String(input.generation_mode ?? 'fast_uv').trim() === 'hq_uv' ? 'hq_uv' : 'fast_uv';

    if (!user_id || !wardrobe_item_id || !garment_prompt) {
      throw new ServiceError('Missing required fields for UV generation job.', 400);
    }

    const exists = await this.wardrobeItemsRepository.existsById(wardrobe_item_id);
    if (!exists) {
      throw new ServiceError('Wardrobe item not found for UV generation.', 404);
    }

    const created = await this.pipelineJobsRepository.create({
      user_id,
      wardrobe_item_id,
      status: 'pending',
      stage: 'queued',
      input_payload: {
        user_id,
        wardrobe_item_id,
        category,
        garment_prompt,
        color,
        brand,
        base_model_id,
        generation_mode,
      },
      artifacts: null,
      metrics: null,
      error_message: null,
      started_at: null,
      finished_at: null,
    });

    void this.runJob(created.pipeline_job_id);

    return {
      jobId: created.pipeline_job_id,
      status: 'pending',
      stage: 'queued',
    };
  }

  async getJob(pipelineJobId: string) {
    const job = await this.pipelineJobsRepository.findById(pipelineJobId);
    if (!job) {
      throw new ServiceError('Pipeline job not found.', 404);
    }

    return {
      jobId: job.pipeline_job_id,
      status: job.status,
      stage: job.stage,
      artifacts: job.artifacts,
      metrics: job.metrics,
      error: job.error_message,
      startedAt: job.started_at,
      finishedAt: job.finished_at,
      updatedAt: job.updated_at,
    };
  }

  private async runJob(pipelineJobId: string): Promise<void> {
    const job = await this.pipelineJobsRepository.findById(pipelineJobId);
    if (!job) return;

    await this.pipelineJobsRepository.update(pipelineJobId, {
      status: 'running',
      stage: 'dispatching_to_blender',
      started_at: new Date().toISOString(),
    });

    try {
      const blenderResult = await this.requestLocalBlender(job.input_payload);

      await this.pipelineJobsRepository.update(pipelineJobId, {
        status: 'completed',
        stage: blenderResult.stage ?? 'completed',
        artifacts: blenderResult.artifacts ?? null,
        metrics: blenderResult.metrics ?? null,
        error_message: null,
        finished_at: new Date().toISOString(),
      });

      await this.wardrobeItemsRepository.updatePipelineStatus(
        job.wardrobe_item_id,
        'done',
        null,
        {
          stage: 'uv_pipeline_completed',
          pipeline_job_id: pipelineJobId,
          uv_job_artifacts: blenderResult.artifacts ?? null,
          uv_job_metrics: blenderResult.metrics ?? null,
        },
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown Blender pipeline error.';
      await this.pipelineJobsRepository.update(pipelineJobId, {
        status: 'failed',
        stage: 'failed',
        error_message: message,
        finished_at: new Date().toISOString(),
      });

      await this.wardrobeItemsRepository.updatePipelineStatus(job.wardrobe_item_id, 'failed', message, {
        stage: 'uv_pipeline_failed',
        pipeline_job_id: pipelineJobId,
      });
    }
  }

  private async requestLocalBlender(payload: Record<string, unknown>): Promise<BlenderApiJobResult> {
    const endpoint = process.env.BLENDER_PIPELINE_API_URL;
    if (!endpoint) {
      throw new Error('BLENDER_PIPELINE_API_URL is not configured.');
    }

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(process.env.BLENDER_PIPELINE_API_TOKEN
          ? { Authorization: `Bearer ${process.env.BLENDER_PIPELINE_API_TOKEN}` }
          : {}),
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Local Blender API request failed (${response.status}): ${text}`);
    }

    return (await response.json()) as BlenderApiJobResult;
  }
}
