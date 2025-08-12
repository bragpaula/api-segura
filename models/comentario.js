const { DataTypes } = require('sequelize');
const { sequelize } = require('./index');
const Mensagem = require('./mensagem');
const Usuario = require('./usuario');

const Comentario = sequelize.define('Comentario', {
  conteudo: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  data_criacao: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false
  }
}, {
  tableName: 'comentarios',
  timestamps: false
});

// Comentário pertence à Mensagem
Comentario.belongsTo(Mensagem, {
  foreignKey: 'mensagemId',
  as: 'mensagem'
});

Mensagem.hasMany(Comentario, {
  foreignKey: 'mensagemId',
  as: 'comentarios'
});

// Comentário pertence ao Usuário
Comentario.belongsTo(Usuario, {
  foreignKey: 'usuarioId',
  as: 'autor'
});

Usuario.hasMany(Comentario, {
  foreignKey: 'usuarioId',
  as: 'comentarios'
});

module.exports = Comentario;
