package com.biblioteca.user.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginRequest {

    @NotBlank(message = "E-mail não pode estar em branco")
    @Email(message = "E-mail inválido")
    private String email;

    @NotBlank(message = "Senha não pode estar em branco")
    private String password;
}
