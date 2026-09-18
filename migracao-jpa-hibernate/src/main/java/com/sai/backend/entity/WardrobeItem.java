package com.sai.backend.entity;

import com.sai.backend.entity.enums.AssetStatus;
import com.sai.backend.entity.enums.ModelStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "wardrobe_items")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class WardrobeItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "wardrobe_item_id")
    private Long wardrobeItemId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "brand_id", nullable = false)
    private Brand brand;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "market_id", nullable = false)
    private Market market;

    @Column(name = "name", nullable = false, length = 180)
    private String name;

    @Column(name = "image_url", nullable = false, length = 512)
    private String imageUrl;

    @Column(name = "piece_type", nullable = false, length = 80)
    private String pieceType;

    @Column(name = "color", nullable = false, length = 80)
    private String color;

    @Column(name = "material", nullable = false, length = 80)
    private String material;

    @Column(name = "style_tags", columnDefinition = "TEXT")
    private String styleTags;

    @Column(name = "occasion_tags", columnDefinition = "TEXT")
    private String occasionTags;

    @Column(name = "is_favorite", nullable = false)
    @Builder.Default
    private Boolean isFavorite = false;

    // 3D pipeline fields
    @Enumerated(EnumType.STRING)
    @Column(name = "model_status", length = 40)
    private ModelStatus modelStatus;

    @Column(name = "model_base_3d_url", length = 512)
    private String modelBase3dUrl;

    @Column(name = "model_branded_3d_url", length = 512)
    private String modelBranded3dUrl;

    @Column(name = "model_3d_url", length = 512)
    private String model3dUrl;

    @Column(name = "model_preview_url", length = 512)
    private String modelPreviewUrl;

    @Column(name = "brand_id_selected", length = 80)
    private String brandIdSelected;

    @Column(name = "brand_id_detected", length = 80)
    private String brandIdDetected;

    @Column(name = "brand_detection_confidence")
    private Double brandDetectionConfidence;

    @Column(name = "brand_detection_source", length = 80)
    private String brandDetectionSource;

    @Column(name = "brand_applied")
    private Boolean brandApplied;

    @Column(name = "placement_profile_id", length = 80)
    private String placementProfileId;

    @Column(name = "branding_pass_version")
    private Integer brandingPassVersion;

    // 2D tester fields
    @Enumerated(EnumType.STRING)
    @Column(name = "asset_status", length = 40)
    private AssetStatus assetStatus;

    @Column(name = "asset_2d_url", length = 512)
    private String asset2dUrl;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}
