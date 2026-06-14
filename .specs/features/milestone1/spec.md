# Milestone 1: Base Architecture & Infrastructure Specification

## Problem Statement
O back-end do sistema de biblioteca precisa de uma base sólida e distribuída. Cada um dos três perfis (Admin, Librarian, User) deve operar em um microsserviço isolado fisicamente e com seu próprio Swagger para documentação de APIs, conectando-se a um banco PostgreSQL compartilhado (`biblioteca_db`) orquestrado via Docker.

## Goals
- [ ] Criar 3 projetos Spring Boot estruturados com Maven e Java 21.
- [ ] Configurar conectividade com o banco de dados PostgreSQL 15 (`biblioteca_db`) com owner `postgres` e senha `123456`.
- [ ] Integrar Swagger (Springdoc OpenAPI) nos 3 serviços para visualização e teste de rotas.
- [ ] Fornecer arquivo `docker-compose.yml` para subir o banco de dados PostgreSQL automaticamente.

## Out of Scope
| Feature | Reason |
| --- | --- |
| Lógica de negócios de empréstimos, usuários ou livros | Ficarão para as próximas fases. Esta fase é puramente de infraestrutura, setup e validação da conexão com banco e swagger. |
| Containerização dos microsserviços Spring Boot | Ficará para a Fase 4 (Milestone 4). Nesta etapa os serviços rodam localmente se conectando ao banco no Docker. |

---

## User Stories

### P1: Configuração do Esqueleto dos Microsserviços e Swagger ⭐ MVP
**User Story**: Como desenvolvedor, quero gerar os 3 projetos Spring Boot (Admin: 8081, Librarian: 8082, User: 8083) com suas dependências iniciais e o Swagger configurado, para que eu tenha uma base para implementar as APIs REST.

**Why P1**: É a base física do projeto que permite iniciar a codificação de todas as outras features.

**Acceptance Criteria**:
1. WHEN o serviço `admin-service` é iniciado THEN ele SHALL subir na porta `8081`.
2. WHEN o serviço `librarian-service` é iniciado THEN ele SHALL subir na porta `8082`.
3. WHEN o serviço `user-service` é iniciado THEN ele SHALL subir na porta `8083`.
4. WHEN qualquer um dos 3 serviços estiver rodando THEN o endpoint `/swagger-ui/index.html` SHALL exibir a documentação Swagger com título e descrição apropriados ao serviço.

**Independent Test**:
- Iniciar cada serviço individualmente e abrir `http://localhost:808X/swagger-ui/index.html` para certificar que a interface gráfica do Swagger carrega com sucesso.

---

### P1: Conexão com o Banco de Dados PostgreSQL ⭐ MVP
**User Story**: Como desenvolvedor, quero configurar os 3 microsserviços para se conectarem ao banco de dados `biblioteca_db` executado via Docker Compose, para garantir a persistência futura.

**Why P1**: Sem a persistência de banco de dados, o Hibernate/JPA irá falhar na inicialização e o seed de dados não poderá rodar.

**Acceptance Criteria**:
1. WHEN o comando `docker-compose up -d db` for executado na raiz THEN o container PostgreSQL SHALL subir na porta `5432` com banco `biblioteca_db`, usuário `postgres` e senha `123456`.
2. WHEN os microsserviços são iniciados THEN eles SHALL conectar com sucesso ao banco de dados, criando as tabelas se necessário (`ddl-auto=update`).

**Independent Test**:
- Rodar o docker-compose para subir o banco, iniciar os microsserviços e verificar no console do Spring Boot que não há erros de conexão JDBC (`Connection refused`).

---

## Requirement Traceability

| Requirement ID | Story | Phase | Status |
| --- | --- | --- | --- |
| INFRA-01 | P1: Esqueleto dos microsserviços na porta correspondente | Design | Pending |
| INFRA-02 | P1: Integração e visualização do Swagger UI | Design | Pending |
| INFRA-03 | P1: Docker Compose do PostgreSQL | Design | Pending |
| INFRA-04 | P1: Conexão JDBC bem-sucedida nos 3 serviços | Design | Pending |

**Coverage:** 4 total, 0 mapped to tasks, 4 unmapped ⚠️

---

## Success Criteria
- [ ] 3 serviços Spring Boot compilados com sucesso via Maven (`mvn clean install`).
- [ ] Banco de dados PostgreSQL subindo localmente via Docker na porta 5432.
- [ ] Swagger documentando as APIs disponível em `/swagger-ui/index.html` em todos os serviços.
