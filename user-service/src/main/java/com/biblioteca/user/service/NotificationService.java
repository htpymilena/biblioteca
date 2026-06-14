package com.biblioteca.user.service;

import com.biblioteca.user.config.audit.Auditable;
import com.biblioteca.user.exception.BusinessException;
import com.biblioteca.user.exception.ResourceNotFoundException;
import com.biblioteca.user.model.Book;
import com.biblioteca.user.model.StockNotification;
import com.biblioteca.user.model.User;
import com.biblioteca.user.repository.BookRepository;
import com.biblioteca.user.repository.StockNotificationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {

    private final StockNotificationRepository stockNotificationRepository;
    private final BookRepository bookRepository;

    @Auditable(action = "SOLICITAR_NOTIFICACAO_ESTOQUE")
    public StockNotification requestNotification(User user, Long bookId) {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new ResourceNotFoundException("Livro não encontrado."));

        if (book.getAvailableCopies() > 0) {
            throw new BusinessException("O livro possui exemplares disponíveis. Não é necessário solicitar notificação.");
        }

        StockNotification notification = new StockNotification();
        notification.setUserId(user.getId());
        notification.setUserEmail(user.getEmail());
        notification.setBookId(bookId);
        notification.setNotified(false);

        return stockNotificationRepository.save(notification);
    }

    public void notifyUsersForBook(Long bookId) {
        List<StockNotification> pending = stockNotificationRepository.findByBookIdAndNotifiedFalse(bookId);
        if (!pending.isEmpty()) {
            Book book = bookRepository.findById(bookId).orElse(null);
            String title = book != null ? book.getTitle() : "Livro ID " + bookId;

            for (StockNotification notification : pending) {
                log.info("📧 NOTIFICAÇÃO ENVIADA para {}: O livro '{}' voltou a ter estoque disponível!",
                        notification.getUserEmail(), title);
                notification.setNotified(true);
            }
            stockNotificationRepository.saveAll(pending);
        }
    }
}
