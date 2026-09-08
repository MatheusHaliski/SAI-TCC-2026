package com.sai.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class ApiResponse<T> {
    private boolean ok;
    private T data;
    private String message;

    public static <T> ApiResponse<T> ok(T data) {
        return ApiResponse.<T>builder().ok(true).data(data).build();
    }

    public static <T> ApiResponse<T> ok() {
        return ApiResponse.<T>builder().ok(true).build();
    }

    public static <T> ApiResponse<T> error(String message) {
        return ApiResponse.<T>builder().ok(false).message(message).build();
    }
}
