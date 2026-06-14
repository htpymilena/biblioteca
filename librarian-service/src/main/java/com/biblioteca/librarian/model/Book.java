package com.biblioteca.librarian.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "books")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Book {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String author;

    @Column(unique = true)
    private String isbn;

    private int totalCopies;
    private int availableCopies;

    private Integer publicationYear;
    
    private String publisher;

    @Enumerated(EnumType.STRING)
    private Genre genre;

    private Integer pageCount;

    @Column(columnDefinition = "TEXT")
    private String synopsis;
}
