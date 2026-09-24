package com.sai.backend.entity;

import com.sai.backend.entity.enums.Slot;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "scheme_items")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class SchemeItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "scheme_item_id")
    private Long schemeItemId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "scheme_id", nullable = false)
    private Scheme scheme;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "wardrobe_item_id", nullable = false)
    private WardrobeItem wardrobeItem;

    @Enumerated(EnumType.STRING)
    @Column(name = "slot", nullable = false, length = 20)
    private Slot slot;

    @Column(name = "sort_order", nullable = false)
    private Integer sortOrder;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
}
