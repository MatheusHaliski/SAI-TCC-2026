package com.sai.backend.repository;

import com.sai.backend.entity.OutfitExport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OutfitExportRepository extends JpaRepository<OutfitExport, Long> {

    List<OutfitExport> findByUserUserIdOrderByCreatedAtDesc(Long userId);
}
