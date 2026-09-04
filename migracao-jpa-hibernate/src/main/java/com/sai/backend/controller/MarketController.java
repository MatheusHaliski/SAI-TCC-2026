package com.sai.backend.controller;

import com.sai.backend.dto.response.MarketResponse;
import com.sai.backend.service.MarketService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/markets")
@RequiredArgsConstructor
public class MarketController {

    private final MarketService marketService;

    // GET /api/markets
    @GetMapping
    public ResponseEntity<List<MarketResponse>> listAll() {
        return ResponseEntity.ok(marketService.listAll());
    }

    // GET /api/markets/{id}
    @GetMapping("/{id}")
    public ResponseEntity<MarketResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(marketService.getById(id));
    }
}
