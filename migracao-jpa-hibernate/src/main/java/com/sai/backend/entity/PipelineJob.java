package com.sai.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "pipeline_jobs")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class PipelineJob {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "job_id")
    private Long jobId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "wardrobe_item_id", nullable = false)
    private WardrobeItem wardrobeItem;

    @Column(name = "job_type", nullable = false, length = 60)
    private String jobType;

    @Column(name = "provider", length = 40)
    private String provider;

    @Column(name = "status", nullable = false, length = 40)
    @Builder.Default
    private String status = "queued";

    @Column(name = "runpod_job_id", length = 120)
    private String runpodJobId;

    @Column(name = "result_url", length = 512)
    private String resultUrl;

    @Column(name = "error", columnDefinition = "TEXT")
    private String error;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}
