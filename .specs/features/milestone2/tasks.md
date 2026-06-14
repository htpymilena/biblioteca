# Milestone 2: Tasks

**Design**: `.specs/features/milestone2/design.md` *(inline design)*
**Status**: Complete

---

## Task Breakdown

### T1: Implement JPA Entities and Enums
**What**: Create enums (`Role`, `LoanStatus`) and entity classes (`User`, `Book`, `Loan`, `AuditLog`, `SystemParameter`) in respective packages.
**Where**: `admin-service/`, `librarian-service/`, `user-service/`
**Depends on**: None
**Requirement**: MODEL-01
**Done when**:
- [x] `Role.java` enum is created in all three services.
- [x] `User.java` entity is created in all three services.
- [x] `Book.java` and `Loan.java` entities are created in `librarian-service` and `user-service`.
- [x] `SystemParameter.java` and `AuditLog.java` are created in `admin-service`.
**Tests**: none
**Gate**: build

---

### T2: Create Repository Interfaces
**What**: Implement spring data interfaces extending JpaRepository for all entities.
**Where**: `admin-service/`, `librarian-service/`, `user-service/`
**Depends on**: T1
**Requirement**: MODEL-02
**Done when**:
- [x] `UserRepository` is implemented in all three services.
- [x] `BookRepository` and `LoanRepository` are implemented in `librarian-service` and `user-service`.
- [x] `SystemParameterRepository` and `AuditLogRepository` are implemented in `admin-service`.
**Tests**: none
**Gate**: build

---

### T3: Implement PasswordEncoder Config & Data Seeder
**What**: Create `EncoderConfig` exposing `BCryptPasswordEncoder` bean and `DataSeeder` for database initialization.
**Where**: `admin-service/`
**Depends on**: T2
**Requirement**: MODEL-03, MODEL-04
**Done when**:
- [x] `EncoderConfig.java` is configured in `admin-service`.
- [x] `DataSeeder.java` is configured to run at startup, checking database count before seeding default accounts and system parameters.
**Tests**: none
**Gate**: build
