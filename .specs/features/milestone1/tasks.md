# Milestone 1: Tasks

**Design**: `.specs/features/milestone1/design.md` *(skipping design doc as this is straight infrastructure setup)*
**Status**: In Progress

---

## Execution Plan

### Phase 1: Foundation (Sequential)
Configure the database environment so services can connect during their startup.

```
T1
```

### Phase 2: Services Setup (Parallel OK)
Once the database container is configured, we can initialize and configure the three Spring Boot microservices in parallel.

```
      ┌→ T2 [P] (admin-service)
T1 ───┼→ T3 [P] (librarian-service)
      └→ T4 [P] (user-service)
```

---

## Task Breakdown

### T1: Create Docker Compose for PostgreSQL
**What**: Create a `docker-compose.yml` file at the root of the project containing a PostgreSQL container named `db` mapping port `5432` with database `biblioteca_db`, user `postgres` and password `123456`.
**Where**: `docker-compose.yml`
**Depends on**: None
**Reuses**: None
**Requirement**: INFRA-03
**Tools**:
- MCP: `filesystem`
- Skill: NONE
**Done when**:
- [x] `docker-compose.yml` file is created at the project root.
- [x] Database variables (`POSTGRES_DB`, `POSTGRES_USER`, `POSTGRES_PASSWORD`) are correctly configured.
- [ ] `docker-compose up -d db` command runs successfully and PostgreSQL container is healthy (Bloqueado por B-001).
**Tests**: none
**Gate**: build

---

### T2: Initialize admin-service with Swagger Setup [P]
**What**: Generate the Maven project structure for `admin-service`, configure port `8081`, set up connection properties for PostgreSQL, configure `springdoc-openapi` for Swagger documentation, and add basic CORS configuration.
**Where**: `admin-service/`
**Depends on**: T1
**Reuses**: None
**Requirement**: INFRA-01, INFRA-02, INFRA-04
**Tools**:
- MCP: `filesystem`
- Skill: NONE
**Done when**:
- [x] `admin-service` folder structure is created (Maven project).
- [x] `pom.xml` contains Spring Web, Data JPA, PostgreSQL Driver, Security, Lombok, Validation, AOP, and `springdoc-openapi-starter-webmvc-ui`.
- [x] `application.properties` sets port to `8081` and database to `jdbc:postgresql://localhost:5432/biblioteca_db` (or `db:5432` for profile docker).
- [x] `OpenApiConfig.java` is created to customize Swagger UI (title: "Admin Service API").
- [ ] Project compiles successfully (`mvn clean compile` passes) (Bloqueado por B-002).
**Tests**: none
**Gate**: build

---

### T3: Initialize librarian-service with Swagger Setup [P]
**What**: Generate the Maven project structure for `librarian-service`, configure port `8082`, set up connection properties for PostgreSQL, configure `springdoc-openapi` for Swagger documentation, and add basic CORS configuration.
**Where**: `librarian-service/`
**Depends on**: T1
**Reuses**: None
**Requirement**: INFRA-01, INFRA-02, INFRA-04
**Tools**:
- MCP: `filesystem`
- Skill: NONE
**Done when**:
- [x] `librarian-service` folder structure is created (Maven project).
- [x] `pom.xml` contains required dependencies including `springdoc-openapi-starter-webmvc-ui`.
- [x] `application.properties` sets port to `8082` and database properties.
- [x] `OpenApiConfig.java` is created to customize Swagger UI (title: "Librarian Service API").
- [ ] Project compiles successfully (Bloqueado por B-002).
**Tests**: none
**Gate**: build

---

### T4: Initialize user-service with Swagger Setup [P]
**What**: Generate the Maven project structure for `user-service`, configure port `8083`, set up connection properties for PostgreSQL, configure `springdoc-openapi` for Swagger documentation, and add basic CORS configuration.
**Where**: `user-service/`
**Depends on**: T1
**Reuses**: None
**Requirement**: INFRA-01, INFRA-02, INFRA-04
**Tools**:
- MCP: `filesystem`
- Skill: NONE
**Done when**:
- [x] `user-service` folder structure is created (Maven project).
- [x] `pom.xml` contains required dependencies including `springdoc-openapi-starter-webmvc-ui`.
- [x] `application.properties` sets port to `8083` and database properties.
- [x] `OpenApiConfig.java` is created to customize Swagger UI (title: "User Service API").
- [ ] Project compiles successfully (Bloqueado por B-002).
**Tests**: none
**Gate**: build

---

## Parallel Execution Map
```
Phase 1 (Sequential):
  T1 (Docker Database setup)

Phase 2 (Parallel):
  T1 complete, then:
    ├── T2 [P] (admin-service skeleton + Swagger)
    ├── T3 [P] (librarian-service skeleton + Swagger)
    └── T4 [P] (user-service skeleton + Swagger)
```

**Parallelism constraint:** Tasks T2, T3, and T4 do not share mutable state, do not have inter-dependencies, and do not run integration tests against a shared database in parallel (they have `Tests: none`). Hence, they are parallel-safe.

---

## Task Granularity Check

| Task | Scope | Status |
| --- | --- | --- |
| T1: Create Docker Compose for PostgreSQL | 1 config file | ✅ Granular |
| T2: Initialize admin-service | 1 service setup | ✅ Granular |
| T3: Initialize librarian-service | 1 service setup | ✅ Granular |
| T4: Initialize user-service | 1 service setup | ✅ Granular |

---

## Diagram-Definition Cross-Check

| Task | Depends On (task body) | Diagram Shows | Status |
| --- | --- | --- | --- |
| T1 | None | None | ✅ Match |
| T2 | T1 | T1 ──→ T2 | ✅ Match |
| T3 | T1 | T1 ──→ T3 | ✅ Match |
| T4 | T1 | T1 ──→ T4 | ✅ Match |

---

## Test Co-location Validation

| Task | Code Layer Created/Modified | Matrix Requires | Task Says | Status |
| --- | --- | --- | --- | --- |
| T1 | Infrastructure configuration | none | none | ✅ OK |
| T2 | Service setup & OpenAPI configuration | none | none | ✅ OK |
| T3 | Service setup & OpenAPI configuration | none | none | ✅ OK |
| T4 | Service setup & OpenAPI configuration | none | none | ✅ OK |
