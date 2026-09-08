package com.sai.backend.dto.response;

import com.sai.backend.entity.Scheme;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data @Builder
public class SchemeResponse {
    private Long schemeId;
    private Long userId;
    private String authorName;
    private String title;
    private String description;
    private String creationMode;
    private String style;
    private String occasion;
    private String visibility;
    private Boolean communityIndexed;
    private String coverImageUrl;
    private List<SchemeItemResponse> items;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static SchemeResponse from(Scheme s, List<SchemeItemResponse> items) {
        return SchemeResponse.builder()
                .schemeId(s.getSchemeId())
                .userId(s.getUser().getUserId())
                .authorName(s.getUser().getName())
                .title(s.getTitle())
                .description(s.getDescription())
                .creationMode(s.getCreationMode().name())
                .style(s.getStyle())
                .occasion(s.getOccasion())
                .visibility(s.getVisibility().toJson())
                .communityIndexed(s.getCommunityIndexed())
                .coverImageUrl(s.getCoverImageUrl())
                .items(items)
                .createdAt(s.getCreatedAt())
                .updatedAt(s.getUpdatedAt())
                .build();
    }
}
