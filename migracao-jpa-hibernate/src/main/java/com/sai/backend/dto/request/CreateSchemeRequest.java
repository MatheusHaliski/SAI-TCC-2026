package com.sai.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.util.List;

@Data
public class CreateSchemeRequest {

    @NotBlank
    private String title;

    private String description;

    @NotBlank
    private String creationMode;

    @NotBlank
    private String style;

    @NotBlank
    private String occasion;

    private String visibility;
    private Boolean communityIndexed;
    private String coverImageUrl;
    private List<SchemeItemInput> items;

    @Data
    public static class SchemeItemInput {
        private Long wardrobeItemId;
        private String slot;
        private Integer sortOrder;
    }
}
