package com.sai.backend.controller;

import com.sai.backend.dto.request.CreateWardrobeItemRequest;
import com.sai.backend.dto.request.UpdateWardrobeItemRequest;
import com.sai.backend.dto.response.ApiResponse;
import com.sai.backend.dto.response.WardrobeItemResponse;
import com.sai.backend.service.WardrobeItemService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/wardrobe-items")
@RequiredArgsConstructor
public class WardrobeItemController {

    private final WardrobeItemService wardrobeItemService;

    // GET /api/wardrobe-items  (catálogo descobrível)
    @GetMapping
    public ResponseEntity<Page<WardrobeItemResponse>> listDiscoverable(
            @RequestParam(required = false) Long brand_id,
            @RequestParam(required = false) Long market_id,
            @RequestParam(required = false) String gender,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(wardrobeItemService.listDiscoverable(brand_id, market_id, gender, page, size));
    }

    // POST /api/wardrobe-items
    @PostMapping
    public ResponseEntity<WardrobeItemResponse> create(
            @AuthenticationPrincipal UserDetails principal,
            @Valid @RequestBody CreateWardrobeItemRequest req) {
        Long userId = Long.valueOf(principal.getUsername());
        return ResponseEntity.ok(wardrobeItemService.create(userId, req));
    }

    // GET /api/wardrobe-items/{id}
    @GetMapping("/{id}")
    public ResponseEntity<WardrobeItemResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(wardrobeItemService.getById(id));
    }

    // PATCH /api/wardrobe-items/{id}
    @PatchMapping("/{id}")
    public ResponseEntity<WardrobeItemResponse> update(
            @PathVariable Long id,
            @RequestBody UpdateWardrobeItemRequest req) {
        return ResponseEntity.ok(wardrobeItemService.update(id, req));
    }

    // DELETE /api/wardrobe-items/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        wardrobeItemService.delete(id);
        return ResponseEntity.ok(ApiResponse.ok());
    }

    // POST /api/wardrobe-items/{id}/retry-3d
    @PostMapping("/{id}/retry-3d")
    public ResponseEntity<ApiResponse<Void>> retry3d(@PathVariable Long id) {
        wardrobeItemService.retry3d(id);
        return ResponseEntity.ok(ApiResponse.ok());
    }

    // GET /api/wardrobe-items/user/{userId}
    @GetMapping("/user/{userId}")
    public ResponseEntity<Page<WardrobeItemResponse>> listByUser(
            @PathVariable Long userId,
            @RequestParam(name = "piece_type", required = false) String pieceType,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(wardrobeItemService.listByUser(userId, pieceType, page, size));
    }

    // GET /api/wardrobe-items/user/{userId}/analysis
    @GetMapping("/user/{userId}/analysis")
    public ResponseEntity<Map<String, Object>> getAnalysis(@PathVariable Long userId) {
        return ResponseEntity.ok(wardrobeItemService.getAnalysis(userId));
    }
}
