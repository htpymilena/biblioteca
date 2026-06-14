# PRD — Sistema de Biblioteca Distribuído

> **Versão:** 1.0  
> **Data:** Junho 2026  
> **Status:** Em Desenvolvimento  
> **Owner do Banco:** `postgres` / Senha: `123456`

---

## 1. Visão Geral do Produto

### 1.1 Objetivo

Construir um **Sistema de Biblioteca Distribuído** com três serviços back-end independentes, cada um isolado em sua própria porta de rede e responsável por um perfil de usuário distinto. O front-end em **React + Vite** consome esses serviços diretamente, sem API Gateway intermediário.

### 1.2 Stack Tecnológica

| Camada | Tecnologia |
|---|---|
| Back-end | Spring Boot 3.x (REST) |
| Front-end | React 18 |
| Build Tool (Front-end) | Vite |
| Roteamento | React Router DOM v6 |
| Requisições HTTP | Axios |
| Gerenciamento de Estado | Context API (AuthContext) |
| Banco de Dados | PostgreSQL 15 |
| Arquitetura interna | MVC (por serviço) |
| Segurança | JWT (JSON Web Tokens) |
| Hash de Senhas | BCrypt / Argon2 |
| Infraestrutura | Docker + Docker Compose |
| Auditoria | Spring AOP |

### 1.3 Princípios Arquiteturais

- **SOLID**: Single Responsibility e Dependency Inversion aplicados obrigatoriamente.
- **Distribuição de serviços por Role**: cada perfil tem seu próprio processo Spring Boot.
- **Containerização total**: zero dependências locais além do Docker.

---

## 2. Perfis de Acesso (Roles)

O sistema possui **três roles** com domínios e portas completamente isolados:

| Role | Serviço | Porta |
|---|---|---|
| Administrador | Admin Service | `8081` |
| Bibliotecário | Librarian Service | `8082` |
| Usuário | User Service | `8083` |

---

## 3. Contas Padrão (Seed de Inicialização)

Executadas via `CommandLineRunner` do Spring Boot na primeira inicialização. Senhas armazenadas com `BCryptPasswordEncoder`.

| Role | E-mail | Senha (plaintext) |
|---|---|---|
| Administrador | milena@gmail.com | `Milena@123` |
| Bibliotecário | adam@gmail.com | `Adam@123` |
| Usuário | gabriel@gmail.com | `Gabriel@123` |

> [!IMPORTANT]
> O seed só deve ser executado se as tabelas estiverem **vazias** na inicialização. Verificar contagem de registros antes de inserir.

---

## 4. Funcionalidades por Perfil

### 4.1 Usuário Comum

| # | Funcionalidade | Regra de Negócio |
|---|---|---|
| U-01 | Criar conta de forma independente | Auto-registro público |
| U-02 | Buscar livros no catálogo | Exibir disponibilidade de exemplares |
| U-03 | Visualizar detalhes da obra | Incluir quantidade de exemplares disponíveis |
| U-04 | Realizar empréstimo | **Máximo de 3 livros simultâneos por usuário** |
| U-05 | Devolver livros emprestados | Calcular multa se houver atraso |
| U-06 | Pagar taxas de atraso | Via Simulador de Pagamentos — **R$ 5,00/dia** (configurável) |
| U-07 | Solicitar notificação de disponibilidade | Para livros sem estoque atual |
| U-08 | Gerenciar perfil | Ver dados, editar perfil, trocar senha |

### 4.2 Bibliotecário

| # | Funcionalidade | Observação |
|---|---|---|
| B-01 | CRUD de livros no catálogo | Criar, listar, atualizar e remover |
| B-02 | Visualizar catálogo e estoque completos | Visão interna com quantidades |
| B-03 | Ver histórico de empréstimos | Todos os registros do sistema |
| B-04 | Ver exemplares atualmente emprestados | Status em tempo real |
| B-05 | Ver exemplares devolvidos e reservados | Controle de fluxo |
| B-06 | Gerenciar perfil | Ver dados, editar perfil, trocar senha |

### 4.3 Administrador

| # | Funcionalidade | Observação |
|---|---|---|
| A-01 | CRUD de usuários | Incluindo usuários, bibliotecários e admins |
| A-02 | Criação de contas privilegiadas | **Somente Admins** podem criar Bibliotecários e outros Admins |
| A-03 | Gestão de Parâmetros | Alterar taxa diária de multa dinamicamente via tela de configuração |
| A-04 | Auditoria de Sistema (Logs) | Tela com: Usuário (Nome + ID), Ação (ex: "Deleção de Livro"), Data/Hora |

---

## 5. Regras de Negócio

| ID | Regra |
|---|---|
| RN-01 | Um usuário pode ter no **máximo 3 livros emprestados** ao mesmo tempo. |
| RN-02 | A taxa de atraso base é de **R$ 5,00 por dia**, configurável pelo Administrador. |
| RN-03 | O empréstimo só é permitido se houver **exemplares disponíveis** no estoque. |
| RN-04 | Contas de **Bibliotecário e Administrador** só podem ser criadas por um Administrador autenticado. |
| RN-05 | Senhas devem ser armazenadas com **hash forte** (BCrypt ou Argon2) — nunca em plaintext. |
| RN-06 | O seed de dados padrão é executado **apenas uma vez**, quando as tabelas estão vazias. |

---

## 6. Requisitos Não Funcionais

### 6.1 Segurança

- **Autenticação:** JWT (JSON Web Tokens) centralizado por serviço.
- **Autorização:** Validação de role no token a cada requisição.
- **Armazenamento de senhas:** BCrypt ou Argon2 obrigatório.
- **Rotas não autorizadas:** Retornar `403 Forbidden` com mensagem clara.

### 6.2 Tratamento de Exceções

| Cenário | Resposta Esperada |
|---|---|
| Nenhum exemplar disponível para empréstimo | `400 Bad Request` ou `409 Conflict` com mensagem amigável |
| Usuário tenta pegar 4º livro (limite excedido) | `400 Bad Request` com mensagem de limite atingido |
| Acesso a rota não autorizada para o perfil do token | `403 Forbidden` |
| Recurso não encontrado | `404 Not Found` com mensagem descritiva |

### 6.3 Observabilidade

- Logs de auditoria implementados via **Spring AOP** interceptando métodos críticos (ex: `deleteBook()`, `changePenaltyRate()`).
- Log registra: **Quem** (userId + nome), **O quê** (ação), **Quando** (timestamp).
- AOP não deve poluir a regra de negócio central.

---

## 7. Arquitetura Técnica

### 7.1 Padrão MVC Distribuído

```
┌──────────────────────────────────────────────────────────────────┐
│                         Front-end React                          │
│          (fetch / axios para as diferentes portas)               │
└────────┬───────────────────┬──────────────────────┬─────────────┘
         │ :8081              │ :8082                 │ :8083
┌────────▼────────┐  ┌────────▼────────┐  ┌──────────▼──────────┐
│  Admin Service  │  │Librarian Service│  │    User Service     │
│  (Spring Boot)  │  │  (Spring Boot)  │  │   (Spring Boot)     │
│                 │  │                 │  │                     │
│  @RestController│  │  @RestController│  │  @RestController    │
│  Service Layer  │  │  Service Layer  │  │  Service Layer      │
│  JPA Repository │  │  JPA Repository │  │  JPA Repository     │
└────────┬────────┘  └────────┬────────┘  └──────────┬──────────┘
         │                    │                        │
         └────────────────────┼────────────────────────┘
                              │
                   ┌──────────▼──────────┐
                   │     PostgreSQL       │
                   │  (Container Docker)  │
                   │  owner: postgres     │
                   │  pass:  123456       │
                   └─────────────────────┘
```

### 7.2 Entidades JPA Principais

| Entidade | Campos Essenciais |
|---|---|
| `User` | id, name, email, passwordHash, role, createdAt |
| `Book` | id, title, author, isbn, totalCopies, availableCopies |
| `Loan` | id, userId, bookId, loanDate, dueDate, returnDate, status |
| `AuditLog` | id, userId, userName, action, timestamp |
| `SystemParameter` | id, key (ex: `DAILY_PENALTY`), value |

### 7.3 Aplicação de SOLID

| Princípio | Aplicação |
|---|---|
| **S** — Single Responsibility | `PenaltyCalculationService` isolado para cálculo de multas; `AuditService` isolado para logs |
| **D** — Dependency Inversion | Controllers dependem de interfaces (`LoanRepository`, `BookService`) via injeção por construtor |

---

## 8. Mapeamento de Endpoints da API

### 8.1 Admin Service — Porta `8081`

| Método | Endpoint | Descrição |
|---|---|---|
| `POST` | `/api/admin/users` | Criação de novos usuários/bibliotecários/admins |
| `GET` | `/api/admin/users` | Listagem de usuários do sistema |
| `PUT` | `/api/admin/users/{id}` | Atualização de permissões/dados |
| `DELETE` | `/api/admin/users/{id}` | Remoção de usuários |
| `PUT` | `/api/admin/parameters/penalty` | Altera a taxa diária de atraso |
| `GET` | `/api/admin/audit/logs` | Retorna a trilha de auditoria |

### 8.2 Librarian Service — Porta `8082`

| Método | Endpoint | Descrição |
|---|---|---|
| `POST` | `/api/librarian/books` | Adiciona novo livro ao acervo |
| `GET` | `/api/librarian/books` | Lista livros detalhados (incluindo estoque) |
| `PUT` | `/api/librarian/books/{id}` | Atualiza dados do livro/estoque |
| `DELETE` | `/api/librarian/books/{id}` | Remove livro do acervo |
| `GET` | `/api/librarian/loans/history` | Visão geral de empréstimos/devoluções |
| `GET` | `/api/librarian/profile` | Dados do bibliotecário logado |

### 8.3 User Service — Porta `8083`

| Método | Endpoint | Descrição |
|---|---|---|
| `POST` | `/api/auth/register` | Registro público de novo usuário |
| `GET` | `/api/users/catalog` | Busca pública de livros disponíveis |
| `GET` | `/api/users/catalog/{id}` | Detalhes do livro e disponibilidade |
| `POST` | `/api/users/loans` | Realiza empréstimo (valida limite de 3 e estoque) |
| `POST` | `/api/users/loans/{id}/return` | Registra devolução |
| `POST` | `/api/users/payments/simulate` | Simula e processa pagamento de multas |
| `POST` | `/api/users/notifications/request` | Solicita alerta para livro sem estoque |

---

## 9. Infraestrutura Docker

### 9.1 Serviços no `docker-compose.yml`

| Serviço | Imagem | Porta | Responsabilidade |
|---|---|---|---|
| `db` | `postgres:latest` | `5432` | Banco de dados PostgreSQL |
| `admin-service` | build local | `8081` | Admin Service Spring Boot |
| `librarian-service` | build local | `8082` | Librarian Service Spring Boot |
| `user-service` | build local | `8083` | User Service Spring Boot |

### 9.2 Configuração do Banco (Variáveis de Ambiente)

```yaml
environment:
  POSTGRES_DB: biblioteca_db
  POSTGRES_USER: postgres
  POSTGRES_PASSWORD: "123456"
```

### 9.3 Comunicação Interna

Os serviços Spring Boot comunicam com o banco via **rede interna Docker**:

```
jdbc:postgresql://db:5432/biblioteca_db
```

### 9.4 Execução

```bash
# Subir toda a aplicação do zero
docker-compose up --build

# Derrubar e limpar volumes
docker-compose down -v
```

---

## 10. Critérios de Aceitação (Definition of Done)

| # | Critério |
|---|---|
| DoD-01 | Os três serviços sobem isolados nas portas `8081`, `8082` e `8083` via `docker-compose up --build` |
| DoD-02 | O seed inicial cria as 3 contas padrão com senhas hashadas corretamente |
| DoD-03 | Um usuário não consegue pegar mais de 3 livros simultaneamente (retorna erro claro) |
| DoD-04 | Tentativa de acesso a rota de outro role retorna `403 Forbidden` |
| DoD-05 | Operações críticas (deleção de livro, mudança de taxa) são registradas no log de auditoria |
| DoD-06 | O Administrador consegue alterar a taxa diária e o valor é refletido imediatamente nos cálculos |
| DoD-07 | Usuário recebe notificação quando livro sem estoque fica disponível |
| DoD-08 | Todos os endpoints mapeados na Parte 6 estão implementados e funcionais |

---

## 11. Estrutura de Diretórios Sugerida

```
biblioteca/
├── docker-compose.yml
├── admin-service/
│   ├── Dockerfile
│   └── src/main/java/com/biblioteca/admin/
│       ├── controller/
│       ├── service/
│       ├── repository/
│       ├── model/
│       └── config/          ← JWT, Seed, AOP
├── librarian-service/
│   ├── Dockerfile
│   └── src/main/java/com/biblioteca/librarian/
│       └── ...
├── user-service/
│   ├── Dockerfile
│   └── src/main/java/com/biblioteca/user/
│       └── ...
└── frontend/
    ├── package.json
    └── src/
        ├── pages/
        │   ├── AdminDashboard.jsx
        │   ├── LibrarianDashboard.jsx
        │   └── UserDashboard.jsx
        └── services/
            ├── adminApi.js        ← aponta para :8081
            ├── librarianApi.js    ← aponta para :8082
            └── userApi.js         ← aponta para :8083
```

---

## 12. Passo a Passo — Implementação do Back-end

> [!NOTE]
> Cada um dos três serviços (`admin-service`, `librarian-service`, `user-service`) segue **exatamente o mesmo roteiro** abaixo. A diferença está nas entidades, regras e porta configurada.

---

### FASE 1 — Criação dos Projetos Spring Boot

**Passo 1 — Gerar cada projeto via Spring Initializr**

Acesse [https://start.spring.io](https://start.spring.io) e crie **três projetos separados** com as seguintes configurações:

| Campo | Valor |
|---|---|
| Project | Maven |
| Language | Java |
| Spring Boot | 3.x (mais recente estável) |
| Group | `com.biblioteca` |
| Artifact | `admin-service` / `librarian-service` / `user-service` |
| Packaging | Jar |
| Java | 21 |

**Dependências a selecionar para os 3 projetos:**

```
✅ Spring Web
✅ Spring Data JPA
✅ PostgreSQL Driver
✅ Spring Security
✅ Lombok
✅ Validation
✅ Spring AOP (AspectJ)
```

Adicionar manualmente no `pom.xml` (JWT):

```xml
<!-- JWT -->
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-api</artifactId>
    <version>0.11.5</version>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-impl</artifactId>
    <version>0.11.5</version>
    <scope>runtime</scope>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-jackson</artifactId>
    <version>0.11.5</version>
    <scope>runtime</scope>
</dependency>
```

---

### FASE 2 — Configuração do Banco de Dados

**Passo 2 — `application.properties` de cada serviço**

Cada serviço tem sua **porta diferente**. Altere apenas o `server.port`:

```properties
# ── Porta (mude para cada serviço: 8081 / 8082 / 8083) ──
server.port=8081

# ── Banco de Dados ──
spring.datasource.url=jdbc:postgresql://localhost:5432/biblioteca_db
spring.datasource.username=postgres
spring.datasource.password=123456
spring.datasource.driver-class-name=org.postgresql.Driver

# ── JPA / Hibernate ──
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect
spring.jpa.properties.hibernate.format_sql=true

# ── JWT ──
jwt.secret=SUA_CHAVE_SECRETA_SUPER_LONGA_AQUI_256_BITS
jwt.expiration=86400000
```

> [!WARNING]
> Quando rodar via Docker, substituir `localhost` por `db` (nome do container) na URL do datasource.

---

### FASE 3 — Camada Model (Entidades JPA)

**Passo 3 — Criar as entidades no pacote `model/`**

**`User.java`** (compartilhado pelos 3 serviços)

```java
@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String passwordHash;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role; // ADMIN, LIBRARIAN, USER

    @Column(updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}
```

**`Book.java`** (Librarian Service + User Service)

```java
@Entity
@Table(name = "books")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Book {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String author;

    @Column(unique = true)
    private String isbn;

    private int totalCopies;
    private int availableCopies;
}
```

**`Loan.java`** (User Service + Librarian Service)

```java
@Entity
@Table(name = "loans")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Loan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "book_id", nullable = false)
    private Book book;

    private LocalDate loanDate;
    private LocalDate dueDate;
    private LocalDate returnDate;

    @Enumerated(EnumType.STRING)
    private LoanStatus status; // ACTIVE, RETURNED, OVERDUE
}
```

**`AuditLog.java`** (Admin Service)

```java
@Entity
@Table(name = "audit_logs")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;
    private String userName;
    private String action;
    private LocalDateTime timestamp = LocalDateTime.now();
}
```

**`SystemParameter.java`** (Admin Service)

```java
@Entity
@Table(name = "system_parameters")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SystemParameter {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String paramKey;   // ex: "DAILY_PENALTY"

    @Column(nullable = false)
    private String paramValue; // ex: "5.00"
}
```

---

### FASE 4 — Camada Repository

**Passo 4 — Criar interfaces no pacote `repository/`**

```java
// UserRepository.java
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
}

// BookRepository.java
public interface BookRepository extends JpaRepository<Book, Long> {
    List<Book> findByAvailableCopiesGreaterThan(int copies);
}

// LoanRepository.java
public interface LoanRepository extends JpaRepository<Loan, Long> {
    List<Loan> findByUserAndStatus(User user, LoanStatus status);
    long countByUserAndStatus(User user, LoanStatus status);
}

// AuditLogRepository.java
public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {
    List<AuditLog> findAllByOrderByTimestampDesc();
}

// SystemParameterRepository.java
public interface SystemParameterRepository extends JpaRepository<SystemParameter, Long> {
    Optional<SystemParameter> findByParamKey(String key);
}
```

---

### FASE 5 — Camada Service (Regras de Negócio)

**Passo 5 — Criar serviços no pacote `service/`**

**`LoanService.java`** — regra do limite de 3 livros

```java
@Service
@RequiredArgsConstructor
public class LoanService {

    private final LoanRepository loanRepository;
    private final BookRepository bookRepository;
    private static final int MAX_LOANS = 3;

    public Loan createLoan(User user, Long bookId) {
        // RN-01: limite de 3 livros
        long activeLoans = loanRepository.countByUserAndStatus(user, LoanStatus.ACTIVE);
        if (activeLoans >= MAX_LOANS) {
            throw new BusinessException("Limite de " + MAX_LOANS + " empréstimos simultâneos atingido.");
        }

        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new ResourceNotFoundException("Livro não encontrado."));

        // RN-03: verificar disponibilidade
        if (book.getAvailableCopies() <= 0) {
            throw new BusinessException("Nenhum exemplar disponível para empréstimo.");
        }

        book.setAvailableCopies(book.getAvailableCopies() - 1);
        bookRepository.save(book);

        Loan loan = new Loan();
        loan.setUser(user);
        loan.setBook(book);
        loan.setLoanDate(LocalDate.now());
        loan.setDueDate(LocalDate.now().plusDays(14)); // prazo padrão de 14 dias
        loan.setStatus(LoanStatus.ACTIVE);

        return loanRepository.save(loan);
    }
}
```

**`PenaltyCalculationService.java`** — Single Responsibility (SOLID-S)

```java
@Service
@RequiredArgsConstructor
public class PenaltyCalculationService {

    private final SystemParameterRepository paramRepo;

    public BigDecimal calculate(LocalDate dueDate, LocalDate returnDate) {
        if (!returnDate.isAfter(dueDate)) return BigDecimal.ZERO;

        long daysLate = ChronoUnit.DAYS.between(dueDate, returnDate);
        BigDecimal dailyRate = paramRepo.findByParamKey("DAILY_PENALTY")
                .map(p -> new BigDecimal(p.getParamValue()))
                .orElse(new BigDecimal("5.00")); // valor padrão RN-02

        return dailyRate.multiply(BigDecimal.valueOf(daysLate));
    }
}
```

---

### FASE 6 — Segurança (JWT + Spring Security)

**Passo 6 — Criar classes no pacote `config/security/`**

**`JwtUtil.java`** — geração e validação de tokens

```java
@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration}")
    private long expiration;

    public String generateToken(String email, String role) {
        return Jwts.builder()
                .setSubject(email)
                .claim("role", role)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(Keys.hmacShaKeyFor(secret.getBytes()), SignatureAlgorithm.HS256)
                .compact();
    }

    public Claims extractClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(Keys.hmacShaKeyFor(secret.getBytes()))
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public boolean isValid(String token) {
        try {
            extractClaims(token);
            return true;
        } catch (JwtException e) {
            return false;
        }
    }
}
```

**`SecurityConfig.java`** — configuração de rotas protegidas

```java
@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll()   // rotas públicas
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
```

**`JwtAuthFilter.java`** — filtro que valida o token em cada requisição

```java
@Component
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            if (jwtUtil.isValid(token)) {
                Claims claims = jwtUtil.extractClaims(token);
                UsernamePasswordAuthenticationToken auth =
                    new UsernamePasswordAuthenticationToken(
                        claims.getSubject(), null,
                        List.of(new SimpleGrantedAuthority("ROLE_" + claims.get("role")))
                    );
                SecurityContextHolder.getContext().setAuthentication(auth);
            }
        }
        filterChain.doFilter(request, response);
    }
}
```

---

### FASE 7 — Seed de Inicialização

**Passo 7 — `DataSeeder.java`** no pacote `config/`

```java
@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder encoder;

    @Override
    public void run(String... args) {
        if (userRepository.count() == 0) { // executa só uma vez (RN-06)
            userRepository.saveAll(List.of(
                new User(null, "Milena",  "milena@gmail.com",
                         encoder.encode("Milena@123"),  Role.ADMIN,     null),
                new User(null, "Adam",    "adam@gmail.com",
                         encoder.encode("Adam@123"),    Role.LIBRARIAN, null),
                new User(null, "Gabriel", "gabriel@gmail.com",
                         encoder.encode("Gabriel@123"), Role.USER,      null)
            ));
            System.out.println("✅ Seed de dados executado com sucesso.");
        }
    }
}
```

---

### FASE 8 — Auditoria com Spring AOP

**Passo 8 — `AuditAspect.java`** no pacote `config/aspect/`

```java
@Aspect
@Component
@RequiredArgsConstructor
public class AuditAspect {

    private final AuditLogRepository auditLogRepository;

    // Intercepta qualquer método em classes @Service anotadas com @Auditable
    @AfterReturning("@annotation(auditable)")
    public void logAction(JoinPoint joinPoint, Auditable auditable) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String userEmail = auth != null ? auth.getName() : "sistema";

        AuditLog log = new AuditLog();
        log.setUserName(userEmail);
        log.setAction(auditable.action());
        log.setTimestamp(LocalDateTime.now());

        auditLogRepository.save(log);
    }
}

// Anotação customizada
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface Auditable {
    String action();
}
```

**Uso nos métodos críticos:**

```java
@Auditable(action = "DELETAR_LIVRO")
public void deleteBook(Long id) { ... }

@Auditable(action = "ALTERAR_TAXA_MULTA")
public void updatePenaltyRate(BigDecimal newRate) { ... }
```

---

### FASE 9 — Controllers REST

**Passo 9 — Criar controllers no pacote `controller/`**

**Exemplo: `AuthController.java`** (User Service — rota pública)

```java
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder encoder;
    private final JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody @Valid RegisterRequest req) {
        if (userRepository.existsByEmail(req.getEmail())) {
            return ResponseEntity.status(409).body("E-mail já cadastrado.");
        }
        User user = new User(null, req.getName(), req.getEmail(),
                             encoder.encode(req.getPassword()), Role.USER, null);
        userRepository.save(user);
        return ResponseEntity.status(201).body("Usuário criado com sucesso.");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody @Valid LoginRequest req) {
        User user = userRepository.findByEmail(req.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado."));

        if (!encoder.matches(req.getPassword(), user.getPasswordHash())) {
            return ResponseEntity.status(401).body("Credenciais inválidas.");
        }

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name());
        return ResponseEntity.ok(Map.of("token", token));
    }
}
```

**Exemplo: `LoanController.java`** (User Service — rota protegida)

```java
@RestController
@RequestMapping("/api/users/loans")
@RequiredArgsConstructor
public class LoanController {

    private final LoanService loanService;
    private final UserRepository userRepository;

    @PostMapping
    public ResponseEntity<?> createLoan(@RequestBody LoanRequest req,
                                        Authentication auth) {
        User user = userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado."));
        Loan loan = loanService.createLoan(user, req.getBookId());
        return ResponseEntity.status(201).body(loan);
    }

    @PostMapping("/{id}/return")
    public ResponseEntity<?> returnLoan(@PathVariable Long id) {
        loanService.returnLoan(id);
        return ResponseEntity.ok("Devolução registrada com sucesso.");
    }
}
```

---

### FASE 10 — Tratamento Global de Exceções

**Passo 10 — `GlobalExceptionHandler.java`** no pacote `exception/`

```java
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<ErrorResponse> handleBusiness(BusinessException ex) {
        return ResponseEntity.status(400)
                .body(new ErrorResponse(400, ex.getMessage()));
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleNotFound(ResourceNotFoundException ex) {
        return ResponseEntity.status(404)
                .body(new ErrorResponse(404, ex.getMessage()));
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ErrorResponse> handleForbidden(AccessDeniedException ex) {
        return ResponseEntity.status(403)
                .body(new ErrorResponse(403, "Acesso não autorizado para este perfil."));
    }

    record ErrorResponse(int status, String message) {}
}
```

---

### FASE 11 — Containerização com Docker

**Passo 11 — `Dockerfile`** (mesmo para os 3 serviços)

```dockerfile
FROM eclipse-temurin:17-jdk-alpine AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN ./mvnw package -DskipTests

FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8081
ENTRYPOINT ["java", "-jar", "app.jar"]
```

**Passo 12 — `docker-compose.yml`** na raiz do projeto

```yaml
version: '3.8'

networks:
  biblioteca-net:

services:
  db:
    image: postgres:15-alpine
    container_name: biblioteca_db
    environment:
      POSTGRES_DB: biblioteca_db
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: "123456"
    ports:
      - "5432:5432"
    networks:
      - biblioteca-net
    volumes:
      - pg_data:/var/lib/postgresql/data

  admin-service:
    build: ./admin-service
    container_name: admin_service
    ports:
      - "8081:8081"
    environment:
      SPRING_DATASOURCE_URL: jdbc:postgresql://db:5432/biblioteca_db
      SPRING_DATASOURCE_USERNAME: postgres
      SPRING_DATASOURCE_PASSWORD: "123456"
    depends_on:
      - db
    networks:
      - biblioteca-net

  librarian-service:
    build: ./librarian-service
    container_name: librarian_service
    ports:
      - "8082:8082"
    environment:
      SPRING_DATASOURCE_URL: jdbc:postgresql://db:5432/biblioteca_db
      SPRING_DATASOURCE_USERNAME: postgres
      SPRING_DATASOURCE_PASSWORD: "123456"
    depends_on:
      - db
    networks:
      - biblioteca-net

  user-service:
    build: ./user-service
    container_name: user_service
    ports:
      - "8083:8083"
    environment:
      SPRING_DATASOURCE_URL: jdbc:postgresql://db:5432/biblioteca_db
      SPRING_DATASOURCE_USERNAME: postgres
      SPRING_DATASOURCE_PASSWORD: "123456"
    depends_on:
      - db
    networks:
      - biblioteca-net

volumes:
  pg_data:
```

---

### Resumo do Roteiro por Fase

```
FASE 1  → Criar projetos no Spring Initializr + adicionar dependência JWT
FASE 2  → Configurar application.properties (porta + banco + JWT secret)
FASE 3  → Criar entidades JPA (User, Book, Loan, AuditLog, SystemParameter)
FASE 4  → Criar interfaces Repository (JpaRepository)
FASE 5  → Implementar Services com regras de negócio (LoanService, PenaltyCalculationService)
FASE 6  → Configurar Spring Security + JWT (JwtUtil, SecurityConfig, JwtAuthFilter)
FASE 7  → Implementar DataSeeder (CommandLineRunner) com BCrypt
FASE 8  → Configurar AOP de auditoria (@Auditable + AuditAspect)
FASE 9  → Criar Controllers REST (@RestController)
FASE 10 → Implementar GlobalExceptionHandler (@RestControllerAdvice)
FASE 11 → Criar Dockerfile para cada serviço + docker-compose.yml na raiz
```

---

*PRD gerado em 14/06/2026 — Sistema de Biblioteca Distribuído v1.0*
