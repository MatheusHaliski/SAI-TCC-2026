package com.sai.backend.service;

import com.sai.backend.dto.request.LoginRequest;
import com.sai.backend.dto.request.SignupRequest;
import com.sai.backend.dto.response.AuthResponse;
import com.sai.backend.dto.response.UserResponse;
import com.sai.backend.entity.User;
import com.sai.backend.exception.UnauthorizedException;
import com.sai.backend.repository.UserRepository;
import com.sai.backend.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;

    @Transactional
    public AuthResponse signup(SignupRequest req) {
        if (userRepository.existsByEmail(req.getEmail())) {
            throw new IllegalArgumentException("Email already in use");
        }
        User user = User.builder()
                .name(req.getName())
                .email(req.getEmail())
                .passwordHash(passwordEncoder.encode(req.getPassword()))
                .photoUrl(req.getPhotoUrl())
                .build();
        userRepository.save(user);
        String token = tokenProvider.generateToken(user.getUserId(), user.getEmail());
        return AuthResponse.builder()
                .ok(true)
                .token(token)
                .profile(UserResponse.from(user))
                .build();
    }

    public AuthResponse login(LoginRequest req) {
        User user = userRepository.findByEmail(req.getEmail())
                .orElseThrow(() -> new UnauthorizedException("Invalid credentials"));
        if (!passwordEncoder.matches(req.getPassword(), user.getPasswordHash())) {
            throw new UnauthorizedException("Invalid credentials");
        }
        String token = tokenProvider.generateToken(user.getUserId(), user.getEmail());
        return AuthResponse.builder()
                .ok(true)
                .token(token)
                .profile(UserResponse.from(user))
                .build();
    }
}
