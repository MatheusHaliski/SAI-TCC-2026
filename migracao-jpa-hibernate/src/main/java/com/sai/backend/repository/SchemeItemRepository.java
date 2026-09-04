package com.sai.backend.repository;

import com.sai.backend.entity.SchemeItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SchemeItemRepository extends JpaRepository<SchemeItem, Long> {

    List<SchemeItem> findBySchemeSchemeIdOrderBySortOrderAsc(Long schemeId);

    void deleteBySchemeSchemeId(Long schemeId);
}
