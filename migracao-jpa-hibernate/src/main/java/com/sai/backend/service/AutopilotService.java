package com.sai.backend.service;

import com.sai.backend.dto.request.DailyLookFeedbackRequest;
import com.sai.backend.dto.request.DailyLookRequest;
import com.sai.backend.dto.response.DailyLookResponse;
import com.sai.backend.entity.DailyLook;
import com.sai.backend.entity.Scheme;
import com.sai.backend.entity.User;
import com.sai.backend.entity.enums.DailyLookFeedback;
import com.sai.backend.entity.enums.Visibility;
import com.sai.backend.exception.ResourceNotFoundException;
import com.sai.backend.repository.DailyLookRepository;
import com.sai.backend.repository.SchemeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AutopilotService {

    private final DailyLookRepository dailyLookRepository;
    private final SchemeRepository schemeRepository;
    private final UserService userService;

    public List<DailyLookResponse> getHistory(Long userId, int limit) {
        return dailyLookRepository
                .findByUserUserIdOrderByCreatedAtDesc(userId, PageRequest.of(0, limit)).stream()
                .map(DailyLookResponse::from)
                .toList();
    }

    @Transactional
    public Map<String, Object> generateDailyLook(Long userId, DailyLookRequest req) {
        User user = userService.getEntityById(userId);

        // Busca os outfits públicos do usuário como sugestões base
        List<Scheme> schemes = schemeRepository.findByUserUserIdOrderByCreatedAtDesc(userId);
        if (schemes.isEmpty()) {
            return Map.of("suggestions", List.of(), "weather", Map.of());
        }

        // Filtra excluídos
        List<Long> excluded = req.getExcludeSchemeIds() != null ? req.getExcludeSchemeIds() : List.of();
        List<Scheme> candidates = schemes.stream()
                .filter(s -> !excluded.contains(s.getSchemeId()))
                .limit(3)
                .toList();

        // Salva o look diário gerado
        for (Scheme candidate : candidates) {
            DailyLook look = DailyLook.builder()
                    .user(user)
                    .scheme(candidate)
                    .occasion(req.getOccasion())
                    .mood(req.getMood())
                    .build();
            dailyLookRepository.save(look);
        }

        // TODO: integrar com API de clima (req.getCity()) e Gemini para ranqueamento
        List<Map<String, Object>> suggestions = candidates.stream()
                .map(s -> Map.<String, Object>of("scheme_id", s.getSchemeId(), "title", s.getTitle()))
                .toList();

        return Map.of("suggestions", suggestions, "weather", Map.of());
    }

    @Transactional
    public void giveFeedback(Long dailyLookId, DailyLookFeedbackRequest req) {
        DailyLook look = dailyLookRepository.findById(dailyLookId)
                .orElseThrow(() -> new ResourceNotFoundException("DailyLook not found: " + dailyLookId));
        look.setFeedback(DailyLookFeedback.valueOf(req.getFeedback()));
        dailyLookRepository.save(look);
    }

    @Transactional
    public void confirmLook(Long dailyLookId) {
        DailyLook look = dailyLookRepository.findById(dailyLookId)
                .orElseThrow(() -> new ResourceNotFoundException("DailyLook not found: " + dailyLookId));
        look.setConfirmed(true);
        dailyLookRepository.save(look);
    }
}
