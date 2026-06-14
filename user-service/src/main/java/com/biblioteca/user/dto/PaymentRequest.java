package com.biblioteca.user.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class PaymentRequest {

    @NotNull(message = "ID do empréstimo é obrigatório")
    private Long loanId;

    @NotNull(message = "Valor de pagamento é obrigatório")
    private BigDecimal amount;
}
