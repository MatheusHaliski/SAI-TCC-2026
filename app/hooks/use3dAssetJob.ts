'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export type AssetJobStatus = 'idle' | 'submitting' | 'queued' | 'in_progress' | 'completed' | 'failed';

interface Use3dAssetJobOptions {
  pollIntervalMs?: number;
  timeoutMs?: number;
  onCompleted?: (artifactUrl: string) => void;
}

interface StartJobInput {
  existingJobId?: string | null;
  existingArtifactUrl?: string | null;
  createJob?: () => Promise<unknown>;
  pollJob: (jobId: string) => Promise<unknown>;
}

const TERMINAL_STATUSES: AssetJobStatus[] = ['completed', 'failed'];

function normalizeStatus(statusLike: unknown): AssetJobStatus {
  const normalized = String(statusLike ?? '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '_');

  if (!normalized) return 'idle';
  if (normalized === 'completed' || normalized === 'ready' || normalized === 'asset_available' || normalized === 'done') return 'completed';
  if (normalized === 'failed' || normalized === 'error' || normalized === 'cancelled') return 'failed';
  if (normalized === 'queued' || normalized === 'pending') return 'queued';
  if (normalized === 'in_progress' || normalized === 'processing' || normalized === 'running') return 'in_progress';
  if (normalized === 'submitting') return 'submitting';
  return 'idle';
}

function extractArtifactUrl(payload: unknown): string | null {
  if (!payload || typeof payload !== 'object') return null;
  const source = payload as Record<string, unknown>;
  const artifacts = (source.artifacts ?? {}) as Record<string, unknown>;
  const candidate = source.model_3d_url ?? source.modelUrl ?? artifacts.model_3d_url ?? artifacts.modelUrl;
  const url = typeof candidate === 'string' ? candidate.trim() : '';
  return url.length > 0 ? url : null;
}

function extractJobId(payload: unknown): string | null {
  if (!payload || typeof payload !== 'object') return null;
  const source = payload as Record<string, unknown>;
  const jobId = source.jobId ?? source.id;
  return typeof jobId === 'string' && jobId.trim().length > 0 ? jobId.trim() : null;
}

export function use3dAssetJob(options?: Use3dAssetJobOptions) {
  const pollIntervalMs = options?.pollIntervalMs ?? 1800;
  const timeoutMs = options?.timeoutMs ?? 90000;

  const [status, setStatus] = useState<AssetJobStatus>('idle');
  const [jobId, setJobId] = useState<string | null>(null);
  const [artifactUrl, setArtifactUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progressPercent, setProgressPercent] = useState(0);

  const pollTimerRef = useRef<number | null>(null);
  const timeoutTimerRef = useRef<number | null>(null);
  const activeJobRef = useRef<string | null>(null);
  const pollJobRef = useRef<((jobId: string) => Promise<unknown>) | null>(null);

  const stopTimers = useCallback(() => {
    if (pollTimerRef.current !== null) {
      window.clearInterval(pollTimerRef.current);
      pollTimerRef.current = null;
    }
    if (timeoutTimerRef.current !== null) {
      window.clearTimeout(timeoutTimerRef.current);
      timeoutTimerRef.current = null;
    }
  }, []);

  const completeWithArtifact = useCallback((url: string) => {
    stopTimers();
    setArtifactUrl(url);
    setStatus('completed');
    setProgressPercent(100);
    setError(null);
    options?.onCompleted?.(url);
  }, [options, stopTimers]);

  const startPolling = useCallback((nextJobId: string, pollJob: (jobId: string) => Promise<unknown>) => {
    if (activeJobRef.current === nextJobId && pollTimerRef.current !== null) {
      return;
    }

    stopTimers();
    activeJobRef.current = nextJobId;
    pollJobRef.current = pollJob;

    const runPoll = async () => {
      const payload = await pollJob(nextJobId);
      const polledStatus = normalizeStatus((payload as Record<string, unknown>)?.status);
      const resolvedArtifact = extractArtifactUrl(payload);

      if (resolvedArtifact && polledStatus === 'completed') {
        completeWithArtifact(resolvedArtifact);
        return;
      }

      if (polledStatus === 'completed' && !resolvedArtifact) {
        stopTimers();
        setStatus('failed');
        setProgressPercent((current) => Math.max(15, current));
        setError('3D generation finished but no model URL was returned.');
        return;
      }

      if (polledStatus === 'failed') {
        stopTimers();
        setStatus('failed');
        setProgressPercent((current) => Math.max(15, current));
        const payloadError = (payload as Record<string, unknown>)?.error;
        setError(typeof payloadError === 'string' && payloadError.trim() ? payloadError : '3D generation failed.');
        return;
      }

      const nextStatus = polledStatus === 'queued' ? 'queued' : 'in_progress';
      setStatus(nextStatus);
      setProgressPercent((current) => {
        if (nextStatus === 'queued') return Math.max(current, 25);
        return Math.min(90, Math.max(45, current + 2));
      });
    };

    void runPoll().catch((pollError) => {
      stopTimers();
      setStatus('failed');
      setProgressPercent((current) => Math.max(15, current));
      setError(pollError instanceof Error ? pollError.message : 'Unable to poll 3D generation status.');
    });

    pollTimerRef.current = window.setInterval(() => {
      void runPoll().catch((pollError) => {
        stopTimers();
        setStatus('failed');
        setProgressPercent((current) => Math.max(15, current));
        setError(pollError instanceof Error ? pollError.message : 'Unable to poll 3D generation status.');
      });
    }, pollIntervalMs);

    timeoutTimerRef.current = window.setTimeout(() => {
      stopTimers();
      setStatus('failed');
      setProgressPercent((current) => Math.max(15, current));
      setError('3D generation timed out. Please retry.');
    }, timeoutMs);
  }, [completeWithArtifact, pollIntervalMs, stopTimers, timeoutMs]);

  const startJob = useCallback(async (input: StartJobInput) => {
    setError(null);
    setProgressPercent(5);

    if (input.existingArtifactUrl?.trim()) {
      completeWithArtifact(input.existingArtifactUrl.trim());
      return;
    }

    if (input.existingJobId?.trim()) {
      const existing = input.existingJobId.trim();
      setJobId(existing);
      setStatus('queued');
      setProgressPercent(20);
      startPolling(existing, input.pollJob);
      return;
    }

    if (!input.createJob) {
      setStatus('failed');
      setProgressPercent(0);
      setError('No active 3D generation job was found for this item.');
      return;
    }

    setStatus('submitting');
    setProgressPercent(10);
    const createdPayload = await input.createJob();
    const createdJobId = extractJobId(createdPayload);

    if (!createdJobId) {
      setStatus('failed');
      setProgressPercent(15);
      setError('The generation request did not return a valid job id.');
      return;
    }

    const normalized = normalizeStatus((createdPayload as Record<string, unknown>)?.status);
    setJobId(createdJobId);
    setStatus(normalized === 'idle' ? 'queued' : normalized);
    setProgressPercent(normalized === 'queued' ? 25 : normalized === 'in_progress' ? 45 : normalized === 'completed' ? 100 : 15);

    if (!TERMINAL_STATUSES.includes(normalized)) {
      startPolling(createdJobId, input.pollJob);
      return;
    }

    const completedArtifact = extractArtifactUrl(createdPayload);
    if (normalized === 'completed' && completedArtifact) {
      completeWithArtifact(completedArtifact);
      return;
    }

    if (normalized === 'failed') {
      setError('3D generation failed before polling started.');
    }
  }, [completeWithArtifact, startPolling]);

  const cancelPolling = useCallback(() => {
    stopTimers();
    activeJobRef.current = null;
    setStatus((previous) => (TERMINAL_STATUSES.includes(previous) ? previous : 'idle'));
    setProgressPercent((current) => (TERMINAL_STATUSES.includes(status) ? current : 0));
  }, [status, stopTimers]);

  const retry = useCallback(() => {
    if (!activeJobRef.current || !pollJobRef.current) {
      setStatus('idle');
      setProgressPercent(0);
      setError(null);
      return;
    }

    setError(null);
    setStatus('queued');
    setProgressPercent(20);
    startPolling(activeJobRef.current, pollJobRef.current);
  }, [startPolling]);

  useEffect(() => () => stopTimers(), [stopTimers]);

  return {
    status,
    progressPercent,
    jobId,
    artifactUrl,
    error,
    startJob,
    cancelPolling,
    retry,
    setArtifactUrl,
    setJobId,
    setStatus,
    setError,
  };
}
