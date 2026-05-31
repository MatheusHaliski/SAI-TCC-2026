package com.sai.backend.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class PieceRatingRequest {
    @NotNull
    @Min(1) @Max(5)
    private Integer stars;
}
