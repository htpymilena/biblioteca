package com.biblioteca.librarian.controller;

import com.biblioteca.librarian.model.Loan;
import com.biblioteca.librarian.service.LibrarianLoanService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/librarian/loans/history")
@RequiredArgsConstructor
public class LibrarianLoanController {

    private final LibrarianLoanService librarianLoanService;

    @GetMapping
    public ResponseEntity<List<Loan>> getLoanHistory() {
        return ResponseEntity.ok(librarianLoanService.getLoanHistory());
    }
}
