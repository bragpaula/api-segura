# 🔐 API Segura com Autenticação JWT

Este é um projeto de uma API RESTful desenvolvida com Node.js, Express e Sequelize, com autenticação e autorização usando JWT (JSON Web Tokens). O sistema gerencia usuários, mensagens e comentários com diferentes níveis de acesso: usuários comuns e administradores.

---

## 🧱 Estrutura do Projeto

```

.
├── middleware/              # Middlewares de autenticação e autorização
│   ├── auth.js
│   ├── autorizadoOuAdmin.js
│   └── isAdmin.js
│
├── models/                  # Modelos Sequelize
│   ├── comentario.js
│   ├── index.js
│   ├── mensagem.js
│   └── usuario.js
│
├── routes/                  # Rotas da API
│   ├── comentarios.js
│   ├── login.js
│   ├── mensagens.js
│   ├── refresh.js
│   └── usuarios.js
│
├── tokens/                  # Geração de tokens JWT
│   └── gerarTokens.js
│
├── .env                     # Variáveis de ambiente
├── app.js                   # Arquivo principal
├── criarAdmin.js            # Script para criar usuário admin
├── database.sqlite          # Banco de dados SQLite
├── package.json
└── README.md

````

---

## 🔑 Funcionalidades

- Autenticação com **JWT** (token de acesso e refresh token)
- **Login** de usuário com geração de token
- **Refresh token** com endpoint seguro
- Proteção de rotas com **middleware de autorização**
- Níveis de permissão: **usuário comum** e **admin**
- CRUD de usuários, mensagens e comentários
- Validação e verificação de tokens
- Banco de dados persistente com **SQLite**

---

## 🚀 Como rodar o projeto

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/api-segura.git
cd api-segura
````

### 2. Instale as dependências

```bash
npm install
```

### 3. Crie o arquivo `.env`

Crie um arquivo `.env` com as seguintes variáveis:

```env
JWT_SECRET=sua_chave_secreta
REFRESH_SECRET=sua_chave_refresh
ACCESS_TOKEN_EXPIRATION=15m
REFRESH_TOKEN_EXPIRATION=1d
```

### 4. Rode o projeto

```bash
node app.js
```

---

## 🧪 Teste os Endpoints

Você pode testar a API com ferramentas como [Postman](https://www.postman.com/) ou [Insomnia](https://insomnia.rest/). Os principais endpoints são:

### Autenticação

* `POST /login` - Login com e-mail e senha
* `POST /refresh` - Geração de novo access token com refresh token

### Usuários

* `GET /usuarios` - Listar usuários (apenas admin)
* `POST /usuarios` - Criar novo usuário

### Mensagens

* `GET /mensagens` - Listar mensagens
* `POST /mensagens` - Criar nova mensagem
* `DELETE /mensagens/:id` - Deletar (autorizado ou admin)

### Comentários

* `GET /comentarios`
* `POST /comentarios`

---

## 👤 Criação de Admin

Você pode executar o script `criarAdmin.js` para criar um usuário administrador manualmente:

```bash
node criarAdmin.js
```

---

## 📌 Tecnologias utilizadas

* [Node.js](https://nodejs.org/)
* [Express](https://expressjs.com/)
* [JWT](https://jwt.io/)
* [Sequelize](https://sequelize.org/)
* [SQLite](https://www.sqlite.org/index.html)
* [Dotenv](https://github.com/motdotla/dotenv)

---

## 📄 Licença

Este projeto está licenciado sob a licença MIT.

---

## ✨ Contribuições

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou pull requests.

---

## 🙋‍♀️ Desenvolvido por

Paula Braga – [@bragpaula](https://github.com/bragpaula)

---
