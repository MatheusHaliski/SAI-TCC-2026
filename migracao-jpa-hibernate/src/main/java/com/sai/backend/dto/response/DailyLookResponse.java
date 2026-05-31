package com.sai.backend.dto.response;

import com.sai.backend.entity.DailyLook;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data @Builder
public class DailyLookResponse {
    private Long dailyLookId;
    private Long schemeId;
    private String occasion;
    private String mood;
    private Double weatherC;
    private String feedback;
    private Boolean confirmed;
    private LocalDateTime createdAt;

    public static DailyLookResponse from(DailyLook d) {
        return DailyLookResponse.builder()
                .dailyLookId(d.getDailyLookId())
                .schemeId(d.getScheme() != null ? d.getScheme().getSchemeId() : null)
                .occasion(d.getOccasion())
                .mood(d.getMood())
                .weatherC(d.getWeatherC())
                .feedback(d.getFeedback() != null ? d.getFeedback().name() : null)
                .confirmed(d.getConfirmed())
                .createdAt(d.getCreatedAt())
                .build();
    }
}
