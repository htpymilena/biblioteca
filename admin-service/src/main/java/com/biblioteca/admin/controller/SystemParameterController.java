package com.biblioteca.admin.controller;

import com.biblioteca.admin.model.SystemParameter;
import com.biblioteca.admin.service.SystemParameterService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/parameters/penalty")
@RequiredArgsConstructor
public class SystemParameterController {

    private final SystemParameterService systemParameterService;

    @GetMapping
    public ResponseEntity<SystemParameter> getPenaltyRate() {
        return ResponseEntity.ok(systemParameterService.getPenaltyRate());
    }

    @PutMapping
    public ResponseEntity<SystemParameter> updatePenaltyRate(@RequestBody Map<String, BigDecimal> body) {
        BigDecimal newRate = body.get("penaltyRate");
        if (newRate == null) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(systemParameterService.updatePenaltyRate(newRate));
    }
}
