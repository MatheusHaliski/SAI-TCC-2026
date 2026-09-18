package com.sai.backend.service;

import com.sai.backend.dto.response.MarketResponse;
import com.sai.backend.entity.Market;
import com.sai.backend.exception.ResourceNotFoundException;
import com.sai.backend.repository.MarketRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MarketService {

    private final MarketRepository marketRepository;

    public List<MarketResponse> listAll() {
        return marketRepository.findAll().stream()
                .map(MarketResponse::from)
                .toList();
    }

    public MarketResponse getById(Long id) {
        Market market = marketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Market not found: " + id));
        return MarketResponse.from(market);
    }

    public Market getEntityById(Long id) {
        return marketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Market not found: " + id));
    }
}
