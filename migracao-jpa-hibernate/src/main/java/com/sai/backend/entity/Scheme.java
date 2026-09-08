package com.sai.backend.entity;

import com.sai.backend.entity.enums.CreationMode;
import com.sai.backend.entity.enums.Visibility;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "schemes")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Scheme {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "scheme_id")
    private Long schemeId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "title", nullable = false, length = 180)
    private String title;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "creation_mode", nullable = false, length = 10)
    private CreationMode creationMode;

    @Column(name = "style", nullable = false, length = 100)
    private String style;

    @Column(name = "occasion", nullable = false, length = 100)
    private String occasion;

    @Enumerated(EnumType.STRING)
    @Column(name = "visibility", nullable = false, length = 10)
    @Builder.Default
    private Visibility visibility = Visibility.private_v;

    @Column(name = "community_indexed", nullable = false)
    @Builder.Default
    private Boolean communityIndexed = false;

    @Column(name = "cover_image_url", length = 512)
    private String coverImageUrl;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "scheme", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @Builder.Default
    private List<SchemeItem> items = new ArrayList<>();
}
