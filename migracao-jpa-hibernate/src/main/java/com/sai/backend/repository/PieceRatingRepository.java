package com.sai.backend.repository;

import com.sai.backend.entity.PieceRating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PieceRatingRepository extends JpaRepository<PieceRating, Long> {

    Optional<PieceRating> findByWardrobeItemWardrobeItemIdAndUserUserId(Long wardrobeItemId, Long userId);

    @Query("SELECT AVG(r.stars) FROM PieceRating r WHERE r.wardrobeItem.wardrobeItemId = :id")
    Optional<Double> findAvgRatingByWardrobeItemId(@Param("id") Long wardrobeItemId);

    long countByWardrobeItemWardrobeItemId(Long wardrobeItemId);
}
