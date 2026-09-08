package com.sai.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.util.List;

@Data
public class DailyLookRequest {
    @NotBlank
    private String occasion;
    private String mood;
    private String city;
    private List<Long> excludeSchemeIds;
}
