package com.sai.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "piece_items")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class PieceItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "piece_item_id")
    private Long pieceItemId;

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

    @Column(name = "store_url", length = 512)
    private String storeUrl;

    @Column(name = "price_range", length = 60)
    private String priceRange;

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private Boolean isActive = true;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}
