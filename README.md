---

## 🛡️ API Segura - Programação Orientada a Serviço

Projeto da disciplina de Programação Orientada a Serviço, com foco em **Segurança da Informação em APIs RESTful**.
Desenvolvido com Node.js, Express e Sequelize + SQLite.

---

### 📚 Objetivo

A proposta é estender a API desenvolvida na primeira unidade, adicionando:

* Gerenciamento de usuários (CRUD com validações e criptografia de senhas)
* Associação entre mensagens e seus autores
* Regras de segurança: autor não pode ser alterado
* Tratamento de erros e boas práticas REST

---

### ⚙️ Tecnologias

* Node.js + Express
* Sequelize ORM
* SQLite (banco de dados local)
* `express-validator` (validação de dados)
* `bcryptjs` (criptografia de senhas)

---

### 📦 Instalação

```bash
git clone https://github.com/seu-usuario/api-segura.git
npm install
```

---

### ▶️ Execução

```bash
npm start
```

Servidor rodará em:
📍 `http://localhost:3000`

---

### 🗃️ Estrutura de Pastas

```
.
│
├── models/            
│   ├── index.js       
│   ├── usuario.js     
│   └── mensagem.js    
│
├── routes/            
│   ├── usuarios.js
│   └── mensagens.js
│
├── app.js             
└── database.sqlite    

```

---

### 🔐 Validações de Usuário

Ao criar ou atualizar usuários, os seguintes critérios são obrigatórios:

* **Email:** único e em formato válido (`usuario@dominio.com`)
* **Nome:** não pode ser vazio
* **Senha:**

  * Mínimo de 8 caracteres
  * Pelo menos 1 número
  * 1 letra maiúscula e 1 minúscula
  * 1 caractere especial (`@!%*?&`)

---

### 💬 Regras de Mensagem

* Cada mensagem está vinculada a um **usuário autor**
* O autor é **definido automaticamente** como o usuário com `id = 1`
* A troca de autor **não é permitida** após a criação
* O conteúdo da mensagem pode ser atualizado

---

### 🧪 Exemplos de Endpoints

#### 🔹 Usuários

* `POST /usuarios` – Cria novo usuário
* `GET /usuarios` – Lista todos os usuários
* `GET /usuarios/:id` – Busca usuário pelo ID
* `PUT /usuarios/:id` – Atualiza usuário
* `DELETE /usuarios/:id` – Remove usuário

#### 🔹 Mensagens

* `POST /mensagens` – Cria nova mensagem (vinculada ao usuário ID 1)
* `GET /mensagens` – Lista todas as mensagens com autor
* `GET /mensagens/:id` – Busca mensagem pelo ID
* `PUT /mensagens/:id` – Atualiza conteúdo da mensagem
* `DELETE /mensagens/:id` – Remove mensagem

---

### 🧠 Próximos passos (etapas futuras da disciplina)

* Autenticação com JWT
* Login e logout de usuários
* Proteção de rotas privadas
* Controle de acesso (autorização)
* Logs e monitoramento

---

### 👩‍💻 Desenvolvido por

* Paula Braga
  Disciplina de Programação Orientada a Serviço
  IFRN — 2025

---
