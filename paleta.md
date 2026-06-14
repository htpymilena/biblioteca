front-end context:
Esse modelo de documento que você criou é excelente para trabalhar com IAs. Ele tira toda a ambiguidade de design, roteamento e regras de negócio do Front-end.

Para adaptar esse documento para o nosso **Sistema de Biblioteca Distribuído**, nós precisamos trocar o domínio de negócio (de energia para livros), aplicar a nova paleta de cores (Azul e Branco) e, o mais importante, alinhar os endpoints com as **três roles e portas** que definimos no PRD.

Copie o texto abaixo e envie para o seu agente. Ele já está completamente adaptado para a arquitetura que desenhamos.

---

# 🖥️ Frontend Context — Sistema de Biblioteca Distribuído

> **Stack:** React + Vite + TypeScript
> **Arquitetura Backend:** Microsserviços Distribuídos por Roles
> **Base URLs:**
> * Gateway/API Principal: `http://localhost:8080/api` (ou chamadas diretas para as portas abaixo caso não haja gateway)
> * Admin Service: `http://localhost:8081/api/admin`
> * Librarian Service: `http://localhost:8082/api/librarian`
> * User Service: `http://localhost:8083/api/users`
> 
> 

---

## 1. Paleta de Cores e Design System

### 1.1 Paleta Principal (Azul + Branco)

| Token | Valor | Uso |
| --- | --- | --- |
| `--blue-950` | `#172554` | Sidebar dark, textos sobre fundo claro, tipografia principal |
| `--blue-900` | `#1e3a8a` | Header, navbar ativa |
| `--blue-700` | `#1d4ed8` | Botões primários, links ativos |
| `--blue-500` | `#3b82f6` | Destaques, ícones de informação, badges ativos |
| `--blue-300` | `#93c5fd` | Bordas suaves, hover states |
| `--blue-100` | `#dbeafe` | Backgrounds de cards de livros, highlight rows |
| `--blue-50` | `#eff6ff` | Fundo geral das páginas |
| `--white` | `#ffffff` | Cards, modals, inputs |

### 1.2 Tons de Branco (Hierarquia e Profundidade)

> Usar tons de branco cria camadas visuais sem precisar de cores fortes.

| Token | Valor | Uso |
| --- | --- | --- |
| `--white-pure` | `#ffffff` | Superfície mais alta: modals, dropdowns, tooltips |
| `--white-card` | `#fafafa` | Cards principais, painéis de conteúdo |
| `--white-soft` | `#f5f5f5` | Fundo de seções internas, áreas de formulário |
| `--white-muted` | `#f0f0f0` | Linhas separadoras, bordas sutis, table stripes |
| `--white-dim` | `#e8e8e8` | Inputs desabilitados, placeholders de skeleton |

### 1.3 Cores de Suporte (Status e Alertas)

| Token | Valor | Uso |
| --- | --- | --- |
| `--emerald-500` | `#10b981` | Sucesso, Livro Disponível |
| `--amber-400` | `#fbbf24` | Livro Reservado, Avisos de prazo próximo |
| `--red-500` | `#ef4444` | Erros, Multas por atraso, Livro Indisponível |
| `--gray-100` | `#f3f4f6` | Skeleton loaders |
| `--gray-500` | `#6b7280` | Textos secundários, autores, ISBN |

---

## 2. Regras Globais de UX

### 2.1 Empty States

Quando uma lista retornar vazia, exibir tela amigável com ilustração SVG e CTA:

| Contexto | Mensagem | CTA |
| --- | --- | --- |
| Sem empréstimos | "Você não possui livros emprestados no momento." | "Ir para o Catálogo" |
| Catálogo vazio | "Nenhum livro cadastrado no acervo." | "Adicionar Livro" (Bibliotecário) |
| Sem usuários | "Nenhum usuário encontrado com este filtro." | "Cadastrar Usuário" (Admin) |
| Sem multas | "Tudo certo! Você não possui taxas pendentes." | — |

### 2.2 Tratamento de Erros e Limites

* **Regra de Negócio (Limite de Empréstimos):** Se a API retornar erro `409 Conflict` ou `400 Bad Request` indicando que o usuário já atingiu o limite de 3 livros, exibir um Toast de erro claro ("Limite de 3 livros simultâneos atingido").
* **Interceptor Axios:** Se qualquer endpoint retornar `401 Unauthorized` ou `403 Forbidden`, limpar o JWT do `localStorage` e redirecionar para `/login`.

### 2.3 Role Isolation

> **Regra de Ouro:** O que o usuário não pode fazer **não aparece na tela**.

* Renderização condicional baseada na `role` (`USER`, `LIBRARIAN`, `ADMIN`) presente no payload do JWT armazenado.
* A Sidebar e os Menus são completamente distintos para cada *role*.

---

## 3. Catálogo de Endpoints por Role

### 3.1 🔓 Públicos (Sem autenticação)

| Método | Endpoint (Porta 8083) | Tela | Requisitos | Exceções |
| --- | --- | --- | --- | --- |
| `POST` | `/api/auth/register` | Cadastro | `nome`, `email`, `senha` | 400: e-mail já cadastrado |
| `POST` | `/api/auth/login` | Login | `email`, `senha` | 401: credenciais inválidas |

### 3.2 👤 Usuário Comum (Porta 8083)

| Método | Endpoint | Funcionalidade | Exceções Relevantes |
| --- | --- | --- | --- |
| `GET` | `/api/users/catalog` | Buscar livros no Catálogo | — |
| `GET` | `/api/users/catalog/{id}` | Detalhes da obra e estoque | 404: Livro não encontrado |
| `POST` | `/api/users/loans` | Realizar empréstimo | 400: Sem estoque / Limite de 3 excedido |
| `POST` | `/api/users/loans/{id}/return` | Devolver livro | 404: Empréstimo não localizado |
| `POST` | `/api/users/payments/simulate` | Simular pagamento de taxa | — |
| `POST` | `/api/users/notifications/request` | Pedir alerta de disponibilidade | 400: Livro já disponível |
| `GET/PUT` | `/api/users/profile` | Gerenciar próprio perfil | — |

### 3.3 📚 Bibliotecário (Porta 8082)

| Método | Endpoint | Funcionalidade | Exceções Relevantes |
| --- | --- | --- | --- |
| `GET/POST` | `/api/librarian/books` | Listar/Criar livros no acervo | 400: ISBN duplicado |
| `PUT/DEL` | `/api/librarian/books/{id}` | Editar/Remover livro | 400: Livro possui empréstimos ativos |
| `GET` | `/api/librarian/loans/history` | Histórico global de empréstimos | — |
| `GET/PUT` | `/api/librarian/profile` | Gerenciar próprio perfil | — |

### 3.4 👑 Administrador (Porta 8081)

| Método | Endpoint | Funcionalidade | Exceções Relevantes |
| --- | --- | --- | --- |
| `GET/POST` | `/api/admin/users` | Listar/Criar contas (todas as roles) | 400: Email duplicado |
| `PUT/DEL` | `/api/admin/users/{id}` | Editar/Remover usuário | 403: Admin não pode se auto-deletar |
| `PUT` | `/api/admin/parameters/penalty` | Alterar taxa diária (Base R$5,00) | 400: Valor negativo |
| `GET` | `/api/admin/audit/logs` | Trilha de auditoria (Ações de sistema) | — |

---

## 4. Estrutura de Rotas e Navegação

### 4.1 Árvore de Rotas

```text
/login
/cadastro

/user/
  catalog · catalog/:id · loans · payments · profile

/librarian/
  books · books/new · books/:id · loans-history · profile

/admin/
  users · users/new · parameters · audit-logs

```

### 4.2 Sidebar por Role

* **Usuário:** Catálogo de Livros · Meus Empréstimos · Pagamentos/Taxas · Meu Perfil
* **Bibliotecário:** Gestão de Acervo · Adicionar Livro · Histórico de Empréstimos · Meu Perfil
* **Administrador:** Gestão de Usuários · Parâmetros do Sistema (Taxas) · Trilha de Auditoria

---

## 5. Componentes Globais Necessários

| Componente | Descrição |
| --- | --- |
| `PrivateRoute` | Verifica JWT e *role* antes de renderizar a rota correspondente |
| `BookCard` | Card visual para o catálogo (Capa, Título, Autor, Badge de Disponibilidade) |
| `ErrorBoundary` | Isola erros de componentes filhos (ex: falha ao carregar o catálogo) |
| `SkeletonCard` | Placeholder de carregamento para a grade de livros |
| `EmptyState` | Tela vazia com ilustração SVG e CTA contextual |
| `StatusBadge` | Badge colorido (`Disponível`, `Emprestado`, `Atrasado`) |
| `ConfirmModal` | Modal de confirmação (Ex: "Confirmar devolução?", "Deletar usuário?") |
| `DataTable` | Tabela paginada (usada para Auditoria, Histórico e Gestão de Usuários) |
| `axiosInstance` | Instância Axios com envio automático do header `Authorization: Bearer <token>` |