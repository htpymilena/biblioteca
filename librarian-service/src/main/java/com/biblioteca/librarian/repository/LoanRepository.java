package com.biblioteca.librarian.repository;

import com.biblioteca.librarian.model.Loan;
import com.biblioteca.librarian.model.LoanStatus;
import com.biblioteca.librarian.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface LoanRepository extends JpaRepository<Loan, Long> {
    List<Loan> findByUserAndStatus(User user, LoanStatus status);
    long countByUserAndStatus(User user, LoanStatus status);
}
