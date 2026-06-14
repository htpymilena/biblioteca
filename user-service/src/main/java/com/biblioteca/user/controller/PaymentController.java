package com.biblioteca.user.controller;

import com.biblioteca.user.dto.PaymentRequest;
import com.biblioteca.user.model.Loan;
import com.biblioteca.user.service.LoanService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final LoanService loanService;

    @PostMapping("/simulate")
    public ResponseEntity<Loan> simulatePayment(@RequestBody @Valid PaymentRequest req) {
        Loan loan = loanService.payPenalty(req.getLoanId(), req.getAmount());
        return ResponseEntity.ok(loan);
    }
}
