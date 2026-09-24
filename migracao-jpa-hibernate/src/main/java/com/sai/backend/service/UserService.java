package com.sai.backend.service;

import com.sai.backend.dto.request.UpdateUserRequest;
import com.sai.backend.dto.response.UserResponse;
import com.sai.backend.entity.User;
import com.sai.backend.exception.ResourceNotFoundException;
import com.sai.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public UserResponse getById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + id));
        return UserResponse.from(user);
    }

    public User getEntityById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + id));
    }

    @Transactional
    public UserResponse update(Long id, UpdateUserRequest req) {
        User user = getEntityById(id);
        if (req.getName() != null) user.setName(req.getName());
        if (req.getUsername() != null) user.setUsername(req.getUsername());
        if (req.getBio() != null) user.setBio(req.getBio());
        if (req.getPhotoUrl() != null) user.setPhotoUrl(req.getPhotoUrl());
        return UserResponse.from(userRepository.save(user));
    }

    @Transactional
    public void delete(Long id) {
        if (!userRepository.existsById(id)) {
            throw new ResourceNotFoundException("User not found: " + id);
        }
        userRepository.deleteById(id);
    }

    public List<UserResponse> listPublic() {
        return userRepository.findFirst50().stream()
                .limit(50)
                .map(UserResponse::from)
                .toList();
    }
}
