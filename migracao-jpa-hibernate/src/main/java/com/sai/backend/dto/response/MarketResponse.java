package com.sai.backend.dto.response;

import com.sai.backend.entity.Market;
import lombok.Builder;
import lombok.Data;

@Data @Builder
public class MarketResponse {
    private Long marketId;
    private String season;
    private String gender;

    public static MarketResponse from(Market m) {
        return MarketResponse.builder()
                .marketId(m.getMarketId())
                .season(m.getSeason())
                .gender(m.getGender())
                .build();
    }
}
