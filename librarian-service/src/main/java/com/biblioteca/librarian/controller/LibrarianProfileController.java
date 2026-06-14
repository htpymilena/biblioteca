package com.biblioteca.librarian.controller;

import com.biblioteca.librarian.exception.ResourceNotFoundException;
import com.biblioteca.librarian.model.User;
import com.biblioteca.librarian.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/librarian/profile")
@RequiredArgsConstructor
public class LibrarianProfileController {

    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<User> getProfile(Authentication auth) {
        if (auth == null) {
            return ResponseEntity.status(401).build();
        }
        User user = userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new ResourceNotFoundException("Bibliotecário logado não encontrado no banco de dados."));
        return ResponseEntity.ok(user);
    }
}
