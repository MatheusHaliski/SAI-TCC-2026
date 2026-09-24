package com.sai.backend.dto.response;

import com.sai.backend.entity.SchemeItem;
import lombok.Builder;
import lombok.Data;

@Data @Builder
public class SchemeItemResponse {
    private Long schemeItemId;
    private Long schemeId;
    private Long wardrobeItemId;
    private String wardrobeItemName;
    private String wardrobeItemImageUrl;
    private String slot;
    private Integer sortOrder;

    public static SchemeItemResponse from(SchemeItem si) {
        return SchemeItemResponse.builder()
                .schemeItemId(si.getSchemeItemId())
                .schemeId(si.getScheme().getSchemeId())
                .wardrobeItemId(si.getWardrobeItem().getWardrobeItemId())
                .wardrobeItemName(si.getWardrobeItem().getName())
                .wardrobeItemImageUrl(si.getWardrobeItem().getImageUrl())
                .slot(si.getSlot().name())
                .sortOrder(si.getSortOrder())
                .build();
    }
}
