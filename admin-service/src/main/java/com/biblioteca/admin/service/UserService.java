package com.biblioteca.admin.service;

import com.biblioteca.admin.config.audit.Auditable;
import com.biblioteca.admin.exception.BusinessException;
import com.biblioteca.admin.exception.ResourceNotFoundException;
import com.biblioteca.admin.model.User;
import com.biblioteca.admin.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Auditable(action = "CRIAR_USUARIO")
    public User createUser(User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new BusinessException("E-mail já cadastrado: " + user.getEmail());
        }
        user.setPasswordHash(passwordEncoder.encode(user.getPasswordHash()));
        return userRepository.save(user);
    }

    @Auditable(action = "ATUALIZAR_USUARIO")
    public User updateUser(Long id, User userDetails) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado com id: " + id));

        user.setName(userDetails.getName());
        if (!user.getEmail().equalsIgnoreCase(userDetails.getEmail()) && userRepository.existsByEmail(userDetails.getEmail())) {
            throw new BusinessException("E-mail já cadastrado por outro usuário: " + userDetails.getEmail());
        }
        user.setEmail(userDetails.getEmail());
        if (userDetails.getPasswordHash() != null && !userDetails.getPasswordHash().isEmpty()) {
            user.setPasswordHash(passwordEncoder.encode(userDetails.getPasswordHash()));
        }
        user.setRole(userDetails.getRole());
        return userRepository.save(user);
    }

    @Auditable(action = "REMOVER_USUARIO")
    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new ResourceNotFoundException("Usuário não encontrado com id: " + id);
        }
        userRepository.deleteById(id);
    }
}
