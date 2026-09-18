package com.sai.backend.controller;

import com.sai.backend.dto.request.PieceLikeRequest;
import com.sai.backend.dto.request.PieceRatingRequest;
import com.sai.backend.dto.response.PieceStatsResponse;
import com.sai.backend.service.PieceEngagementService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequiredArgsConstructor
public class PieceEngagementController {

    private final PieceEngagementService engagementService;

    // POST /api/piece-likes/{wardrobeItemId}
    @PostMapping("/api/piece-likes/{wardrobeItemId}")
    public ResponseEntity<Map<String, Object>> toggleLike(
            @PathVariable Long wardrobeItemId,
            @AuthenticationPrincipal UserDetails principal,
            @Valid @RequestBody PieceLikeRequest req) {
        Long userId = Long.valueOf(principal.getUsername());
        return ResponseEntity.ok(engagementService.toggleLike(wardrobeItemId, userId, req.getLiked()));
    }

    // POST /api/piece-ratings/{wardrobeItemId}
    @PostMapping("/api/piece-ratings/{wardrobeItemId}")
    public ResponseEntity<Map<String, Object>> rate(
            @PathVariable Long wardrobeItemId,
            @AuthenticationPrincipal UserDetails principal,
            @Valid @RequestBody PieceRatingRequest req) {
        Long userId = Long.valueOf(principal.getUsername());
        return ResponseEntity.ok(engagementService.rate(wardrobeItemId, userId, req.getStars()));
    }

    // GET /api/piece-stats/{wardrobeItemId}
    @GetMapping("/api/piece-stats/{wardrobeItemId}")
    public ResponseEntity<PieceStatsResponse> getStats(
            @PathVariable Long wardrobeItemId,
            @AuthenticationPrincipal UserDetails principal) {
        Long userId = principal != null ? Long.valueOf(principal.getUsername()) : null;
        return ResponseEntity.ok(engagementService.getStats(wardrobeItemId, userId));
    }
}
