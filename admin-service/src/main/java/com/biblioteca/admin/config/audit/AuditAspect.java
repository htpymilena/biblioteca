package com.biblioteca.admin.config.audit;

import com.biblioteca.admin.model.AuditLog;
import com.biblioteca.admin.repository.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Aspect
@Component
@RequiredArgsConstructor
public class AuditAspect {

    private final AuditLogRepository auditLogRepository;

    @AfterReturning("@annotation(auditable)")
    public void logAction(JoinPoint joinPoint, Auditable auditable) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String userEmail = (auth != null && auth.isAuthenticated()) ? auth.getName() : "sistema";

        AuditLog log = new AuditLog();
        log.setUserName(userEmail);
        log.setAction(auditable.action());
        log.setTimestamp(LocalDateTime.now());

        auditLogRepository.save(log);
    }
}
