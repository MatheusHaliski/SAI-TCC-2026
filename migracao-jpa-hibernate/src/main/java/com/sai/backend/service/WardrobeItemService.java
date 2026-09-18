package com.sai.backend.service;

import com.sai.backend.dto.request.CreateWardrobeItemRequest;
import com.sai.backend.dto.request.UpdateWardrobeItemRequest;
import com.sai.backend.dto.response.WardrobeItemResponse;
import com.sai.backend.entity.Brand;
import com.sai.backend.entity.Market;
import com.sai.backend.entity.User;
import com.sai.backend.entity.WardrobeItem;
import com.sai.backend.entity.enums.ModelStatus;
import com.sai.backend.exception.ResourceNotFoundException;
import com.sai.backend.repository.WardrobeItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class WardrobeItemService {

    private final WardrobeItemRepository wardrobeItemRepository;
    private final UserService userService;
    private final BrandService brandService;
    private final MarketService marketService;

    @Transactional
    public WardrobeItemResponse create(Long userId, CreateWardrobeItemRequest req) {
        User user = userService.getEntityById(userId);
        Brand brand = brandService.getEntityById(req.getBrandId());
        Market market = marketService.getEntityById(req.getMarketId());

        WardrobeItem item = WardrobeItem.builder()
                .user(user)
                .brand(brand)
                .market(market)
                .name(req.getName())
                .imageUrl(req.getImageUrl())
                .pieceType(req.getPieceType())
                .color(req.getColor())
                .material(req.getMaterial())
                .styleTags(req.getStyleTags())
                .occasionTags(req.getOccasionTags())
                .isFavorite(req.getIsFavorite() != null ? req.getIsFavorite() : false)
                .modelStatus(ModelStatus.queued_base)
                .build();

        return WardrobeItemResponse.from(wardrobeItemRepository.save(item));
    }

    public WardrobeItemResponse getById(Long id) {
        return WardrobeItemResponse.from(getEntityById(id));
    }

    public WardrobeItem getEntityById(Long id) {
        return wardrobeItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("WardrobeItem not found: " + id));
    }

    @Transactional
    public WardrobeItemResponse update(Long id, UpdateWardrobeItemRequest req) {
        WardrobeItem item = getEntityById(id);
        if (req.getName() != null) item.setName(req.getName());
        if (req.getPieceType() != null) item.setPieceType(req.getPieceType());
        if (req.getColor() != null) item.setColor(req.getColor());
        if (req.getMaterial() != null) item.setMaterial(req.getMaterial());
        if (req.getStyleTags() != null) item.setStyleTags(req.getStyleTags());
        if (req.getOccasionTags() != null) item.setOccasionTags(req.getOccasionTags());
        if (req.getIsFavorite() != null) item.setIsFavorite(req.getIsFavorite());
        return WardrobeItemResponse.from(wardrobeItemRepository.save(item));
    }

    @Transactional
    public void delete(Long id) {
        if (!wardrobeItemRepository.existsById(id)) {
            throw new ResourceNotFoundException("WardrobeItem not found: " + id);
        }
        wardrobeItemRepository.deleteById(id);
    }

    public Page<WardrobeItemResponse> listByUser(Long userId, String pieceType, int page, int size) {
        PageRequest pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        return wardrobeItemRepository.findByUserAndFilters(userId, pieceType, pageable)
                .map(WardrobeItemResponse::from);
    }

    public Page<WardrobeItemResponse> listDiscoverable(Long brandId, Long marketId, String gender, int page, int size) {
        PageRequest pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        return wardrobeItemRepository.findDiscoverable(brandId, marketId, gender, pageable)
                .map(WardrobeItemResponse::from);
    }

    public Map<String, Object> getAnalysis(Long userId) {
        List<WardrobeItem> items = wardrobeItemRepository.findByUserAndFilters(userId, null,
                PageRequest.of(0, 1000)).getContent();
        long total = items.size();
        Map<String, Long> byBrand = items.stream()
                .collect(java.util.stream.Collectors.groupingBy(
                        i -> i.getBrand().getName(), java.util.stream.Collectors.counting()));
        Map<String, Long> byPieceType = items.stream()
                .collect(java.util.stream.Collectors.groupingBy(
                        WardrobeItem::getPieceType, java.util.stream.Collectors.counting()));
        Map<String, Long> bySeason = items.stream()
                .collect(java.util.stream.Collectors.groupingBy(
                        i -> i.getMarket().getSeason(), java.util.stream.Collectors.counting()));
        return Map.of(
                "total_items", total,
                "by_brand", byBrand,
                "by_piece_type", byPieceType,
                "by_season", bySeason
        );
    }

    @Transactional
    public void retry3d(Long id) {
        WardrobeItem item = getEntityById(id);
        item.setModelStatus(ModelStatus.queued_base);
        wardrobeItemRepository.save(item);
        // TODO: publicar evento/job para worker 3D (RunPod/Meshy)
    }
}
