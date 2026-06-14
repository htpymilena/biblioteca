package com.biblioteca.user.controller;

import com.biblioteca.user.exception.ResourceNotFoundException;
import com.biblioteca.user.model.Book;
import com.biblioteca.user.repository.BookRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/users/catalog")
@RequiredArgsConstructor
public class CatalogController {

    private final BookRepository bookRepository;

    @GetMapping
    public ResponseEntity<List<Book>> getCatalog() {
        return ResponseEntity.ok(bookRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Book> getBookById(@PathVariable Long id) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Livro não encontrado com id: " + id));
        return ResponseEntity.ok(book);
    }
}
