package com.sai.backend.repository;

import com.sai.backend.entity.PieceItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PieceItemRepository extends JpaRepository<PieceItem, Long> {

    @Query("""
        SELECT p FROM PieceItem p
        WHERE p.isActive = true
          AND (:season IS NULL OR p.market.season = :season)
          AND (:gender IS NULL OR p.market.gender = :gender)
          AND (:brandId IS NULL OR p.brand.brandId = :brandId)
          AND (:pieceType IS NULL OR p.pieceType = :pieceType)
        """)
    List<PieceItem> search(
            @Param("season") String season,
            @Param("gender") String gender,
            @Param("brandId") Long brandId,
            @Param("pieceType") String pieceType
    );
}
