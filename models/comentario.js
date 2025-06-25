const { DataTypes } = require('sequelize');
const { sequelize } = require('./index');
const Mensagem = require('./mensagem');

const Comentario = sequelize.define('Comentario', {
  conteudo: {
    type: DataTypes.TEXT,
    allowNull: false
  }
});

Comentario.belongsTo(Mensagem, {
  foreignKey: 'mensagemId',
  as: 'mensagem'
});

Mensagem.hasMany(Comentario, {
  foreignKey: 'mensagemId',
  as: 'comentarios'
});

module.exports = Comentario;
