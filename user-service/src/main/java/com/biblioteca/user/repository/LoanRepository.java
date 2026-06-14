package com.biblioteca.user.repository;

import com.biblioteca.user.model.Loan;
import com.biblioteca.user.model.LoanStatus;
import com.biblioteca.user.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface LoanRepository extends JpaRepository<Loan, Long> {
    List<Loan> findByUser(User user);
    List<Loan> findByUserAndStatus(User user, LoanStatus status);
    long countByUserAndStatus(User user, LoanStatus status);
}
