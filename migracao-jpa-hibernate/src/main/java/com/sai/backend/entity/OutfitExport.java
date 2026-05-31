package com.sai.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "outfit_exports")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class OutfitExport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "export_id")
    private Long exportId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "outfit_id", length = 100)
    private String outfitId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "scheme_id")
    private Scheme scheme;

    @Column(name = "platform", nullable = false, length = 60)
    private String platform;

    @Column(name = "format", nullable = false, length = 40)
    private String format;

    @Column(name = "export_mode", length = 40)
    private String exportMode;

    @Column(name = "status", length = 40)
    @Builder.Default
    private String status = "pending";

    @Column(name = "caption", columnDefinition = "TEXT")
    private String caption;

    @Column(name = "source_image_url", length = 512)
    private String sourceImageUrl;

    @Column(name = "result_url", length = 512)
    private String resultUrl;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}
