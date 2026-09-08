package com.sai.backend.service;

import com.sai.backend.dto.response.PieceItemResponse;
import com.sai.backend.repository.PieceItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PieceItemService {

    private final PieceItemRepository pieceItemRepository;

    public List<PieceItemResponse> search(String season, String gender, Long brandId, String pieceType) {
        return pieceItemRepository.search(season, gender, brandId, pieceType).stream()
                .map(PieceItemResponse::from)
                .toList();
    }
}
