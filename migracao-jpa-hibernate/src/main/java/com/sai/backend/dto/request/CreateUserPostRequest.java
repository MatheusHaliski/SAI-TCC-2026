package com.sai.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.util.List;

@Data
public class CreateUserPostRequest {
    private String outfitId;
    private Long schemeId;
    @NotBlank
    private String title;
    private String caption;
    private List<String> platforms;
    private String primaryPlatform;
    private String visibility;
    private String previewImageUrl;
}
