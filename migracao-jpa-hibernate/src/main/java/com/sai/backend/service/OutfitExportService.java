package com.sai.backend.service;

import com.sai.backend.dto.request.CreateOutfitExportRequest;
import com.sai.backend.dto.request.OutfitFavoriteRequest;
import com.sai.backend.entity.*;
import com.sai.backend.exception.ResourceNotFoundException;
import com.sai.backend.repository.OutfitExportRepository;
import com.sai.backend.repository.OutfitFavoriteRepository;
import com.sai.backend.repository.SchemeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class OutfitExportService {

    private final OutfitExportRepository exportRepository;
    private final OutfitFavoriteRepository favoriteRepository;
    private final SchemeRepository schemeRepository;
    private final UserService userService;

    public List<OutfitExport> listExports(Long userId) {
        return exportRepository.findByUserUserIdOrderByCreatedAtDesc(userId);
    }

    @Transactional
    public OutfitExport createExport(Long userId, CreateOutfitExportRequest req) {
        User user = userService.getEntityById(userId);
        Scheme scheme = req.getSchemeId() != null
                ? schemeRepository.findById(req.getSchemeId()).orElse(null)
                : null;
        OutfitExport export = OutfitExport.builder()
                .user(user)
                .scheme(scheme)
                .outfitId(req.getOutfitId())
                .platform(req.getPlatform())
                .format(req.getFormat())
                .exportMode(req.getExportMode())
                .caption(req.getCaption())
                .sourceImageUrl(req.getSourceImageUrl())
                .build();
        return exportRepository.save(export);
    }

    @Transactional
    public Map<String, Object> toggleFavorite(Long userId, OutfitFavoriteRequest req) {
        Scheme scheme = schemeRepository.findById(req.getSchemeId())
                .orElseThrow(() -> new ResourceNotFoundException("Scheme not found: " + req.getSchemeId()));
        User user = userService.getEntityById(userId);

        favoriteRepository.findByUserUserIdAndSchemeSchemeId(userId, req.getSchemeId())
                .ifPresent(favoriteRepository::delete);

        if (Boolean.TRUE.equals(req.getFavorite())) {
            OutfitFavorite fav = OutfitFavorite.builder().user(user).scheme(scheme).build();
            favoriteRepository.save(fav);
        }
        return Map.of("ok", true, "favorite", req.getFavorite());
    }

    public List<OutfitFavorite> listFavorites(Long userId) {
        return favoriteRepository.findByUserUserIdOrderByCreatedAtDesc(userId);
    }
}
