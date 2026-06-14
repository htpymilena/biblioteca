package com.biblioteca.admin.service;

import com.biblioteca.admin.config.audit.Auditable;
import com.biblioteca.admin.exception.ResourceNotFoundException;
import com.biblioteca.admin.model.SystemParameter;
import com.biblioteca.admin.repository.SystemParameterRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class SystemParameterService {

    private final SystemParameterRepository systemParameterRepository;

    @Auditable(action = "ALTERAR_TAXA_MULTA")
    public SystemParameter updatePenaltyRate(BigDecimal newRate) {
        SystemParameter param = systemParameterRepository.findByParamKey("DAILY_PENALTY")
                .orElseGet(() -> {
                    SystemParameter newParam = new SystemParameter();
                    newParam.setParamKey("DAILY_PENALTY");
                    return newParam;
                });
        param.setParamValue(newRate.toString());
        return systemParameterRepository.save(param);
    }

    public SystemParameter getPenaltyRate() {
        return systemParameterRepository.findByParamKey("DAILY_PENALTY")
                .orElseThrow(() -> new ResourceNotFoundException("Parâmetro DAILY_PENALTY não configurado."));
    }
}
