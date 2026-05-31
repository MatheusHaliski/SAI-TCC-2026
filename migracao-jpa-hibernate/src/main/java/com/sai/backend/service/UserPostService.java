package com.sai.backend.service;

import com.sai.backend.dto.request.CreateUserPostRequest;
import com.sai.backend.entity.*;
import com.sai.backend.repository.SchemeRepository;
import com.sai.backend.repository.UserPostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserPostService {

    private final UserPostRepository postRepository;
    private final SchemeRepository schemeRepository;
    private final UserService userService;

    public List<UserPost> listByUser(Long userId) {
        return postRepository.findByUserUserIdOrderByCreatedAtDesc(userId);
    }

    @Transactional
    public UserPost create(Long userId, CreateUserPostRequest req) {
        User user = userService.getEntityById(userId);
        Scheme scheme = req.getSchemeId() != null
                ? schemeRepository.findById(req.getSchemeId()).orElse(null)
                : null;
        String platformsJson = req.getPlatforms() != null
                ? String.join(",", req.getPlatforms())
                : null;
        UserPost post = UserPost.builder()
                .user(user)
                .scheme(scheme)
                .outfitId(req.getOutfitId())
                .title(req.getTitle())
                .caption(req.getCaption())
                .platforms(platformsJson)
                .primaryPlatform(req.getPrimaryPlatform())
                .visibility(req.getVisibility() != null ? req.getVisibility() : "private")
                .previewImageUrl(req.getPreviewImageUrl())
                .build();
        return postRepository.save(post);
    }
}
