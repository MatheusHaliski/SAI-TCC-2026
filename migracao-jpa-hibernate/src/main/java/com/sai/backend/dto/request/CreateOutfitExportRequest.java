package com.sai.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CreateOutfitExportRequest {
    private String outfitId;
    private Long schemeId;
    @NotBlank
    private String platform;
    @NotBlank
    private String format;
    private String exportMode;
    private String caption;
    private String sourceImageUrl;
}
