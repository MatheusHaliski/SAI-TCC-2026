package com.sai.backend.controller;

import com.sai.backend.dto.request.CreateSchemeRequest;
import com.sai.backend.dto.response.SchemeResponse;
import com.sai.backend.service.SchemeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/schemes")
@RequiredArgsConstructor
public class SchemeController {

    private final SchemeService schemeService;

    // POST /api/schemes
    @PostMapping
    public ResponseEntity<SchemeResponse> create(
            @AuthenticationPrincipal UserDetails principal,
            @Valid @RequestBody CreateSchemeRequest req) {
        Long userId = Long.valueOf(principal.getUsername());
        return ResponseEntity.ok(schemeService.create(userId, req));
    }

    // GET /api/schemes/{id}
    @GetMapping("/{id}")
    public ResponseEntity<SchemeResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(schemeService.getById(id));
    }

    // GET /api/schemes/user/{userId}
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<SchemeResponse>> listByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(schemeService.listByUser(userId));
    }

    // GET /api/schemes/public
    @GetMapping("/public")
    public ResponseEntity<List<SchemeResponse>> listPublic() {
        return ResponseEntity.ok(schemeService.listPublic());
    }
}
