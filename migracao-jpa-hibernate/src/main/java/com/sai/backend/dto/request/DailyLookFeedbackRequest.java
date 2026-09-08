package com.sai.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class DailyLookFeedbackRequest {
    @NotBlank
    private String feedback;
}
