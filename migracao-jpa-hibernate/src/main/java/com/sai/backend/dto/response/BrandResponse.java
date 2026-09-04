package com.sai.backend.dto.response;

import com.sai.backend.entity.Brand;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data @Builder
public class BrandResponse {
    private Long brandId;
    private String name;
    private String logoUrl;
    private Boolean isActive;
    private LocalDateTime createdAt;

    public static BrandResponse from(Brand b) {
        return BrandResponse.builder()
                .brandId(b.getBrandId())
                .name(b.getName())
                .logoUrl(b.getLogoUrl())
                .isActive(b.getIsActive())
                .createdAt(b.getCreatedAt())
                .build();
    }
}
