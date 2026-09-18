package com.sai.backend.dto.request;

import lombok.Data;

@Data
public class UpdateWardrobeItemRequest {
    private String name;
    private String pieceType;
    private String color;
    private String material;
    private String styleTags;
    private String occasionTags;
    private Boolean isFavorite;
}
