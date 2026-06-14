package com.biblioteca.user.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class NotificationRequest {

    @NotNull(message = "ID do livro é obrigatório")
    private Long bookId;
}
