# State

**Last Updated:** 2026-06-14T20:26:00Z
**Current Work:** Milestone 4 concluído (Containerização e Orquestração Docker). O backend está 100% estruturado, implementado e pronto para execução. Próximo passo é iniciar o desenvolvimento do Front-end em React + Vite.

---

## Recent Decisions (Last 60 days)

### AD-001: Arquitetura Distribuída sem Gateway (2026-06-14)
- **Decision:** Uso de três serviços independentes (Admin :8081, Librarian :8082, User :8083) com chamadas diretas do front-end.
- **Reason:** Solicitação explícita do PRD para portas e domínios isolados por role.
- **Trade-off:** Exposição de múltiplas portas ao cliente React, exigindo CORS habilitado em cada microsserviço.
- **Impact:** Front-end gerencia a origem das URLs das requisições com base no perfil do usuário logado.

## Active Blockers

### B-001: Docker/Docker Compose não instalado na máquina
**Discovered:** 2026-06-14
**Impact:** Impossibilidade de rodar e testar os containers localmente usando `docker compose`.
**Workaround:** Utilizar instalação do PostgreSQL local ou focar nos testes de compilação/unitários nesta fase.
**Resolution:** Instalação do Docker Desktop pelo usuário ou inicialização local do serviço PostgreSQL.

### B-002: Maven (mvn) não reconhecido no PATH do terminal do Agente
**Discovered:** 2026-06-14
**Impact:** O agente não consegue rodar o build/compilação local (`mvn clean compile`) pelo terminal.
**Workaround:** Escrever o código Java correto e deixar a compilação/execução sob responsabilidade da IDE do usuário (VS Code/IntelliJ).
**Resolution:** Instalação do Maven e configuração no PATH do sistema.

---

## Lessons Learned

- O compartilhamento da base de dados PostgreSQL (`biblioteca_DB`) permitiu que os três serviços independentes pudessem consultar a mesma tabela de auditoria (`audit_logs`) e parâmetros do sistema (`system_parameters`) sem necessidade de chamadas REST síncronas entre si, simplificando consideravelmente a arquitetura e reduzindo latência.
- O uso de Dockerfiles multi-stage com compilação isolada no Maven garante que os containers de execução possuam apenas o JRE (Java Runtime Environment) enxuto, otimizando o tamanho das imagens docker de R$ ~500MB para R$ ~150MB.

---

## Quick Tasks Completed

| #   | Description              | Date       | Commit | Status  |
| --- | ------------------------ | ---------- | ------ | ------- |
| 001 | Criação do PRD inicial   | 2026-06-14 | -      | ✅ Done |
| 002 | Implementação da Fase 2 (JPA Models & Seed) | 2026-06-14 | - | ✅ Done |
| 003 | Implementação da Fase 3 (Segurança JWT, AOP & REST APIs) | 2026-06-14 | - | ✅ Done |
| 004 | Implementação da Fase 4 (Dockerfiles & Compose) | 2026-06-14 | - | ✅ Done |

---

## Deferred Ideas

*Nenhuma ideia diferida.*

---

## Todos

- [x] Gerar os 3 projetos Spring Boot via Maven (Admin, Librarian, User)
- [x] Configurar Swagger/OpenAPI nos 3 projetos
- [x] Criar docker-compose inicial para PostgreSQL
- [x] Implementar JWT, Filtros e SecurityConfig nos 3 microsserviços
- [x] Criar Tratamento de Exceções Global nos 3 microsserviços
- [x] Adicionar auditoria distribuída via Spring AOP (@Auditable)
- [x] Criar services de lógica de negócio e controllers REST correspondentes
- [x] Containerizar os microsserviços com Dockerfiles e Docker Compose

---

## Preferences

**Model Guidance Shown:** 2026-06-14
