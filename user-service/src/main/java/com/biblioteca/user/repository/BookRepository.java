package com.biblioteca.user.repository;

import com.biblioteca.user.model.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BookRepository extends JpaRepository<Book, Long> {
    List<Book> findByAvailableCopiesGreaterThan(int copies);
    boolean existsByIsbn(String isbn);
}
