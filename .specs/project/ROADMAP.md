# Roadmap

**Current Milestone:** Milestone 4: Docker Orchestration
**Status:** In Progress

---

## Milestone 1: Base Architecture & Infrastructure

**Goal:** Configuração base dos 3 microsserviços Spring Boot, integração com PostgreSQL 15, documentação via Swagger/OpenAPI e configuração do Docker Compose inicial.
**Target:** Sucesso na compilação e acesso ao Swagger UI de cada serviço.

### Features

**[Service Skeleton Creation]** - COMPLETE
- Geração dos projetos Maven `admin-service`, `librarian-service` e `user-service`.
- Inclusão das dependências comuns: Web, JPA, PostgreSQL, Security, Validation, Lombok, AOP e OpenAPI/Swagger.

**[Database Configuration]** - COMPLETE
- Configuração de `application.properties` para cada porta (8081, 8082, 8083) conectando ao PostgreSQL local/Docker.
- Script docker-compose inicial apenas para o banco PostgreSQL (`biblioteca_db`).

**[Swagger Setup]** - COMPLETE
- Configuração do `springdoc-openapi` em todos os microsserviços.
- Customização do título, versão e rotas documentadas.

---

## Milestone 2: Domain Entities & Seed Data

**Goal:** Implementação das entidades JPA comuns (`User`, `Book`, `Loan`, `AuditLog`, `SystemParameter`), repositórios e o `DataSeeder` de inicialização das contas padrão.

### Features
- **[Shared Domain Models]** - COMPLETE
- **[Data Seeding]** - COMPLETE

---

## Milestone 3: Business Logic & REST APIs

**Goal:** Desenvolvimento dos serviços de regras de negócio, controllers e validação de tokens JWT.

### Features
- **[Admin REST APIs]** - COMPLETE
- **[Librarian REST APIs]** - COMPLETE
- **[User REST APIs]** - COMPLETE
- **[JWT Security Config]** - COMPLETE
- **[Spring AOP Audit Logging]** - COMPLETE

---

## Milestone 4: Docker Orchestration

**Goal:** Containerização final dos 3 serviços e orquestração do ambiente com Docker Compose.

### Features
- **[Dockerization]** - PLANNED

