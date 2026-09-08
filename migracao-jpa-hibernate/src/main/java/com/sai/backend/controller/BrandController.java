package com.sai.backend.controller;

import com.sai.backend.dto.response.BrandResponse;
import com.sai.backend.service.BrandService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/brands")
@RequiredArgsConstructor
public class BrandController {

    private final BrandService brandService;

    // GET /api/brands
    @GetMapping
    public ResponseEntity<List<BrandResponse>> listActive() {
        return ResponseEntity.ok(brandService.listActive());
    }

    // GET /api/brands/{id}
    @GetMapping("/{id}")
    public ResponseEntity<BrandResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(brandService.getById(id));
    }
}
