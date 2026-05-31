package com.sai.backend.controller;

import com.sai.backend.service.Pipeline3DService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/3d-worker")
@RequiredArgsConstructor
public class Pipeline3DController {

    private final Pipeline3DService pipeline3DService;

    // POST /api/3d-worker/submit
    @PostMapping("/submit")
    public ResponseEntity<Map<String, Object>> submit(@RequestBody Map<String, Object> body) {
        Long pieceId = Long.valueOf(body.get("pieceId").toString());
        String imageUrl = (String) body.get("imageUrl");
        String jobType = (String) body.getOrDefault("jobType", "base_3d");
        String provider = (String) body.getOrDefault("provider", "runpod");
        return ResponseEntity.ok(pipeline3DService.submitJob(pieceId, imageUrl, jobType, provider));
    }

    // GET /api/3d-worker/status?pieceId=
    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> getStatus(@RequestParam Long pieceId) {
        return ResponseEntity.ok(pipeline3DService.getJobStatus(pieceId));
    }

    // POST /api/3d-worker/reconcile
    @PostMapping("/reconcile")
    public ResponseEntity<Map<String, Object>> reconcile(@RequestBody Map<String, Object> body) {
        Long pieceId = Long.valueOf(body.get("pieceId").toString());
        String jobId = (String) body.get("jobId");
        return ResponseEntity.ok(pipeline3DService.reconcileJob(pieceId, jobId));
    }

    // GET /api/3d-worker/diagnostics
    @GetMapping("/diagnostics")
    public ResponseEntity<Map<String, Object>> diagnostics() {
        return ResponseEntity.ok(Map.of("ok", true, "status", "healthy"));
    }
}
