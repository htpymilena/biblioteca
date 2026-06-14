package com.biblioteca.user.repository;

import com.biblioteca.user.model.StockNotification;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface StockNotificationRepository extends JpaRepository<StockNotification, Long> {
    List<StockNotification> findByBookIdAndNotifiedFalse(Long bookId);
}
