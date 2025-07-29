require('dotenv').config();
const bcrypt = require('bcryptjs');
const Usuario = require('./models/usuario');
const { sequelize } = require('./models/index'); // seu index já está lá


async function criarAdminPadrao() {
  try {
    await sequelize.sync(); // garante que o banco está conectado e sincronizado

    const email = 'admin@admin.com';

    const adminExistente = await Usuario.findOne({ where: { email } });
    if (adminExistente) {
      console.log(`⚠️ Já existe um admin com o email ${email}`);
      return;
    }

    const senhaHash = await bcrypt.hash('admin123', 10);

    const novoAdmin = await Usuario.create({
      nome: 'Admin Padrão',
      email,
      senha: senhaHash,
      isAdmin: true
    });

    console.log(`✅ Admin criado com sucesso! Email: ${email} | Senha: admin123`);
  } catch (error) {
    console.error('❌ Erro ao criar admin:', error);
  } finally {
    await sequelize.close(); // encerra a conexão com o banco
  }
}

criarAdminPadrao();
