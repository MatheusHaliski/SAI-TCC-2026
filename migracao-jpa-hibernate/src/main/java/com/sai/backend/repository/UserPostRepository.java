package com.sai.backend.repository;

import com.sai.backend.entity.UserPost;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserPostRepository extends JpaRepository<UserPost, Long> {

    List<UserPost> findByUserUserIdOrderByCreatedAtDesc(Long userId);
}
