package com.sai.backend.repository;

import com.sai.backend.entity.PieceLike;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PieceLikeRepository extends JpaRepository<PieceLike, Long> {

    Optional<PieceLike> findByWardrobeItemWardrobeItemIdAndUserUserId(Long wardrobeItemId, Long userId);

    long countByWardrobeItemWardrobeItemId(Long wardrobeItemId);

    boolean existsByWardrobeItemWardrobeItemIdAndUserUserId(Long wardrobeItemId, Long userId);
}
