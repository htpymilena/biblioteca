# Documento de Requisitos (PRD) - Sistema de Biblioteca Distribuído

### Parte 1: Especificação do Sistema de Biblioteca

**Objetivo:** Construir um sistema de biblioteca com três tipos de acesso (Usuário comum, Administrador e Bibliotecário), com regras de negócio e portas de rede isoladas por perfil.

**Stack Tecnológica:** Spring Boot (Back-end REST), React (Front-end), PostgreSQL (Banco de Dados) e Arquitetura MVC (interna aos serviços).

**Contas Padrão (Seed de Inicialização):**
No momento da inicialização do banco de dados, o sistema deve garantir a criação das seguintes contas padrão:

* **Administrador:**
* Email: milena@gmail.com
* Senha: Milena@123


* **Bibliotecário:**
* Email: adam@gmail.com
* Senha: Adam@123


* **Usuário:**
* Email: gabriel@gmail.com
* Senha: Gabriel@123



---

### Parte 2: Funcionalidades por Perfil (Role)

**1. Funcionalidades para o Usuário:**

* Criar conta de forma independente.
* Buscar livros no Catálogo.
* Visualizar detalhes da obra e a disponibilidade de exemplares.
* Realizar empréstimo de exemplares (Regra de Negócio: **O usuário pode ter no máximo 3 livros emprestados simultaneamente**).
* Devolver livros emprestados.
* Pagar taxas de atraso via Simulador de Pagamentos (R$ 5,00/dia base).
* Solicitar notificação de disponibilidade para empréstimo de livros sem estoque atual.
* Gerenciar perfil: Ver dados, Editar perfil, Trocar senha.

**2. Funcionalidades para o Bibliotecário:**

* CRUD de livros para o catálogo.
* Visualizar detalhes completos de catálogo e estoque.
* Gerenciar fluxo: Ver histórico de empréstimos, exemplares atualmente emprestados, devolvidos e reservados.
* Gerenciar perfil: Ver dados, Editar perfil, Trocar senha.

**3. Funcionalidades para o Administrador:**

* CRUD para usuários, bibliotecários e admin (contas de Bibliotecário e Admin só podem ser criadas por um Admin).
* Gestão de Parâmetros: Alterar o valor diário da taxa de atraso dinamicamente através de uma tela de configuração.
* Auditoria de Sistema (Logs): Tela dedicada para monitorar a trilha de auditoria, exibindo o Usuário (Nome + ID), a Ação executada (ex: Deleção de Livro, Mudança de Taxa) e a Data/Hora.

---

### Parte 3: Requisitos Não Funcionais e Tratamento de Exceções

* **Segurança:** Uso de JWT (JSON Web Tokens) para autenticação e autorização centralizada. As senhas devem ser obrigatoriamente armazenadas no banco de dados com hashing forte (Bcrypt ou Argon2).
* **Tratamento de Exceções:** O sistema deve prever e tratar exceções de forma coesa, retornando mensagens claras ao Front-end. Exemplos previstos:
* Usuário tenta pegar um livro emprestado, mas não há exemplares disponíveis (Retornar erro `400 Bad Request` ou `409 Conflict` com mensagem amigável).
* Usuário tenta pegar um 4º livro emprestado, ferindo o limite da regra de negócio.
* Tentativa de acesso a rotas não autorizadas para o perfil do token (Retornar erro `403 Forbidden`).



---

### Parte 4: Explicação Técnica e Arquitetural (O que deve ser feito)

Para atender à exigência de utilizar portas diferentes a partir de cada role, aplicar SOLID e usar Spring Boot + MVC, a implementação deve seguir este roteiro:

**1. Adaptação do Padrão MVC para Sistemas Distribuídos:**

* **Model:** Suas entidades JPA (`User`, `Book`, `Loan`) e a lógica de acesso ao banco (PostgreSQL).
* **Controller:** Serão `@RestController` no Spring Boot, responsáveis por receber as requisições HTTP e devolver dados no formato JSON.
* **View:** Será 100% gerenciada pelo React, que fará chamadas `fetch` ou `axios` para as diferentes portas do back-end.

**2. Distribuição Física (Serviços e Portas):**
Serão criados **três módulos ou projetos Spring Boot independentes**, cada um responsável pelo domínio de uma Role:

* **Admin Service (Porta 8081):** Gestão de usuários, parâmetros de taxas e auditoria.
* **Librarian Service (Porta 8082):** CRUD de livros e gestão do fluxo de estoque.
* **User Service (Porta 8083):** Catálogo público, pagamentos e registro de empréstimos.

**3. Aplicação dos Princípios SOLID:**

* **S (Single Responsibility):** Isolar regras complexas. Ex: `PenaltyCalculationService` para multas.
* **D (Dependency Inversion):** *Controllers* dependem de interfaces (`LoanRepository`, `BookService`), permitindo injeção de dependência via construtor.

**4. Inicialização do Banco de Dados (Seed):**
Utilizar o `CommandLineRunner` do Spring Boot para verificar se as tabelas estão vazias na inicialização e executar o salvamento das contas padrão com senhas criptografadas pelo `BCryptPasswordEncoder`.

**5. Auditoria de Logs:**
Implementar Spring AOP (Aspect-Oriented Programming) ou eventos de domínio para interceptar métodos críticos (ex: `deleteBook()`) e gravar na tabela de Logs (Quem, O quê, Quando) sem poluir a regra de negócio.

---

### Parte 5: Infraestrutura e Execução com Docker

Para garantir a consistência e o isolamento dos serviços distribuídos, **todo o ecossistema do projeto deve ser containerizado**, abolindo a necessidade de instalações locais. O projeto utilizará **Docker e Docker Compose** para orquestrar os serviços e o banco de dados.

O arquivo `docker-compose.yml` será responsável por:

* **Gerenciamento de Banco de Dados Automático:** Subir a imagem oficial do PostgreSQL e criar o banco de dados inicial automaticamente através de variáveis de ambiente (ex: `POSTGRES_DB`), garantindo que o banco esteja pronto sem intervenção manual.
* **Isolamento de Processos:** Subir as três instâncias Spring Boot (`Admin`, `Librarian`, `User`) em containers separados e mapeá-las para as portas `8081`, `8082` e `8083`.
* **Comunicação Interna:** Criar uma rede (network) interna no Docker para que os serviços Spring Boot possam se comunicar nativamente com o container do PostgreSQL usando o nome do serviço (ex: `jdbc:postgresql://db:5432/nome_do_banco`).

**Execução:** Para iniciar a aplicação inteira do zero (Banco de Dados + API Gateway + Microserviços), basta rodar o comando:

```bash
docker-compose up --build

```

---

### Parte 6: Mapeamento de Endpoints da API

Abaixo, a estrutura base exigida para os endpoints de cada serviço:

**Admin Service (Porta 8081)**

* `POST /api/admin/users` - Criação de novos usuários/bibliotecários/admins.
* `GET /api/admin/users` - Listagem de usuários do sistema.
* `PUT /api/admin/users/{id}` - Atualização de permissões/dados.
* `DELETE /api/admin/users/{id}` - Remoção de usuários.
* `PUT /api/admin/parameters/penalty` - Altera a taxa diária de atraso.
* `GET /api/admin/audit/logs` - Retorna a trilha de auditoria.

**Librarian Service (Porta 8082)**

* `POST /api/librarian/books` - Adiciona novo livro ao acervo.
* `GET /api/librarian/books` - Lista livros detalhados (incluindo estoque interno).
* `PUT /api/librarian/books/{id}` - Atualiza dados do livro/estoque.
* `DELETE /api/librarian/books/{id}` - Remove livro do acervo.
* `GET /api/librarian/loans/history` - Visão geral de exemplares emprestados/devolvidos.
* `GET /api/librarian/profile` - Visualizar dados do bibliotecário logado.

**User Service (Porta 8083)**

* `POST /api/auth/register` - Registro público de novo usuário comum.
* `GET /api/users/catalog` - Busca pública de livros disponíveis.
* `GET /api/users/catalog/{id}` - Detalhes do livro e disponibilidade.
* `POST /api/users/loans` - Realiza o empréstimo (valida limite de 3 livros e estoque).
* `POST /api/users/loans/{id}/return` - Registra devolução.
* `POST /api/users/payments/simulate` - Simula e processa pagamento de multas.
* `POST /api/users/notifications/request` - Solicita alerta para livro sem estoque.

meu owner no postgre é postgres e a senha é 123456 e o banco de dados tem que ter o nome de biblioteca_DB