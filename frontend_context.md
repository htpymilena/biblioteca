# 🖥️ Frontend Context — Sistema de Biblioteca Distribuído

> **Stack:** React 18 + Vite + TypeScript
> **Roteamento:** React Router DOM v6
> **HTTP:** Axios
> **Estado Global:** Context API (`AuthContext`)
> **Base URLs (sem Gateway):**
> - User Service: `http://localhost:8083`
> - Librarian Service: `http://localhost:8082`
> - Admin Service: `http://localhost:8081`

---

## 1. Design System (Paleta de Cores)

### 1.1 Tokens CSS Principais (Azul + Branco)

```css
:root {
  /* Azul — identidade principal */
  --blue-950: #172554; /* Sidebar dark, tipografia principal */
  --blue-900: #1e3a8a; /* Header, navbar ativa */
  --blue-700: #1d4ed8; /* Botões primários, links ativos */
  --blue-500: #3b82f6; /* Destaques, ícones, badges */
  --blue-300: #93c5fd; /* Bordas suaves, hover states */
  --blue-100: #dbeafe; /* Background de cards de livros */
  --blue-50:  #eff6ff; /* Fundo geral das páginas */

  /* Branco — hierarquia e profundidade */
  --white-pure:  #ffffff; /* Modals, dropdowns, tooltips */
  --white-card:  #fafafa; /* Cards principais */
  --white-soft:  #f5f5f5; /* Fundo de seções internas */
  --white-muted: #f0f0f0; /* Linhas separadoras, table stripes */
  --white-dim:   #e8e8e8; /* Inputs desabilitados, skeletons */

  /* Suporte — Status e Alertas */
  --emerald-500: #10b981; /* Sucesso, Livro Disponível */
  --amber-400:   #fbbf24; /* Reservado, Prazo próximo */
  --red-500:     #ef4444; /* Erros, Multas, Indisponível */
  --gray-500:    #6b7280; /* Textos secundários, autores */
}
```

### 1.2 Tipografia

Google Fonts: **Inter** (weights: 400, 500, 600, 700)

- `h1`: 1.75rem / 700 / `--blue-950`
- `h2`: 1.25rem / 600 / `--blue-900`
- `body`: 1rem / 400 / `--blue-950`
- `text-secondary`: `--gray-500`

### 1.3 Classes de Botões

| Classe         | Fundo        | Uso                               |
|----------------|--------------|-----------------------------------|
| `.btn-primary` | `--blue-700` | Ação principal (Confirmar, Salvar) |
| `.btn-danger`  | `--red-500`  | Deletar, Remover                  |
| `.btn-ghost`   | transparente | Cancelar, Voltar                  |

---

## 2. Estrutura de Diretórios

```
frontend/
├── public/
├── src/
│   ├── components/           ← Componentes globais reutilizáveis
│   │   ├── BookCard.tsx
│   │   ├── DataTable.tsx
│   │   ├── EmptyState.tsx
│   │   ├── SkeletonCard.tsx
│   │   ├── StatusBadge.tsx
│   │   ├── ConfirmModal.tsx
│   │   └── Sidebar.tsx
│   ├── contexts/
│   │   └── AuthContext.tsx    ← JWT + role global
│   ├── pages/
│   │   ├── public/
│   │   │   ├── LoginPage.tsx
│   │   │   └── RegisterPage.tsx
│   │   ├── user/
│   │   │   ├── CatalogPage.tsx
│   │   │   ├── BookDetailPage.tsx
│   │   │   ├── LoansPage.tsx
│   │   │   ├── PaymentsPage.tsx
│   │   │   └── ProfilePage.tsx
│   │   ├── librarian/
│   │   │   ├── BookManagementPage.tsx
│   │   │   ├── BookFormPage.tsx
│   │   │   ├── LoansHistoryPage.tsx
│   │   │   └── LibrarianProfilePage.tsx
│   │   └── admin/
│   │       ├── UserManagementPage.tsx
│   │       ├── UserFormPage.tsx
│   │       ├── ParametersPage.tsx
│   │       └── AuditLogsPage.tsx
│   ├── services/
│   │   ├── userApi.ts         ← aponta para :8083
│   │   ├── librarianApi.ts    ← aponta para :8082
│   │   └── adminApi.ts        ← aponta para :8081
│   ├── router/
│   │   └── AppRouter.tsx
│   └── main.tsx
```

---

## 3. Árvore de Rotas

```
/login
/cadastro

/user/
  catalog · catalog/:id · loans · payments · profile

/librarian/
  books · books/new · books/:id · loans-history · profile

/admin/
  users · users/new · users/:id · parameters · audit-logs
```

---

## 4. Componentes Globais

| Componente      | Responsabilidade                                                              |
|-----------------|-------------------------------------------------------------------------------|
| `PrivateRoute`  | Verifica JWT e `role`; redireciona para `/login` se inválido                  |
| `AuthContext`   | Armazena `token`, `role`, `email`; expõe `login()` e `logout()`              |
| `axiosInstance` | Interceptor: injeta `Authorization: Bearer <token>` e trata 401/403 → logout |
| `BookCard`      | Card visual: título, autor, `StatusBadge`, botão "Ver detalhes"               |
| `StatusBadge`   | Badge: `Disponível` (emerald), `Emprestado` (amber), `Atrasado` (red)         |
| `SkeletonCard`  | Placeholder de carregamento (cor `--gray-100`)                                |
| `EmptyState`    | SVG ilustrativo + mensagem + CTA contextual                                   |
| `ConfirmModal`  | Modal genérico de confirmação (título, mensagem, onConfirm, onCancel)         |
| `DataTable`     | Tabela paginada com ações (Auditoria, Usuários, Histórico)                    |
| `Sidebar`       | Renderização condicional por `role`; fundo `--blue-950`                       |

### axiosInstance — Padrão para os 3 serviços

```ts
// src/services/userApi.ts
import axios from 'axios';

const userApi = axios.create({ baseURL: 'http://localhost:8083' });

userApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

userApi.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 || err.response?.status === 403) {
      localStorage.clear();
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default userApi;
```

---

## 5. Regras Globais de UX

- **Role Isolation:** O que o usuário não pode fazer **não aparece na tela**. Sidebar e menus são distintos por `role`.
- **Interceptor 401/403:** Limpar JWT e redirecionar para `/login`.
- **Limite de 3 livros:** Se API retornar `400`/`409`, Toast: *"Limite de 3 livros simultâneos atingido"*.
- **Empty States:** Toda lista vazia exibe `<EmptyState>` com SVG + CTA contextual.
- **Loading:** Todo fetch exibe `<SkeletonCard>` ou spinner enquanto aguarda.

---

## 6. Passo a Passo de Implementação das Telas

---

### FASE 1 — Fundação do Projeto

**Passo 1 — Criar o projeto**
```bash
npm create vite@latest frontend -- --template react-ts
cd frontend && npm install react-router-dom axios
```

**Passo 2 — `index.css`** com todos os tokens CSS da seção 1.1 e import da fonte Inter.

**Passo 3 — `AuthContext.tsx`**
- Interface: `{ token, role: 'USER'|'LIBRARIAN'|'ADMIN'|null, email }`
- `login(token)`: decodifica JWT (base64), extrai `role` e `email`, salva em `localStorage`.
- `logout()`: limpa `localStorage`, redireciona para `/login`.

**Passo 4 — `AppRouter.tsx`** com `<PrivateRoute role="USER|LIBRARIAN|ADMIN">` para cada grupo de rotas.

**Passo 5 — Criar `userApi.ts`, `librarianApi.ts`, `adminApi.ts`** com interceptors (ver padrão acima).

---

### FASE 2 — Telas Públicas

---

#### 📄 Login (`/login`)

| Item            | Detalhe                                         |
|-----------------|-------------------------------------------------|
| **Endpoint**    | `POST :8083/api/auth/login`                     |
| **Body**        | `{ email, password }`                           |
| **Resposta OK** | `{ token }` → salvar, redirecionar por role     |
| **Erro 401**    | Toast: *"E-mail ou senha inválidos"*            |

**Campos:** `email` (type email) · `password` (type password)

**Layout:** Card centralizado (`--white-pure`) sobre fundo `--blue-50`. Logo acima. Botão primário *"Entrar"*. Link *"Não tem conta? Cadastre-se"* → `/cadastro`.

**Redirecionamento pós-login:**
- `USER` → `/user/catalog`
- `LIBRARIAN` → `/librarian/books`
- `ADMIN` → `/admin/users`

---

#### 📄 Cadastro (`/cadastro`)

| Item            | Detalhe                                         |
|-----------------|-------------------------------------------------|
| **Endpoint**    | `POST :8083/api/auth/register`                  |
| **Body**        | `{ name, email, password }`                     |
| **Resposta 201**| Toast: *"Conta criada!"* → redirecionar `/login`|
| **Erro 400/409**| Toast: *"E-mail já cadastrado"*                 |

**Campos:** `name` · `email` · `password`

**Layout:** Mesmo padrão visual do Login. Link *"Já tenho conta → Login"*.

---

### FASE 3 — Telas do Usuário (Role: USER)

> **Sidebar:** Catálogo de Livros · Meus Empréstimos · Pagamentos/Taxas · Meu Perfil
> **Cor sidebar:** `--blue-950` com texto e ícones brancos

---

#### 📄 Catálogo (`/user/catalog`)

| Item            | Detalhe                                         |
|-----------------|-------------------------------------------------|
| **Endpoint**    | `GET :8083/api/users/catalog`                   |
| **Loading**     | Grid de 6 `<SkeletonCard>`                      |
| **Empty State** | *"Nenhum livro no acervo."*                     |

**Layout:** Grade 3-colunas de `<BookCard>`. Campo de busca local (filtro client-side por título/autor). Fundo do card: `--blue-100` (disponível) ou `--white-muted` (sem estoque).

---

#### 📄 Detalhe do Livro (`/user/catalog/:id`)

| Item             | Detalhe                                          |
|------------------|--------------------------------------------------|
| **GET**          | `GET :8083/api/users/catalog/{id}`               |
| **POST Empréstimo** | `POST :8083/api/users/loans` → `{ bookId }`   |
| **POST Notif.**  | `POST :8083/api/users/notifications/request`     |
| **Erro 404**     | Toast + botão *"Voltar ao Catálogo"*             |
| **Erro 400**     | Toast: *"Sem estoque"* ou *"Limite atingido"*    |

**Layout:** Dados completos do livro + `<StatusBadge>` grande. Botão *"Realizar Empréstimo"* (desabilitado se `availableCopies === 0`). Se indisponível: botão *"Solicitar Notificação"*.

---

#### 📄 Meus Empréstimos (`/user/loans`)

| Item            | Detalhe                                               |
|-----------------|-------------------------------------------------------|
| **GET**         | `GET :8083/api/users/loans`                           |
| **POST Devol.** | `POST :8083/api/users/loans/{id}/return`              |
| **Empty State** | *"Sem livros emprestados."* + CTA *"Ir ao Catálogo"*  |

**Layout:** Lista de cards com: título, data empréstimo, data vencimento, `<StatusBadge>`. Botão *"Devolver"* (só em `ACTIVE`) abre `<ConfirmModal>`. Se `OVERDUE`: valor da multa + botão *"Pagar Taxa"* → `/user/payments`.

---

#### 📄 Pagamento de Taxas (`/user/payments`)

| Item            | Detalhe                                              |
|-----------------|------------------------------------------------------|
| **Endpoint**    | `POST :8083/api/users/payments/simulate`             |
| **Resposta OK** | Toast: *"Pagamento simulado com sucesso!"*           |

**Layout:** Lista de multas (título do livro, dias de atraso, valor em `--red-500`). Botão *"Simular Pagamento"* por item. Sem multas: `<EmptyState>` → *"Sem taxas pendentes."*

---

#### 📄 Meu Perfil — Usuário (`/user/profile`)

| Item  | Detalhe                               |
|-------|---------------------------------------|
| **GET** | `GET :8083/api/auth/profile`        |
| **PUT** | `PUT :8083/api/auth/profile`        |

**Campos:** `name`, `email`, `password` (opcional na edição). Botão *"Salvar Alterações"*.

---

### FASE 4 — Telas do Bibliotecário (Role: LIBRARIAN)

> **Sidebar:** Gestão de Acervo · Adicionar Livro · Histórico de Empréstimos · Meu Perfil

---

#### 📄 Gestão de Acervo (`/librarian/books`)

| Item            | Detalhe                                                     |
|-----------------|-------------------------------------------------------------|
| **GET**         | `GET :8082/api/librarian/books`                             |
| **DELETE**      | `DELETE :8082/api/librarian/books/{id}`                     |
| **Erro 400 DEL**| Toast: *"Livro possui empréstimos ativos"*                  |
| **Empty State** | *"Nenhum livro no acervo."* + CTA *"Adicionar Livro"*       |

**Layout:** `<DataTable>` — colunas: Título, Autor, ISBN, Total, Disponível, Ações. Coluna Disponível colorida: `--emerald-500` (> 0) ou `--red-500` (= 0). Ações: *"Editar"* + *"Remover"*. Botão *"+ Adicionar Livro"* no header.

---

#### 📄 Formulário de Livro (`/librarian/books/new` e `/librarian/books/:id`)

| Item  | Detalhe                                         |
|-------|-------------------------------------------------|
| **POST** | `POST :8082/api/librarian/books`             |
| **PUT**  | `PUT :8082/api/librarian/books/{id}`         |
| **Erro 400** | Toast: *"ISBN já cadastrado"*           |

**Campos:** `title`, `author`, `isbn`, `totalCopies` (mín. 1), `availableCopies`. Na edição: pré-preencher buscando o livro pelo id.

---

#### 📄 Histórico de Empréstimos (`/librarian/loans-history`)

| Item  | Detalhe                                              |
|-------|------------------------------------------------------|
| **GET** | `GET :8082/api/librarian/loans/history`            |

**Layout:** `<DataTable>` — colunas: Usuário, Livro, Data Empréstimo, Data Devolução, Status + `<StatusBadge>`. Filtro client-side por status.

---

#### 📄 Perfil do Bibliotecário (`/librarian/profile`)

| Item  | Detalhe                                    |
|-------|--------------------------------------------|
| **GET** | `GET :8082/api/librarian/profile`        |
| **PUT** | `PUT :8082/api/librarian/profile`        |

Layout idêntico ao Perfil do Usuário.

---

### FASE 5 — Telas do Administrador (Role: ADMIN)

> **Sidebar:** Gestão de Usuários · Parâmetros do Sistema · Trilha de Auditoria

---

#### 📄 Gestão de Usuários (`/admin/users`)

| Item              | Detalhe                                                |
|-------------------|--------------------------------------------------------|
| **GET**           | `GET :8081/api/admin/users`                            |
| **DELETE**        | `DELETE :8081/api/admin/users/{id}`                    |
| **Erro 403 DEL**  | Toast: *"Admin não pode deletar a própria conta"*      |
| **Empty State**   | *"Nenhum usuário encontrado."*                         |

**Layout:** `<DataTable>` — colunas: Nome, E-mail, Role, Criado em, Ações. Role como `<StatusBadge>`: ADMIN (azul-escuro), LIBRARIAN (azul-médio), USER (cinza). Botão *"+ Criar Usuário"* no header.

---

#### 📄 Formulário de Usuário (`/admin/users/new` e `/admin/users/:id`)

| Item  | Detalhe                                          |
|-------|--------------------------------------------------|
| **POST** | `POST :8081/api/admin/users`                  |
| **PUT**  | `PUT :8081/api/admin/users/{id}`              |
| **Erro 400** | Toast: *"E-mail já cadastrado"*           |

**Campos:** `name`, `email`, `password` (obrig. na criação), `role` (select: USER / LIBRARIAN / ADMIN).

> [!IMPORTANT]
> Somente Admins podem atribuir roles `LIBRARIAN` ou `ADMIN` (RN-04). O campo `role` existe **apenas** nesta tela.

---

#### 📄 Parâmetros do Sistema (`/admin/parameters`)

| Item  | Detalhe                                                    |
|-------|------------------------------------------------------------|
| **PUT** | `PUT :8081/api/admin/parameters/penalty` → `{ value }`  |
| **Erro 400** | Toast: *"O valor não pode ser negativo"*          |

**Layout:** Formulário simples — campo numérico *"Taxa Diária de Atraso (R$)"* (padrão: `5.00`). Descrição abaixo. Botão *"Salvar"*.

---

#### 📄 Trilha de Auditoria (`/admin/audit-logs`)

| Item  | Detalhe                                         |
|-------|-------------------------------------------------|
| **GET** | `GET :8081/api/admin/audit/logs`              |

**Layout:** `<DataTable>` somente leitura — colunas: Usuário, Ação, Data/Hora. Ordenação: mais recente primeiro. Linhas alternadas com `--white-muted`.

---

## 7. Checklist de Implementação

```
FASE 1  → Setup Vite + TS + tokens CSS + AuthContext + AppRouter + axiosInstances
FASE 2  → LoginPage + RegisterPage
FASE 3  → Sidebar USER + CatalogPage + BookDetailPage + LoansPage + PaymentsPage + ProfilePage
FASE 4  → Sidebar LIBRARIAN + BookManagementPage + BookFormPage + LoansHistoryPage + ProfilePage
FASE 5  → Sidebar ADMIN + UserManagementPage + UserFormPage + ParametersPage + AuditLogsPage
FASE 6  → Componentes globais: BookCard, DataTable, EmptyState, SkeletonCard, StatusBadge, ConfirmModal
FASE 7  → Testes: login → redirecionamento por role → acesso negado em rotas de outra role
```

---

## 8. Contas Padrão para Teste

| Role          | E-mail            | Senha        | Rota de Acesso     |
|---------------|-------------------|--------------|--------------------|
| Administrador | milena@gmail.com  | `Milena@123` | `/admin/users`     |
| Bibliotecário | adam@gmail.com    | `Adam@123`   | `/librarian/books` |
| Usuário       | gabriel@gmail.com | `Gabriel@123`| `/user/catalog`    |

---

*Frontend Context — Sistema de Biblioteca Distribuído v1.0 — 14/06/2026*
