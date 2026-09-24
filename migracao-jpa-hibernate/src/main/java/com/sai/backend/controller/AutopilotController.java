package com.sai.backend.controller;

import com.sai.backend.dto.request.DailyLookFeedbackRequest;
import com.sai.backend.dto.request.DailyLookRequest;
import com.sai.backend.dto.response.DailyLookResponse;
import com.sai.backend.service.AutopilotService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/autopilot")
@RequiredArgsConstructor
public class AutopilotController {

    private final AutopilotService autopilotService;

    // GET /api/autopilot/daily?limit=10
    @GetMapping("/daily")
    public ResponseEntity<Map<String, Object>> getDailyHistory(
            @AuthenticationPrincipal UserDetails principal,
            @RequestParam(defaultValue = "10") int limit) {
        Long userId = Long.valueOf(principal.getUsername());
        List<DailyLookResponse> looks = autopilotService.getHistory(userId, limit);
        return ResponseEntity.ok(Map.of("looks", looks));
    }

    // POST /api/autopilot/daily
    @PostMapping("/daily")
    public ResponseEntity<Map<String, Object>> generateDailyLook(
            @AuthenticationPrincipal UserDetails principal,
            @Valid @RequestBody DailyLookRequest req) {
        Long userId = Long.valueOf(principal.getUsername());
        return ResponseEntity.ok(autopilotService.generateDailyLook(userId, req));
    }

    // POST /api/autopilot/daily/{id}/feedback
    @PostMapping("/daily/{id}/feedback")
    public ResponseEntity<Map<String, Object>> giveFeedback(
            @PathVariable Long id,
            @Valid @RequestBody DailyLookFeedbackRequest req) {
        autopilotService.giveFeedback(id, req);
        return ResponseEntity.ok(Map.of("ok", true));
    }

    // POST /api/autopilot/daily/confirm
    @PostMapping("/daily/confirm")
    public ResponseEntity<Map<String, Object>> confirm(@RequestBody Map<String, Long> body) {
        autopilotService.confirmLook(body.get("daily_look_id"));
        return ResponseEntity.ok(Map.of("ok", true));
    }
}
