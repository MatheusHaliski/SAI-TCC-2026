package com.sai.backend.repository;

import com.sai.backend.entity.DailyLook;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DailyLookRepository extends JpaRepository<DailyLook, Long> {

    List<DailyLook> findByUserUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);
}
