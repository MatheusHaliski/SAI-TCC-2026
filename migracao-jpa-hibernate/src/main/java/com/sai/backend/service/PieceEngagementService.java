package com.sai.backend.service;

import com.sai.backend.dto.response.PieceStatsResponse;
import com.sai.backend.entity.PieceLike;
import com.sai.backend.entity.PieceRating;
import com.sai.backend.entity.User;
import com.sai.backend.entity.WardrobeItem;
import com.sai.backend.repository.PieceLikeRepository;
import com.sai.backend.repository.PieceRatingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class PieceEngagementService {

    private final PieceLikeRepository likeRepository;
    private final PieceRatingRepository ratingRepository;
    private final WardrobeItemService wardrobeItemService;
    private final UserService userService;

    @Transactional
    public Map<String, Object> toggleLike(Long wardrobeItemId, Long userId, boolean liked) {
        WardrobeItem item = wardrobeItemService.getEntityById(wardrobeItemId);
        User user = userService.getEntityById(userId);

        likeRepository.findByWardrobeItemWardrobeItemIdAndUserUserId(wardrobeItemId, userId)
                .ifPresent(likeRepository::delete);

        if (liked) {
            PieceLike like = PieceLike.builder().wardrobeItem(item).user(user).build();
            likeRepository.save(like);
        }
        return Map.of("ok", true, "liked", liked);
    }

    @Transactional
    public Map<String, Object> rate(Long wardrobeItemId, Long userId, int stars) {
        WardrobeItem item = wardrobeItemService.getEntityById(wardrobeItemId);
        User user = userService.getEntityById(userId);

        PieceRating rating = ratingRepository
                .findByWardrobeItemWardrobeItemIdAndUserUserId(wardrobeItemId, userId)
                .orElse(PieceRating.builder().wardrobeItem(item).user(user).build());
        rating.setStars(stars);
        ratingRepository.save(rating);

        double avg = ratingRepository.findAvgRatingByWardrobeItemId(wardrobeItemId).orElse(0.0);
        long count = ratingRepository.countByWardrobeItemWardrobeItemId(wardrobeItemId);
        return Map.of("ok", true, "stars", stars, "avg_rating", avg, "rating_count", count);
    }

    public PieceStatsResponse getStats(Long wardrobeItemId, Long userId) {
        long likeCount = likeRepository.countByWardrobeItemWardrobeItemId(wardrobeItemId);
        double avg = ratingRepository.findAvgRatingByWardrobeItemId(wardrobeItemId).orElse(0.0);
        long ratingCount = ratingRepository.countByWardrobeItemWardrobeItemId(wardrobeItemId);

        boolean userHasLiked = userId != null &&
                likeRepository.existsByWardrobeItemWardrobeItemIdAndUserUserId(wardrobeItemId, userId);
        Integer userRating = null;
        if (userId != null) {
            userRating = ratingRepository
                    .findByWardrobeItemWardrobeItemIdAndUserUserId(wardrobeItemId, userId)
                    .map(PieceRating::getStars)
                    .orElse(null);
        }
        return PieceStatsResponse.builder()
                .ok(true)
                .likeCount(likeCount)
                .avgRating(avg)
                .ratingCount(ratingCount)
                .userHasLiked(userHasLiked)
                .userRating(userRating)
                .build();
    }
}
