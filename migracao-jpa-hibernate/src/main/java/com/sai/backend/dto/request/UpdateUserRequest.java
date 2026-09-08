package com.sai.backend.dto.request;

import lombok.Data;

@Data
public class UpdateUserRequest {
    private String name;
    private String username;
    private String email;
    private String bio;
    private String photoUrl;
}
