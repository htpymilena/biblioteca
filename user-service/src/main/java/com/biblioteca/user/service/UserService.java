package com.biblioteca.user.service;

import com.biblioteca.user.config.audit.Auditable;
import com.biblioteca.user.config.security.JwtUtil;
import com.biblioteca.user.dto.LoginRequest;
import com.biblioteca.user.dto.RegisterRequest;
import com.biblioteca.user.exception.BusinessException;
import com.biblioteca.user.exception.ResourceNotFoundException;
import com.biblioteca.user.model.Role;
import com.biblioteca.user.model.User;
import com.biblioteca.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public void register(RegisterRequest req) {
        if (userRepository.existsByEmail(req.getEmail())) {
            throw new BusinessException("E-mail já cadastrado.");
        }
        User user = new User();
        user.setName(req.getName());
        user.setEmail(req.getEmail());
        user.setPasswordHash(passwordEncoder.encode(req.getPassword()));
        user.setRole(Role.USER);
        userRepository.save(user);
    }

    public Map<String, String> login(LoginRequest req) {
        User user = userRepository.findByEmail(req.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado."));

        if (!passwordEncoder.matches(req.getPassword(), user.getPasswordHash())) {
            throw new BusinessException("Credenciais inválidas.");
        }

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name());
        return Map.of("token", token);
    }

    public User getProfile(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Perfil não encontrado para o email: " + email));
    }

    @Auditable(action = "ATUALIZAR_PERFIL")
    public User updateProfile(String email, RegisterRequest req) {
        User user = getProfile(email);
        user.setName(req.getName());
        if (!user.getEmail().equalsIgnoreCase(req.getEmail()) && userRepository.existsByEmail(req.getEmail())) {
            throw new BusinessException("E-mail já está sendo usado por outra conta.");
        }
        user.setEmail(req.getEmail());
        if (req.getPassword() != null && !req.getPassword().isBlank()) {
            user.setPasswordHash(passwordEncoder.encode(req.getPassword()));
        }
        return userRepository.save(user);
    }
}
