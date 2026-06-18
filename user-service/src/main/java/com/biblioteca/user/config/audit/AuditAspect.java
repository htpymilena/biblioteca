package com.biblioteca.user.config.audit;

import com.biblioteca.user.model.AuditLog;
import com.biblioteca.user.repository.AuditLogRepository;
import com.biblioteca.user.repository.UserRepository;
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
    private final UserRepository userRepository;

    @AfterReturning("@annotation(auditable)")
    public void logAction(JoinPoint joinPoint, Auditable auditable) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String userEmail = (auth != null && auth.isAuthenticated()) ? auth.getName() : "sistema";

        AuditLog log = new AuditLog();
        log.setAction(auditable.action());
        log.setTimestamp(LocalDateTime.now());

        if (auth != null && auth.isAuthenticated() && !"anonymousUser".equals(userEmail)) {
            userRepository.findByEmail(userEmail).ifPresentOrElse(
                user -> {
                    log.setUserId(user.getId());
                    log.setUserName(user.getName());
                },
                () -> {
                    log.setUserName(userEmail);
                }
            );
        } else {
            log.setUserName("sistema");
        }

        auditLogRepository.save(log);
    }
}
