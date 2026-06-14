# Testing Strategy

## Test Types and Commands

| Test Type | Description | Command |
|---|---|---|
| build | Verifica a compilação de todos os módulos | `mvn clean compile` |
| unit | Testes unitários (JUnit 5 + Mockito) | `mvn test` |
| integration | Testes de integração de banco de dados / endpoints | `mvn verify` |

## Parallel-Safety Assessment

| Test Type | Parallel-Safe | Notes |
|---|---|---|
| build | Yes | Cada serviço compila de forma isolada. |
| unit | Yes | Testes unitários não dependem do banco de dados compartilhado. |
| integration | No | Testes que gravam no banco de dados compartilhado PostgreSQL podem conflitar se rodados em paralelo na mesma base. |

## Test Coverage Matrix

| Code Layer | Required Test Type | Notes |
|---|---|---|
| Entities | none | Apenas mapeamentos JPA básicos. |
| Repositories | unit/integration | Testar queries customizadas. |
| Services | unit | Testar regras de negócio mockando repositórios. |
| Controllers | integration | MockMvc ou RestTemplate para testar endpoints e segurança. |
