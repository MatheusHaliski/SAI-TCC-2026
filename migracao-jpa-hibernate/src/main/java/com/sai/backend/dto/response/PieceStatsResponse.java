package com.sai.backend.dto.response;

import lombok.Builder;
import lombok.Data;

@Data @Builder
public class PieceStatsResponse {
    private boolean ok;
    private long likeCount;
    private Double avgRating;
    private long ratingCount;
    private boolean userHasLiked;
    private Integer userRating;
}
