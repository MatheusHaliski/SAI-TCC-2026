package com.sai.backend.dto.response;

import com.sai.backend.entity.PieceItem;
import lombok.Builder;
import lombok.Data;

@Data @Builder
public class PieceItemResponse {
    private Long pieceItemId;
    private String name;
    private String imageUrl;
    private String pieceType;
    private String color;
    private String material;
    private String storeUrl;
    private String priceRange;
    private Boolean isActive;
    private Long brandId;
    private String brandName;
    private Long marketId;
    private String season;
    private String gender;

    public static PieceItemResponse from(PieceItem p) {
        return PieceItemResponse.builder()
                .pieceItemId(p.getPieceItemId())
                .name(p.getName())
                .imageUrl(p.getImageUrl())
                .pieceType(p.getPieceType())
                .color(p.getColor())
                .material(p.getMaterial())
                .storeUrl(p.getStoreUrl())
                .priceRange(p.getPriceRange())
                .isActive(p.getIsActive())
                .brandId(p.getBrand().getBrandId())
                .brandName(p.getBrand().getName())
                .marketId(p.getMarket().getMarketId())
                .season(p.getMarket().getSeason())
                .gender(p.getMarket().getGender())
                .build();
    }
}
