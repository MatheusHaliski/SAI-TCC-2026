package com.sai.backend.controller;

import com.sai.backend.dto.response.PieceItemResponse;
import com.sai.backend.service.PieceItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/piece-items")
@RequiredArgsConstructor
public class PieceItemController {

    private final PieceItemService pieceItemService;

    // GET /api/piece-items?season=&gender=&brand=&piece_type=
    @GetMapping
    public ResponseEntity<List<PieceItemResponse>> search(
            @RequestParam(required = false) String season,
            @RequestParam(required = false) String gender,
            @RequestParam(required = false) Long brand,
            @RequestParam(name = "piece_type", required = false) String pieceType) {
        return ResponseEntity.ok(pieceItemService.search(season, gender, brand, pieceType));
    }
}
