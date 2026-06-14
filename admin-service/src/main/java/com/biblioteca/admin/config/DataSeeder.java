package com.biblioteca.admin.config;

import com.biblioteca.admin.model.Role;
import com.biblioteca.admin.model.SystemParameter;
import com.biblioteca.admin.model.User;
import com.biblioteca.admin.repository.SystemParameterRepository;
import com.biblioteca.admin.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final SystemParameterRepository systemParameterRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        seedSystemParameters();
        seedUsers();
    }

    private void seedSystemParameters() {
        if (systemParameterRepository.findByParamKey("DAILY_PENALTY").isEmpty()) {
            SystemParameter penaltyParam = new SystemParameter();
            penaltyParam.setParamKey("DAILY_PENALTY");
            penaltyParam.setParamValue("5.00");
            systemParameterRepository.save(penaltyParam);
            log.info("System parameter 'DAILY_PENALTY' seeded with value '5.00'");
        }
    }

    private void seedUsers() {
        if (userRepository.count() == 0) {
            // Seed Admin User
            User admin = new User();
            admin.setName("Milena");
            admin.setEmail("milena@gmail.com");
            admin.setPasswordHash(passwordEncoder.encode("Milena@123"));
            admin.setRole(Role.ADMIN);
            userRepository.save(admin);
            log.info("Admin user seeded: milena@gmail.com");

            // Seed Librarian User
            User librarian = new User();
            librarian.setName("Adam");
            librarian.setEmail("adam@gmail.com");
            librarian.setPasswordHash(passwordEncoder.encode("Adam@123"));
            librarian.setRole(Role.LIBRARIAN);
            userRepository.save(librarian);
            log.info("Librarian user seeded: adam@gmail.com");

            // Seed Regular User
            User user = new User();
            user.setName("Gabriel");
            user.setEmail("gabriel@gmail.com");
            user.setPasswordHash(passwordEncoder.encode("Gabriel@123"));
            user.setRole(Role.USER);
            userRepository.save(user);
            log.info("Regular user seeded: gabriel@gmail.com");
        } else {
            log.info("Users table is not empty, skipping seeder");
        }
    }
}
