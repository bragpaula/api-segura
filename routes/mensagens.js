const express = require('express');
const router = express.Router();
const Mensagem = require('../models/mensagem');
const auth = require('../middleware/auth');

// Rota protegida
router.post('/', auth, async (req, res) => {
  try {
    const novaMensagem = await Mensagem.create({
      conteudo: req.body.conteudo,
      usuarioId: req.usuario.id
    });
    res.status(201).json(novaMensagem);
  } catch (error) {
    res.status(500).json({ mensagem: 'Erro ao criar mensagem', erro: error.message });
  }
});

module.exports = router;
