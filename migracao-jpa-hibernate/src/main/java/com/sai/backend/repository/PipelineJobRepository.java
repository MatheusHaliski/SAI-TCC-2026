package com.sai.backend.repository;

import com.sai.backend.entity.PipelineJob;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PipelineJobRepository extends JpaRepository<PipelineJob, Long> {

    Optional<PipelineJob> findByRunpodJobId(String runpodJobId);

    List<PipelineJob> findByWardrobeItemWardrobeItemIdOrderByCreatedAtDesc(Long wardrobeItemId);

    List<PipelineJob> findByStatus(String status);
}
