package com.biblioteca.user.controller;

import com.biblioteca.user.dto.NotificationRequest;
import com.biblioteca.user.exception.ResourceNotFoundException;
import com.biblioteca.user.model.StockNotification;
import com.biblioteca.user.model.User;
import com.biblioteca.user.repository.UserRepository;
import com.biblioteca.user.service.NotificationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;
    private final UserRepository userRepository;

    @PostMapping("/request")
    public ResponseEntity<StockNotification> requestNotification(Authentication auth, @RequestBody @Valid NotificationRequest req) {
        if (auth == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        User user = userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new ResourceNotFoundException("Usuário logado não encontrado."));

        return ResponseEntity.status(HttpStatus.CREATED).body(notificationService.requestNotification(user, req.getBookId()));
    }
}
