package com.biblioteca.user.repository;

import com.biblioteca.user.model.SystemParameter;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface SystemParameterRepository extends JpaRepository<SystemParameter, Long> {
    Optional<SystemParameter> findByParamKey(String key);
}
