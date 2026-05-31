package com.sai.backend.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class PieceLikeRequest {
    @NotNull
    private Boolean liked;
}
