package com.sai.backend.service;

import com.sai.backend.dto.response.BrandResponse;
import com.sai.backend.entity.Brand;
import com.sai.backend.exception.ResourceNotFoundException;
import com.sai.backend.repository.BrandRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BrandService {

    private final BrandRepository brandRepository;

    public List<BrandResponse> listActive() {
        return brandRepository.findByIsActiveTrue().stream()
                .map(BrandResponse::from)
                .toList();
    }

    public BrandResponse getById(Long id) {
        Brand brand = brandRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Brand not found: " + id));
        return BrandResponse.from(brand);
    }

    public Brand getEntityById(Long id) {
        return brandRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Brand not found: " + id));
    }
}
