package com.sai.backend.controller;

import com.sai.backend.dto.request.LoginRequest;
import com.sai.backend.dto.request.SignupRequest;
import com.sai.backend.dto.response.AuthResponse;
import com.sai.backend.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    // POST /api/signup
    @PostMapping("/api/signup")
    public ResponseEntity<AuthResponse> signup(@Valid @RequestBody SignupRequest req) {
        return ResponseEntity.ok(authService.signup(req));
    }

    // POST /api/auth/verify  (login)
    @PostMapping("/api/auth/verify")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest req) {
        return ResponseEntity.ok(authService.login(req));
    }

    // POST /api/auth/reset  (stub — integrar com provedor de email)
    @PostMapping("/api/auth/reset")
    public ResponseEntity<?> resetPassword(@RequestBody java.util.Map<String, String> body) {
        // TODO: enviar email de redefinição de senha
        return ResponseEntity.ok(java.util.Map.of("ok", true));
    }
}
