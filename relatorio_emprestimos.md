# 📊 Relatório de Empréstimos e Taxas (Sistema de Biblioteca)

Este relatório descreve o estado inicial do banco de dados populado pelo `DataSeeder`, detalhando os usuários cadastrados com suas respectivas senhas, livros emprestados e a situação das taxas (multas) por atraso.

> [!NOTE]
> A multa é calculada à taxa de **R$ 5,00 por dia de atraso**, contando a partir da data de vencimento (`dueDate`) até a data de devolução (`returnDate`), ou até o dia atual se o livro ainda não foi devolvido.

---

## 👥 1. Contas de Usuários Cadastradas

| Nome | E-mail | Senha de Acesso | Perfil (Role) |
| :--- | :--- | :--- | :--- |
| **Milena** | `milena@gmail.com` | `Milena@123` | `ADMIN` |
| **Adam** | `adam@gmail.com` | `Adam@123` | `LIBRARIAN` |
| **Gabriel** | `gabriel@gmail.com` | `Gabriel@123` | `USER` |
| **Pedro Alvares Cabral** | `pedro@gmail.com` | `Pedro@123` | `USER` |
| **Dom Joao VI** | `domjoao@gmail.com` | `Domjoao@123` | `USER` |
| **Princesa Isabel** | `isabel@gmail.com` | `Isabel@123` | `USER` |
| **Anita Garibaldi** | `anita@gmail.com` | `Anita@123` | `USER` |
| **Getulio Vargas** | `getulio@gmail.com` | `Getulio@123` | `USER` |
| **Juscelino Kubitschek** | `juscelino@gmail.com` | `Juscelino@123` | `USER` |

---

## 📚 2. Detalhamento de Empréstimos e Pendências

### 👤 Pedro Alvares Cabral (`pedro@gmail.com`)
*   **Empréstimo 1: "Dom Casmurro"** (Machado de Assis)
    *   **Data de Empréstimo:** 20 dias atrás
    *   **Data de Vencimento:** 6 dias atrás
    *   **Devolução:** ❌ Não Devolvido
    *   **Status:** `EM ATRASO (OVERDUE)`
    *   **Dias de Atraso:** 6 dias
    *   **Multa:** 💰 **R$ 30,00**
    *   *Nota: O exemplar deste livro está atualmente esgotado na biblioteca.*
*   **Empréstimo 2: "Grande Sertão: Veredas"** (João Guimarães Rosa)
    *   **Data de Empréstimo:** 5 dias atrás
    *   **Data de Vencimento:** 9 dias no futuro
    *   **Devolução:** ❌ Não Devolvido
    *   **Status:** `ATIVO (ACTIVE)` (No prazo)

### 👤 Dom Joao VI (`domjoao@gmail.com`)
*   **Empréstimo 1: "O Alquimista"** (Paulo Coelho)
    *   **Data de Empréstimo:** 30 dias atrás
    *   **Data de Vencimento:** 16 dias atrás
    *   **Devolução:** Devolvido há 10 dias (com 6 dias de atraso)
    *   **Status:** `EM ATRASO (OVERDUE)` (Aguardando pagamento de multa)
    *   **Dias de Atraso:** 6 dias
    *   **Multa:** 💰 **R$ 30,00** (Livro devolvido fisicamente, restando pagar a multa)
*   **Empréstimo 2: "Memórias Póstumas de Brás Cubas"** (Machado de Assis)
    *   **Data de Empréstimo:** 25 dias atrás
    *   **Data de Vencimento:** 11 dias atrás
    *   **Devolução:** Devolvido há 11 dias (dentro do prazo)
    *   **Status:** `DEVOLVIDO (RETURNED)` (Multa quitada/isenta)

### 👤 Princesa Isabel (`isabel@gmail.com`)
*   **Empréstimo 1: "Iracema"** (José de Alencar)
    *   **Data de Empréstimo:** 10 dias atrás
    *   **Data de Vencimento:** 4 dias no futuro
    *   **Devolução:** ❌ Não Devolvido
    *   **Status:** `ATIVO (ACTIVE)` (No prazo)
*   **Empréstimo 2: "O Cortiço"** (Aluísio Azevedo)
    *   **Data de Empréstimo:** 30 dias atrás
    *   **Data de Vencimento:** 16 dias atrás
    *   **Devolução:** ❌ Não Devolvido
    *   **Status:** `EM ATRASO (OVERDUE)`
    *   **Dias de Atraso:** 16 dias
    *   **Multa:** 💰 **R$ 80,00**

### 👤 Anita Garibaldi (`anita@gmail.com`)
*   **Empréstimo 1: "Macunaíma"** (Mário de Andrade)
    *   **Data de Empréstimo:** 40 dias atrás
    *   **Data de Vencimento:** 26 dias atrás
    *   **Devolução:** ❌ Não Devolvido
    *   **Status:** `EM ATRASO (OVERDUE)`
    *   **Dias de Atraso:** 26 dias
    *   **Multa:** 💰 **R$ 130,00**
*   **Empréstimo 2: "Vidas Secas"** (Graciliano Ramos)
    *   **Data de Empréstimo:** 8 dias atrás
    *   **Data de Vencimento:** 6 dias no futuro
    *   **Devolução:** ❌ Não Devolvido
    *   **Status:** `ATIVO (ACTIVE)` (No prazo)

### 👤 Getulio Vargas (`getulio@gmail.com`)
*   **Empréstimo 1: "Capitães da Areia"** (Jorge Amado)
    *   **Data de Empréstimo:** 50 dias atrás
    *   **Data de Vencimento:** 36 dias atrás
    *   **Devolução:** ❌ Não Devolvido
    *   **Status:** `EM ATRASO (OVERDUE)`
    *   **Dias de Atraso:** 36 dias
    *   **Multa:** 💰 **R$ 180,00**
*   **Empréstimo 2: "A Hora da Estrela"** (Clarice Lispector)
    *   **Data de Empréstimo:** 60 dias atrás
    *   **Data de Vencimento:** 46 dias atrás
    *   **Devolução:** Devolvido há 44 dias (com 2 dias de atraso)
    *   **Status:** `EM ATRASO (OVERDUE)` (Aguardando pagamento de multa)
    *   **Dias de Atraso:** 2 dias
    *   **Multa:** 💰 **R$ 10,00**

### 👤 Juscelino Kubitschek (`juscelino@gmail.com`)
*   **Empréstimo 1: "Sagarana"** (João Guimarães Rosa)
    *   **Data de Empréstimo:** 4 dias atrás
    *   **Data de Vencimento:** 10 dias no futuro
    *   **Devolução:** ❌ Não Devolvido
    *   **Status:** `ATIVO (ACTIVE)` (No prazo)
*   **Empréstimo 2: "O Tempo e o Vento: O Continente"** (Erico Verissimo)
    *   **Data de Empréstimo:** 15 dias atrás
    *   **Data de Vencimento:** 1 dia atrás
    *   **Devolução:** ❌ Não Devolvido
    *   **Status:** `EM ATRASO (OVERDUE)`
    *   **Dias de Atraso:** 1 dia
    *   **Multa:** 💰 **R$ 5,00**

### 👤 Gabriel (`gabriel@gmail.com`)
*   **Empréstimo 1: "Auto da Compadecida"** (Ariano Suassuna)
    *   **Data de Empréstimo:** 12 dias atrás
    *   **Data de Vencimento:** 2 dias no futuro
    *   **Devolução:** ❌ Não Devolvido
    *   **Status:** `ATIVO (ACTIVE)` (No prazo)
*   **Empréstimo 2: "Laços de Família"** (Clarice Lispector)
    *   **Data de Empréstimo:** 3 dias atrás
    *   **Data de Vencimento:** 11 dias no futuro
    *   **Devolução:** ❌ Não Devolvido
    *   **Status:** `ATIVO (ACTIVE)` (No prazo)
