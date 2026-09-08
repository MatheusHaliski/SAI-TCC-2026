package com.sai.backend.dto.response;

import com.sai.backend.entity.User;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data @Builder
public class UserResponse {
    private Long userId;
    private String name;
    private String email;
    private String username;
    private String photoUrl;
    private String role;
    private String bio;
    private LocalDateTime createdAt;

    public static UserResponse from(User u) {
        return UserResponse.builder()
                .userId(u.getUserId())
                .name(u.getName())
                .email(u.getEmail())
                .username(u.getUsername())
                .photoUrl(u.getPhotoUrl())
                .role(u.getRole().name())
                .bio(u.getBio())
                .createdAt(u.getCreatedAt())
                .build();
    }
}
