package com.biblioteca.librarian.service;

import com.biblioteca.librarian.config.audit.Auditable;
import com.biblioteca.librarian.exception.BusinessException;
import com.biblioteca.librarian.exception.ResourceNotFoundException;
import com.biblioteca.librarian.model.Book;
import com.biblioteca.librarian.repository.BookRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BookService {

    private final BookRepository bookRepository;

    public List<Book> getAllBooks() {
        return bookRepository.findAll();
    }

    public Book getBookById(Long id) {
        return bookRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Livro não encontrado com id: " + id));
    }

    @Auditable(action = "CRIAR_LIVRO")
    public Book createBook(Book book) {
        if (book.getAvailableCopies() > book.getTotalCopies()) {
            throw new BusinessException("Copias disponíveis não podem exceder o total de copias.");
        }
        return bookRepository.save(book);
    }

    @Auditable(action = "ATUALIZAR_LIVRO")
    public Book updateBook(Long id, Book bookDetails) {
        Book book = getBookById(id);
        book.setTitle(bookDetails.getTitle());
        book.setAuthor(bookDetails.getAuthor());
        book.setIsbn(bookDetails.getIsbn());
        if (bookDetails.getTotalCopies() < book.getTotalCopies() - book.getAvailableCopies()) {
            throw new BusinessException("Total de copias não pode ser menor do que o número de livros atualmente emprestados.");
        }
        int borrowed = book.getTotalCopies() - book.getAvailableCopies();
        book.setTotalCopies(bookDetails.getTotalCopies());
        book.setAvailableCopies(bookDetails.getTotalCopies() - borrowed);
        return bookRepository.save(book);
    }

    @Auditable(action = "DELETAR_LIVRO")
    public void deleteBook(Long id) {
        Book book = getBookById(id);
        int borrowed = book.getTotalCopies() - book.getAvailableCopies();
        if (borrowed > 0) {
            throw new BusinessException("Não é possível deletar um livro que possui exemplares emprestados.");
        }
        bookRepository.delete(book);
    }
}
