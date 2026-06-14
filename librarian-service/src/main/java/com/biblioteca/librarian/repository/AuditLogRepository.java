package com.biblioteca.librarian.repository;

import com.biblioteca.librarian.model.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {
}
