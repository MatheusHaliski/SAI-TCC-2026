package com.sai.backend.controller;

import com.sai.backend.dto.request.UpdateUserRequest;
import com.sai.backend.dto.response.ApiResponse;
import com.sai.backend.dto.response.UserResponse;
import com.sai.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    // GET /api/users/me
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserResponse>> getMe(@AuthenticationPrincipal UserDetails principal) {
        Long userId = Long.valueOf(principal.getUsername());
        return ResponseEntity.ok(ApiResponse.ok(userService.getById(userId)));
    }

    // PATCH /api/users/me
    @PatchMapping("/me")
    public ResponseEntity<ApiResponse<UserResponse>> updateMe(
            @AuthenticationPrincipal UserDetails principal,
            @RequestBody UpdateUserRequest req) {
        Long userId = Long.valueOf(principal.getUsername());
        return ResponseEntity.ok(ApiResponse.ok(userService.update(userId, req)));
    }

    // DELETE /api/users/me
    @DeleteMapping("/me")
    public ResponseEntity<ApiResponse<Void>> deleteMe(@AuthenticationPrincipal UserDetails principal) {
        Long userId = Long.valueOf(principal.getUsername());
        userService.delete(userId);
        return ResponseEntity.ok(ApiResponse.ok());
    }

    // GET /api/users/{id}
    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getById(id));
    }

    // GET /api/users/public
    @GetMapping("/public")
    public ResponseEntity<ApiResponse<List<UserResponse>>> listPublic() {
        return ResponseEntity.ok(ApiResponse.ok(userService.listPublic()));
    }
}
