package com.sai.backend.repository;

import com.sai.backend.entity.WardrobeItem;
import com.sai.backend.entity.enums.ModelStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WardrobeItemRepository extends JpaRepository<WardrobeItem, Long> {

    Page<WardrobeItem> findByUserUserId(Long userId, Pageable pageable);

    @Query("""
        SELECT w FROM WardrobeItem w
        WHERE w.user.userId = :userId
          AND (:pieceType IS NULL OR w.pieceType = :pieceType)
        ORDER BY w.createdAt DESC
        """)
    Page<WardrobeItem> findByUserAndFilters(
            @Param("userId") Long userId,
            @Param("pieceType") String pieceType,
            Pageable pageable
    );

    List<WardrobeItem> findByModelStatus(ModelStatus modelStatus);

    @Query("""
        SELECT w FROM WardrobeItem w
        WHERE w.modelStatus IN :statuses
        ORDER BY w.createdAt ASC
        """)
    List<WardrobeItem> findByModelStatusIn(@Param("statuses") List<ModelStatus> statuses);

    @Query("""
        SELECT w FROM WardrobeItem w
        WHERE (:brandId IS NULL OR w.brand.brandId = :brandId)
          AND (:marketId IS NULL OR w.market.marketId = :marketId)
          AND (:gender IS NULL OR w.market.gender = :gender)
        ORDER BY w.createdAt DESC
        """)
    Page<WardrobeItem> findDiscoverable(
            @Param("brandId") Long brandId,
            @Param("marketId") Long marketId,
            @Param("gender") String gender,
            Pageable pageable
    );
}
