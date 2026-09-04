package com.sai.backend.controller;

import com.sai.backend.dto.request.CreateOutfitExportRequest;
import com.sai.backend.dto.request.OutfitFavoriteRequest;
import com.sai.backend.entity.OutfitExport;
import com.sai.backend.entity.OutfitFavorite;
import com.sai.backend.service.OutfitExportService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
public class OutfitExportController {

    private final OutfitExportService exportService;

    // GET /api/outfit-exports
    @GetMapping("/api/outfit-exports")
    public ResponseEntity<List<OutfitExport>> listExports(@AuthenticationPrincipal UserDetails principal) {
        Long userId = Long.valueOf(principal.getUsername());
        return ResponseEntity.ok(exportService.listExports(userId));
    }

    // POST /api/outfit-exports
    @PostMapping("/api/outfit-exports")
    public ResponseEntity<OutfitExport> createExport(
            @AuthenticationPrincipal UserDetails principal,
            @Valid @RequestBody CreateOutfitExportRequest req) {
        Long userId = Long.valueOf(principal.getUsername());
        return ResponseEntity.ok(exportService.createExport(userId, req));
    }

    // POST /api/outfit-favorites
    @PostMapping("/api/outfit-favorites")
    public ResponseEntity<Map<String, Object>> toggleFavorite(
            @AuthenticationPrincipal UserDetails principal,
            @Valid @RequestBody OutfitFavoriteRequest req) {
        Long userId = Long.valueOf(principal.getUsername());
        return ResponseEntity.ok(exportService.toggleFavorite(userId, req));
    }

    // GET /api/outfit-favorites
    @GetMapping("/api/outfit-favorites")
    public ResponseEntity<List<OutfitFavorite>> listFavorites(@AuthenticationPrincipal UserDetails principal) {
        Long userId = Long.valueOf(principal.getUsername());
        return ResponseEntity.ok(exportService.listFavorites(userId));
    }
}
