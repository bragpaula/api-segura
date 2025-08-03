require('dotenv').config();
const express = require('express');
const app = express();
app.use(express.json());

const { sequelize } = require('./models');

// Importação dos modelos (garante que as tabelas sejam criadas)
require('./models/usuario');
require('./models/mensagem');

// Rotas
app.use('/auth/login', require('./routes/login'));          // login/logout
app.use('/usuarios', require('./routes/usuarios'));   // criação e listagem de usuários
app.use('/mensagens', require('./routes/mensagens')); // mensagens
app.use('/mensagens/:mensagemId/comentarios', require('./routes/comentarios')); // comentários nas mensagens
app.use('/auth/refresh', require('./routes/refresh'));

// Sincronização do banco e início do servidor
sequelize.sync({ force: false }).then(() => {
  console.log('Banco sincronizado!');
  app.listen(3000, () => console.log('Servidor rodando na porta 3000'));
});