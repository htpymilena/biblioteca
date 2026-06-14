package com.biblioteca.user.service;

import com.biblioteca.user.config.audit.Auditable;
import com.biblioteca.user.exception.BusinessException;
import com.biblioteca.user.exception.ResourceNotFoundException;
import com.biblioteca.user.model.Book;
import com.biblioteca.user.model.Loan;
import com.biblioteca.user.model.LoanStatus;
import com.biblioteca.user.model.User;
import com.biblioteca.user.repository.BookRepository;
import com.biblioteca.user.repository.LoanRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class LoanService {

    private final LoanRepository loanRepository;
    private final BookRepository bookRepository;
    private final PenaltyCalculationService penaltyCalculationService;
    private final NotificationService notificationService;

    private static final int MAX_LOANS = 3;

    public List<Loan> getActiveLoansByUser(User user) {
        return loanRepository.findByUserAndStatus(user, LoanStatus.ACTIVE);
    }

    @Auditable(action = "REALIZAR_EMPRESTIMO")
    public Loan createLoan(User user, Long bookId) {
        // Limit of 3 active or overdue loans
        long activeLoans = loanRepository.countByUserAndStatus(user, LoanStatus.ACTIVE);
        long overdueLoans = loanRepository.countByUserAndStatus(user, LoanStatus.OVERDUE);
        if ((activeLoans + overdueLoans) >= MAX_LOANS) {
            throw new BusinessException("Limite de " + MAX_LOANS + " empréstimos simultâneos atingido.");
        }

        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new ResourceNotFoundException("Livro não encontrado."));

        if (book.getAvailableCopies() <= 0) {
            throw new BusinessException("Nenhum exemplar disponível para empréstimo.");
        }

        book.setAvailableCopies(book.getAvailableCopies() - 1);
        bookRepository.save(book);

        Loan loan = new Loan();
        loan.setUser(user);
        loan.setBook(book);
        loan.setLoanDate(LocalDate.now());
        loan.setDueDate(LocalDate.now().plusDays(14));
        loan.setStatus(LoanStatus.ACTIVE);

        return loanRepository.save(loan);
    }

    @Auditable(action = "REGISTRAR_DEVOLUCAO")
    public Loan returnLoan(Long id) {
        Loan loan = loanRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Empréstimo não encontrado com id: " + id));

        if (loan.getStatus() == LoanStatus.RETURNED) {
            throw new BusinessException("Livro já foi devolvido.");
        }

        LocalDate today = LocalDate.now();
        loan.setReturnDate(today);

        BigDecimal penalty = penaltyCalculationService.calculatePenalty(loan.getDueDate(), today);

        // Update book stock
        Book book = loan.getBook();
        book.setAvailableCopies(book.getAvailableCopies() + 1);
        bookRepository.save(book);

        // Notify users waiting for this book
        notificationService.notifyUsersForBook(book.getId());

        if (penalty.compareTo(BigDecimal.ZERO) > 0) {
            loan.setStatus(LoanStatus.OVERDUE); // remains overdue until penalty is paid
        } else {
            loan.setStatus(LoanStatus.RETURNED);
        }

        return loanRepository.save(loan);
    }

    @Auditable(action = "PAGAR_MULTA")
    public Loan payPenalty(Long loanId, BigDecimal amount) {
        Loan loan = loanRepository.findById(loanId)
                .orElseThrow(() -> new ResourceNotFoundException("Empréstimo não encontrado com id: " + loanId));

        if (loan.getStatus() != LoanStatus.OVERDUE) {
            throw new BusinessException("Este empréstimo não possui multas pendentes.");
        }

        BigDecimal expectedPenalty = penaltyCalculationService.calculatePenalty(loan.getDueDate(), loan.getReturnDate());
        if (amount.compareTo(expectedPenalty) < 0) {
            throw new BusinessException("O valor pago de R$ " + amount + " é menor do que a multa de R$ " + expectedPenalty);
        }

        loan.setStatus(LoanStatus.RETURNED);
        return loanRepository.save(loan);
    }
}
