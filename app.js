const express = require('express');
const app = express();
app.use(express.json());

const { sequelize } = require('./models');
const Usuario = require('./models/usuario');
const Mensagem = require('./models/mensagem');

// rotas
app.use('/usuarios', require('./routes/usuarios'));
app.use('/mensagens', require('./routes/mensagens'));
app.use('/mensagens/:id/comentarios', require('./routes/comentarios'));

// iniciar banco e servidor
sequelize.sync({ force: false }).then(() => {
    console.log('Banco sincronizado!');
    app.listen(3000, () => console.log('Servidor rodando na porta 3000'));
});
