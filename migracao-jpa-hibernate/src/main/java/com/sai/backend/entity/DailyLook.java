package com.sai.backend.entity;

import com.sai.backend.entity.enums.DailyLookFeedback;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "daily_looks")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class DailyLook {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "daily_look_id")
    private Long dailyLookId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "scheme_id")
    private Scheme scheme;

    @Column(name = "occasion", length = 100)
    private String occasion;

    @Column(name = "mood", length = 80)
    private String mood;

    @Column(name = "weather_c")
    private Double weatherC;

    @Enumerated(EnumType.STRING)
    @Column(name = "feedback", length = 20)
    private DailyLookFeedback feedback;

    @Column(name = "confirmed")
    @Builder.Default
    private Boolean confirmed = false;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
}
