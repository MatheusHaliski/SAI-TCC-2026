package com.sai.backend.service;

import com.sai.backend.entity.PipelineJob;
import com.sai.backend.entity.WardrobeItem;
import com.sai.backend.entity.enums.ModelStatus;
import com.sai.backend.exception.ResourceNotFoundException;
import com.sai.backend.repository.PipelineJobRepository;
import com.sai.backend.repository.WardrobeItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class Pipeline3DService {

    private final PipelineJobRepository jobRepository;
    private final WardrobeItemRepository wardrobeItemRepository;
    private final WebClient.Builder webClientBuilder;

    @Value("${external.runpod.api-key:}")
    private String runpodApiKey;

    @Value("${external.runpod.base-url:}")
    private String runpodBaseUrl;

    @Transactional
    public Map<String, Object> submitJob(Long wardrobeItemId, String imageUrl, String jobType, String provider) {
        WardrobeItem item = wardrobeItemRepository.findById(wardrobeItemId)
                .orElseThrow(() -> new ResourceNotFoundException("WardrobeItem not found: " + wardrobeItemId));

        PipelineJob job = PipelineJob.builder()
                .wardrobeItem(item)
                .jobType(jobType != null ? jobType : "base_3d")
                .provider(provider != null ? provider : "runpod")
                .status("queued")
                .build();
        jobRepository.save(job);

        item.setModelStatus(ModelStatus.queued_base);
        wardrobeItemRepository.save(item);

        // TODO: chamar RunPod API via WebClient e atualizar job.runpodJobId
        // webClientBuilder.build().post()
        //     .uri(runpodBaseUrl + "/run")
        //     .header("Authorization", "Bearer " + runpodApiKey)
        //     .bodyValue(Map.of("input", Map.of("imageUrl", imageUrl)))
        //     .retrieve()
        //     .bodyToMono(Map.class)
        //     .subscribe(res -> { job.setRunpodJobId((String) res.get("id")); jobRepository.save(job); });

        return Map.of("ok", true, "jobId", job.getJobId(), "status", "queued");
    }

    public Map<String, Object> getJobStatus(Long wardrobeItemId) {
        WardrobeItem item = wardrobeItemRepository.findById(wardrobeItemId)
                .orElseThrow(() -> new ResourceNotFoundException("WardrobeItem not found: " + wardrobeItemId));
        return Map.of(
                "ok", true,
                "status", item.getModelStatus() != null ? item.getModelStatus().name() : "unknown",
                "model_3d_url", item.getModel3dUrl() != null ? item.getModel3dUrl() : ""
        );
    }

    @Transactional
    public Map<String, Object> reconcileJob(Long wardrobeItemId, String runpodJobId) {
        WardrobeItem item = wardrobeItemRepository.findById(wardrobeItemId)
                .orElseThrow(() -> new ResourceNotFoundException("WardrobeItem not found: " + wardrobeItemId));
        PipelineJob job = jobRepository.findByRunpodJobId(runpodJobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found: " + runpodJobId));

        // TODO: verificar status no RunPod e atualizar model_3d_url quando concluído
        return Map.of("ok", true, "jobId", job.getJobId(), "status", job.getStatus());
    }
}
