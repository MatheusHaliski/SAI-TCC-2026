package com.sai.backend.controller;

import com.sai.backend.dto.request.CreateUserPostRequest;
import com.sai.backend.entity.UserPost;
import com.sai.backend.service.UserPostService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user-posts")
@RequiredArgsConstructor
public class UserPostController {

    private final UserPostService postService;

    // GET /api/user-posts
    @GetMapping
    public ResponseEntity<List<UserPost>> listPosts(@AuthenticationPrincipal UserDetails principal) {
        Long userId = Long.valueOf(principal.getUsername());
        return ResponseEntity.ok(postService.listByUser(userId));
    }

    // POST /api/user-posts
    @PostMapping
    public ResponseEntity<UserPost> createPost(
            @AuthenticationPrincipal UserDetails principal,
            @Valid @RequestBody CreateUserPostRequest req) {
        Long userId = Long.valueOf(principal.getUsername());
        return ResponseEntity.ok(postService.create(userId, req));
    }
}
