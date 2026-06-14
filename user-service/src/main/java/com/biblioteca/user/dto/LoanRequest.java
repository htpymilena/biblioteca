package com.biblioteca.user.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class LoanRequest {

    @NotNull(message = "ID do livro é obrigatório")
    private Long bookId;
}
