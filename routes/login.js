const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuario');

const {
  JWT_SECRET,
  REFRESH_SECRET,
  ACCESS_TOKEN_EXPIRATION,
  REFRESH_TOKEN_EXPIRATION
} = process.env;

router.post('/', async (req, res) => {
  const { email, senha } = req.body;

  try {
    const usuario = await Usuario.findOne({ where: { email } });

    if (!usuario) {
      return res.status(400).json({ mensagem: 'Usuário não encontrado' });
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha);

    if (!senhaValida) {
      return res.status(401).json({ mensagem: 'Senha incorreta' });
    }

    // Geração do Access Token
    const accessToken = jwt.sign(
      { id: usuario.id, nome: usuario.nome, tipo: usuario.tipo },
      JWT_SECRET,
      { expiresIn: ACCESS_TOKEN_EXPIRATION || '15m' }
    );

    // Geração do Refresh Token
    const refreshToken = jwt.sign(
      { id: usuario.id },
      REFRESH_SECRET,
      { expiresIn: REFRESH_TOKEN_EXPIRATION || '7d' }
    );

    // Envia os dois tokens
    res.json({
      accessToken,
      refreshToken
    });
  } catch (error) {
    res.status(500).json({ mensagem: 'Erro ao fazer login', erro: error.message });
  }
});

module.exports = router;
