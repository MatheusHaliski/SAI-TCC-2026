import { BaseRepository } from './BaseRepository';

const PIPELINE_JOBS_COLLECTION = 'sai-pipelineJobs';

export type UvPipelineStatus = 'pending' | 'running' | 'completed' | 'failed';

export interface UvPipelineJobRecord {
  user_id: string;
  wardrobe_item_id: string;
  provider: 'runpod';
  cloud_job_id: string | null;
  status: UvPipelineStatus;
  stage: string;
  input_payload: Record<string, unknown>;
  artifacts: Record<string, unknown> | null;
  metrics: Record<string, unknown> | null;
  error_message: string | null;
  created_at: string;
  updated_at: string;
  started_at: string | null;
  finished_at: string | null;
}

export class PipelineJobsRepository extends BaseRepository {
  async create(input: Omit<UvPipelineJobRecord, 'created_at' | 'updated_at'>): Promise<{ pipeline_job_id: string }> {
    const now = new Date().toISOString();
    const payload: UvPipelineJobRecord = {
      ...input,
      created_at: now,
      updated_at: now,
    };

    const ref = await this.db.collection(PIPELINE_JOBS_COLLECTION).add(payload);
    return { pipeline_job_id: ref.id };
  }

  async findById(pipelineJobId: string): Promise<(UvPipelineJobRecord & { pipeline_job_id: string }) | null> {
    const doc = await this.db.collection(PIPELINE_JOBS_COLLECTION).doc(pipelineJobId).get();
    if (!doc.exists) return null;

    return {
      pipeline_job_id: doc.id,
      ...(doc.data() as UvPipelineJobRecord),
    };
  }

  async update(
    pipelineJobId: string,
    input: Partial<Omit<UvPipelineJobRecord, 'created_at' | 'user_id' | 'wardrobe_item_id' | 'input_payload'>>,
  ): Promise<void> {
    await this.db.collection(PIPELINE_JOBS_COLLECTION).doc(pipelineJobId).update({
      ...input,
      updated_at: new Date().toISOString(),
    });
  }
}
