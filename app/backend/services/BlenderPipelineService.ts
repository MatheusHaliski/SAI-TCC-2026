import { PipelineJobsRepository } from '@/app/backend/repositories/PipelineJobsRepository';
import { WardrobeItemsRepository } from '@/app/backend/repositories/WardrobeItemsRepository';
import { BlenderCloudService } from './BlenderCloudService';
import { ServiceError } from './errors';

export class BlenderPipelineService {
  constructor(
    private readonly pipelineJobsRepository = new PipelineJobsRepository(),
    private readonly wardrobeItemsRepository = new WardrobeItemsRepository(),
    private readonly blenderCloudService = new BlenderCloudService(),
  ) {}

  async createUvJob(input: Record<string, unknown>) {
    const user_id = String(input.user_id ?? '').trim();
    const wardrobe_item_id = String(input.wardrobe_item_id ?? '').trim();
    const modelUrl = String(input.modelUrl ?? '').trim();
    const generation_mode = String(input.generation_mode ?? 'fast_uv').trim() === 'hq_uv' ? 'hq_uv' : 'fast_uv';

    if (!user_id || !wardrobe_item_id || !modelUrl) {
      throw new ServiceError('Missing required fields for UV generation job (user_id, wardrobe_item_id, modelUrl).', 400);
    }

    const exists = await this.wardrobeItemsRepository.existsById(wardrobe_item_id);
    if (!exists) {
      throw new ServiceError('Wardrobe item not found for UV generation.', 404);
    }

    const created = await this.pipelineJobsRepository.create({
      user_id,
      wardrobe_item_id,
      provider: 'runpod',
      cloud_job_id: null,
      status: 'pending',
      stage: 'queued',
      input_payload: {
        modelUrl,
        jobType: 'uv_unwrap',
        options: {
          generation_mode,
        },
      },
      artifacts: null,
      metrics: null,
      error_message: null,
      started_at: null,
      finished_at: null,
    });

    const runpodSubmitted = await this.blenderCloudService.submitBlenderCloudJob({
      modelUrl,
      jobType: 'uv_unwrap',
      options: { generation_mode },
    });

    await this.pipelineJobsRepository.update(created.pipeline_job_id, {
      cloud_job_id: runpodSubmitted.cloudJobId,
      status: 'running',
      stage: 'queued_in_runpod',
      started_at: new Date().toISOString(),
      metrics: {
        runpodSubmitResponse: runpodSubmitted.raw,
      },
    });

    await this.wardrobeItemsRepository.updatePipelineStatus(wardrobe_item_id, 'queued_base', null, {
      stage: 'uv_pipeline_queued_in_runpod',
      pipeline_job_id: created.pipeline_job_id,
      cloud_job_id: runpodSubmitted.cloudJobId,
      provider: 'runpod',
    });

    return {
      jobId: created.pipeline_job_id,
      cloudJobId: runpodSubmitted.cloudJobId,
      provider: 'runpod',
      status: 'pending',
      stage: 'queued',
    };
  }

  async getJob(pipelineJobId: string) {
    const job = await this.syncBlenderCloudJob(pipelineJobId);
    return {
      jobId: job.pipeline_job_id,
      cloudJobId: job.cloud_job_id,
      provider: job.provider,
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

  async syncBlenderCloudJob(pipelineJobId: string) {
    const job = await this.pipelineJobsRepository.findById(pipelineJobId);
    if (!job) {
      throw new ServiceError('Pipeline job not found.', 404);
    }

    if (!job.cloud_job_id) {
      return job;
    }

    if (job.status === 'completed' || job.status === 'failed') {
      return job;
    }

    const remote = await this.blenderCloudService.getBlenderCloudJobStatus(job.cloud_job_id);

    if (remote.status === 'completed') {
      await this.pipelineJobsRepository.update(pipelineJobId, {
        status: 'completed',
        stage: 'completed',
        artifacts: remote.artifacts,
        metrics: {
          ...(job.metrics ?? {}),
          ...(remote.metrics ?? {}),
        },
        error_message: null,
        finished_at: new Date().toISOString(),
      });

      await this.wardrobeItemsRepository.updatePipelineStatus(job.wardrobe_item_id, 'done', null, {
        stage: 'uv_pipeline_completed',
        pipeline_job_id: pipelineJobId,
        cloud_job_id: job.cloud_job_id,
        provider: 'runpod',
        uv_job_artifacts: remote.artifacts,
        uv_job_metrics: remote.metrics,
      });
    } else if (remote.status === 'failed') {
      await this.pipelineJobsRepository.update(pipelineJobId, {
        status: 'failed',
        stage: 'failed',
        artifacts: remote.artifacts,
        metrics: {
          ...(job.metrics ?? {}),
          ...(remote.metrics ?? {}),
        },
        error_message: JSON.stringify(remote.raw.error ?? 'RunPod job failed'),
        finished_at: new Date().toISOString(),
      });

      await this.wardrobeItemsRepository.updatePipelineStatus(job.wardrobe_item_id, 'failed', 'RunPod Blender job failed.', {
        stage: 'uv_pipeline_failed',
        pipeline_job_id: pipelineJobId,
        cloud_job_id: job.cloud_job_id,
        provider: 'runpod',
      });
    } else {
      await this.pipelineJobsRepository.update(pipelineJobId, {
        status: 'running',
        stage: remote.status === 'in_progress' ? 'in_progress' : 'queued',
      });
    }

    const synced = await this.pipelineJobsRepository.findById(pipelineJobId);
    if (!synced) {
      throw new ServiceError('Pipeline job not found after synchronization.', 404);
    }

    return synced;
  }
}
