package com.sai.backend.repository;

import com.sai.backend.entity.Scheme;
import com.sai.backend.entity.enums.Visibility;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SchemeRepository extends JpaRepository<Scheme, Long> {

    List<Scheme> findByUserUserIdOrderByCreatedAtDesc(Long userId);

    List<Scheme> findByVisibilityOrderByCreatedAtDesc(Visibility visibility);
}
