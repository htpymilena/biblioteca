package com.biblioteca.user.controller;

import com.biblioteca.user.dto.LoanRequest;
import com.biblioteca.user.exception.ResourceNotFoundException;
import com.biblioteca.user.model.Loan;
import com.biblioteca.user.model.User;
import com.biblioteca.user.repository.UserRepository;
import com.biblioteca.user.service.LoanService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users/loans")
@RequiredArgsConstructor
public class LoanController {

    private final LoanService loanService;
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<Loan>> getMyLoans(Authentication auth) {
        if (auth == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        User user = userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new ResourceNotFoundException("Usuário logado não encontrado."));
        return ResponseEntity.ok(loanService.getAllLoansByUser(user));
    }

    @PostMapping
    public ResponseEntity<Loan> createLoan(Authentication auth, @RequestBody @Valid LoanRequest req) {
        if (auth == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        User user = userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new ResourceNotFoundException("Usuário logado não encontrado."));

        return ResponseEntity.status(HttpStatus.CREATED).body(loanService.createLoan(user, req.getBookId()));
    }

    @PostMapping("/{id}/return")
    public ResponseEntity<Loan> returnLoan(@PathVariable Long id) {
        return ResponseEntity.ok(loanService.returnLoan(id));
    }
}
