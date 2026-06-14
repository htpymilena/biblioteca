package com.biblioteca.user.service;

import com.biblioteca.user.repository.SystemParameterRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

@Service
@RequiredArgsConstructor
public class PenaltyCalculationService {

    private final SystemParameterRepository paramRepo;

    public BigDecimal calculatePenalty(LocalDate dueDate, LocalDate returnDate) {
        if (!returnDate.isAfter(dueDate)) {
            return BigDecimal.ZERO;
        }

        long daysLate = ChronoUnit.DAYS.between(dueDate, returnDate);
        BigDecimal dailyRate = paramRepo.findByParamKey("DAILY_PENALTY")
                .map(p -> new BigDecimal(p.getParamValue()))
                .orElse(new BigDecimal("5.00")); // fallback default

        return dailyRate.multiply(BigDecimal.valueOf(daysLate));
    }
}
