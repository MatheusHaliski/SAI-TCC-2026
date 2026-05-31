package com.sai.backend.repository;

import com.sai.backend.entity.OutfitFavorite;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OutfitFavoriteRepository extends JpaRepository<OutfitFavorite, Long> {

    Optional<OutfitFavorite> findByUserUserIdAndSchemeSchemeId(Long userId, Long schemeId);

    List<OutfitFavorite> findByUserUserIdOrderByCreatedAtDesc(Long userId);

    boolean existsByUserUserIdAndSchemeSchemeId(Long userId, Long schemeId);
}
