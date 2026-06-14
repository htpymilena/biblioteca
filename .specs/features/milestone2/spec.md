# Milestone 2: Domain Entities & Seed Data Specification

## Problem Statement
O sistema de biblioteca precisa de persistência de dados. Esta fase cria as entidades JPA representativas das tabelas no banco de dados compartilhado, suas respectivas interfaces Repository para abstração de acesso a dados e os dados padrão necessários para a inicialização do sistema (parâmetros de multa e contas de teste).

## Goals
- [ ] Mapear as tabelas `users`, `books`, `loans`, `audit_logs` e `system_parameters` nos microsserviços correspondentes.
- [ ] Prover interfaces JPA Repository para operações de CRUD e consultas customizadas.
- [ ] Criptografar as senhas das contas padrão do CommandLineRunner usando o hash BCrypt.

## Out of Scope
- Lógica de regras de negócio complexas como validação de quantidade de empréstimo e controllers REST (Fase 3).

---

## User Stories

### P1: Modelagem das Entidades JPA ⭐ MVP
**User Story**: Como desenvolvedor, quero que as tabelas de banco de dados sejam representadas por classes Java com anotações JPA para permitir a manipulação de dados via ORM.
**Acceptance Criteria**:
1. WHEN a entidade `Loan` for mapeada THEN ela SHALL conter relacionamento `@ManyToOne` com `User` e `Book`.
2. WHEN a classe `User` for iniciada THEN ela SHALL conter o enum `Role` com os valores `ADMIN`, `LIBRARIAN` e `USER`.

### P1: Criptografia e Seed das Contas Padrão ⭐ MVP
**User Story**: Como administrador, quero que o sistema inicialize parâmetros e contas de teste padrão com senhas criptografadas.
**Acceptance Criteria**:
1. WHEN a tabela de usuários estiver vazia durante a inicialização do `admin-service` THEN o sistema SHALL salvar 3 usuários de teste (milena, adam, gabriel).
2. WHEN os usuários de teste forem salvos THEN as senhas SHALL ser gravadas no formato hash BCrypt.
3. WHEN o parâmetro `DAILY_PENALTY` não existir no banco THEN o sistema SHALL criá-lo com valor default `5.00`.

---

## Requirement Traceability

| Requirement ID | Story | Phase | Status |
| --- | --- | --- | --- |
| MODEL-01 | P1: Criação dos enums Role/LoanStatus e classes de entidade | Design | Verified |
| MODEL-02 | P1: Configuração dos Repositories de acesso a dados | Design | Verified |
| MODEL-03 | P1: Criptografia BCrypt para senhas de seed | Design | Verified |
| MODEL-04 | P1: Execução do CommandLineRunner de Seed | Design | Verified |

**Coverage:** 4 total, 4 mapped to tasks, 4 verified.
