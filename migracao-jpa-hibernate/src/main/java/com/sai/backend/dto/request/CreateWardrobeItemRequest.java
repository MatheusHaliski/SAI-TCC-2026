package com.sai.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateWardrobeItemRequest {

    @NotBlank
    private String name;

    @NotBlank
    private String imageUrl;

    @NotBlank
    private String pieceType;

    @NotBlank
    private String color;

    @NotBlank
    private String material;

    @NotNull
    private Long brandId;

    @NotNull
    private Long marketId;

    private String styleTags;
    private String occasionTags;
    private Boolean isFavorite;
}
