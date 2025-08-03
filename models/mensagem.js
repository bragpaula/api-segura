const { DataTypes } = require('sequelize');
const { sequelize } = require('./index');
const Usuario = require('./usuario');

const Mensagem = sequelize.define('Mensagem', {
    titulo: {
        type: DataTypes.STRING,
        allowNull: false
    },
    conteudo: {
            type: DataTypes.TEXT,
                    allowNull: false
                        }
                        });

                        Mensagem.belongsTo(Usuario, { as: 'autor', foreignKey: 'usuarioId' });

                        module.exports = Mensagem;
                        