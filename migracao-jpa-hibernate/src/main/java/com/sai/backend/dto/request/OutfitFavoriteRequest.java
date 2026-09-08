package com.sai.backend.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class OutfitFavoriteRequest {
    @NotNull
    private Long schemeId;
    @NotNull
    private Boolean favorite;
}
