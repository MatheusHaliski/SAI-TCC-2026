package com.sai.backend.service;

import com.sai.backend.dto.request.CreateSchemeRequest;
import com.sai.backend.dto.response.SchemeItemResponse;
import com.sai.backend.dto.response.SchemeResponse;
import com.sai.backend.entity.*;
import com.sai.backend.entity.enums.CreationMode;
import com.sai.backend.entity.enums.Slot;
import com.sai.backend.entity.enums.Visibility;
import com.sai.backend.exception.ResourceNotFoundException;
import com.sai.backend.repository.SchemeItemRepository;
import com.sai.backend.repository.SchemeRepository;
import com.sai.backend.repository.WardrobeItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SchemeService {

    private final SchemeRepository schemeRepository;
    private final SchemeItemRepository schemeItemRepository;
    private final WardrobeItemRepository wardrobeItemRepository;
    private final UserService userService;

    @Transactional
    public SchemeResponse create(Long userId, CreateSchemeRequest req) {
        User user = userService.getEntityById(userId);
        Scheme scheme = Scheme.builder()
                .user(user)
                .title(req.getTitle())
                .description(req.getDescription())
                .creationMode(CreationMode.valueOf(req.getCreationMode()))
                .style(req.getStyle())
                .occasion(req.getOccasion())
                .visibility(req.getVisibility() != null
                        ? Visibility.from(req.getVisibility())
                        : Visibility.private_v)
                .communityIndexed(req.getCommunityIndexed() != null ? req.getCommunityIndexed() : false)
                .coverImageUrl(req.getCoverImageUrl())
                .build();
        schemeRepository.save(scheme);

        List<SchemeItemResponse> itemResponses = new ArrayList<>();
        if (req.getItems() != null) {
            for (CreateSchemeRequest.SchemeItemInput input : req.getItems()) {
                WardrobeItem wi = wardrobeItemRepository.findById(input.getWardrobeItemId())
                        .orElseThrow(() -> new ResourceNotFoundException(
                                "WardrobeItem not found: " + input.getWardrobeItemId()));
                SchemeItem si = SchemeItem.builder()
                        .scheme(scheme)
                        .wardrobeItem(wi)
                        .slot(Slot.valueOf(input.getSlot()))
                        .sortOrder(input.getSortOrder())
                        .build();
                schemeItemRepository.save(si);
                itemResponses.add(SchemeItemResponse.from(si));
            }
        }
        return SchemeResponse.from(scheme, itemResponses);
    }

    public SchemeResponse getById(Long id) {
        Scheme scheme = schemeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Scheme not found: " + id));
        List<SchemeItemResponse> items = schemeItemRepository
                .findBySchemeSchemeIdOrderBySortOrderAsc(id).stream()
                .map(SchemeItemResponse::from)
                .toList();
        return SchemeResponse.from(scheme, items);
    }

    public List<SchemeResponse> listByUser(Long userId) {
        return schemeRepository.findByUserUserIdOrderByCreatedAtDesc(userId).stream()
                .map(s -> SchemeResponse.from(s, List.of()))
                .toList();
    }

    public List<SchemeResponse> listPublic() {
        return schemeRepository.findByVisibilityOrderByCreatedAtDesc(Visibility.public_v).stream()
                .map(s -> SchemeResponse.from(s, List.of()))
                .toList();
    }
}
