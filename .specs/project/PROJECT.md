# Biblioteca Distribuída

**Vision:** Um sistema de gerenciamento de biblioteca distribuído composto por três microsserviços Spring Boot independentes (Admin, Librarian, User) com comunicação direta do front-end React + Vite.
**For:** Administradores, Bibliotecários e Usuários da biblioteca.
**Solves:** O isolamento físico de portas e perfis de segurança, evitando que requisições de um usuário comum atinjam o serviço de administração ou bibliotecário.

## Goals

- **G-01:** Isolar fisicamente as roles em 3 portas distintas (8081, 8082, 8083) com regras de negócio segregadas.
- **G-02:** Armazenar dados em um banco de dados compartilhado PostgreSQL 15, garantindo integridade de dados (limites de empréstimos, estoque, logs).
- **G-03:** Documentar todos os endpoints REST de cada serviço via Swagger/OpenAPI.

## Tech Stack

**Core:**
- Framework: Spring Boot 3.x (Java 21, Maven)
- Front-end: React 18 + Vite (TypeScript/JavaScript)
- Database: PostgreSQL 15

**Key dependencies (Back-end):**
- Spring Data JPA (Persistência)
- Spring Security & Spring Boot Starter Validation
- JWT (jjwt 0.11.5)
- Springdoc OpenAPI Starter WebMVC UI 2.5.0 (Swagger)
- Spring AOP (Auditoria)

## Scope

**v1 includes:**
- **Admin Service (8081):** CRUD de usuários, logs de auditoria (AOP), configuração de multas diárias.
- **Librarian Service (8082):** CRUD de livros e estoque, histórico global de empréstimos.
- **User Service (8083):** Registro de usuário, catálogo de livros, realização e devolução de empréstimos (limite de 3 simultâneos), simulação de pagamentos, solicitações de alertas.
- **Swagger UI** integrado em cada microsserviço para teste e documentação de rotas.
- **Docker Compose** orquestrando banco de dados PostgreSQL e os 3 serviços.

**Explicitly out of scope:**
- API Gateway ou Eureka Server (solicitado explicitamente comunicação direta do front-end com os serviços).
- Gateway de pagamento real (apenas simulação).

## Constraints
- Porta do Admin Service: 8081
- Porta do Librarian Service: 8082
- Porta do User Service: 8083
- Database Name: `biblioteca_db` (owner: `postgres`, senha: `123456`)
- Senhas salvas com hashing forte (BCrypt).
