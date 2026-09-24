package com.sai.backend.dto.request;

import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

import java.util.List;

@Data
public class AddSchemeItemsRequest {

    @NotEmpty
    private List<SchemeItemInput> items;

    @Data
    public static class SchemeItemInput {
        private Long schemeId;
        private Long wardrobeItemId;
        private String slot;
        private Integer sortOrder;
    }
}
