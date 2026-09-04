package com.sai.backend.dto.response;

import lombok.Builder;
import lombok.Data;

@Data @Builder
public class AuthResponse {
    private boolean ok;
    private String token;
    private UserResponse profile;
}
