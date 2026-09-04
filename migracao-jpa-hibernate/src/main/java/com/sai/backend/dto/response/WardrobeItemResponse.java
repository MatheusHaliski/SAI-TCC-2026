package com.sai.backend.dto.response;

import com.sai.backend.entity.WardrobeItem;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data @Builder
public class WardrobeItemResponse {
    private Long wardrobeItemId;
    private Long userId;
    private String name;
    private String imageUrl;
    private String pieceType;
    private String color;
    private String material;
    private String styleTags;
    private String occasionTags;
    private Boolean isFavorite;
    private String modelStatus;
    private String model3dUrl;
    private String modelPreviewUrl;
    private String assetStatus;
    private String asset2dUrl;
    private Long brandId;
    private String brandName;
    private Long marketId;
    private String season;
    private String gender;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static WardrobeItemResponse from(WardrobeItem w) {
        return WardrobeItemResponse.builder()
                .wardrobeItemId(w.getWardrobeItemId())
                .userId(w.getUser().getUserId())
                .name(w.getName())
                .imageUrl(w.getImageUrl())
                .pieceType(w.getPieceType())
                .color(w.getColor())
                .material(w.getMaterial())
                .styleTags(w.getStyleTags())
                .occasionTags(w.getOccasionTags())
                .isFavorite(w.getIsFavorite())
                .modelStatus(w.getModelStatus() != null ? w.getModelStatus().name() : null)
                .model3dUrl(w.getModel3dUrl())
                .modelPreviewUrl(w.getModelPreviewUrl())
                .assetStatus(w.getAssetStatus() != null ? w.getAssetStatus().name() : null)
                .asset2dUrl(w.getAsset2dUrl())
                .brandId(w.getBrand().getBrandId())
                .brandName(w.getBrand().getName())
                .marketId(w.getMarket().getMarketId())
                .season(w.getMarket().getSeason())
                .gender(w.getMarket().getGender())
                .createdAt(w.getCreatedAt())
                .updatedAt(w.getUpdatedAt())
                .build();
    }
}
