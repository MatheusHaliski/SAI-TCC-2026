package com.sai.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "user_posts")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class UserPost {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "post_id")
    private Long postId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "outfit_id", length = 100)
    private String outfitId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "scheme_id")
    private Scheme scheme;

    @Column(name = "title", nullable = false, length = 180)
    private String title;

    @Column(name = "caption", columnDefinition = "TEXT")
    private String caption;

    @Column(name = "platforms", columnDefinition = "TEXT")
    private String platforms;

    @Column(name = "primary_platform", length = 60)
    private String primaryPlatform;

    @Column(name = "visibility", length = 20)
    @Builder.Default
    private String visibility = "private";

    @Column(name = "preview_image_url", length = 512)
    private String previewImageUrl;

    @Column(name = "status", length = 40)
    @Builder.Default
    private String status = "draft";

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}
