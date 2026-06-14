package com.biblioteca.librarian.service;

import com.biblioteca.librarian.model.Loan;
import com.biblioteca.librarian.repository.LoanRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LibrarianLoanService {

    private final LoanRepository loanRepository;

    public List<Loan> getLoanHistory() {
        return loanRepository.findAll();
    }
}
