const express = require('express');
const router = express.Router({ mergeParams: true }); // permite acessar req.params.id
const Comentario = require('../models/comentario');
const Mensagem = require('../models/mensagem');

// POST /mensagens/:id/comentarios
router.post('/', async (req, res) => {
  const { conteudo } = req.body;
  const mensagemId = req.params.id;

  try {
    const mensagem = await Mensagem.findByPk(mensagemId);
    if (!mensagem) {
      return res.status(404).json({ erro: 'Mensagem não encontrada' });
    }

    if (!conteudo || conteudo.trim() === '') {
      return res.status(400).json({ erro: 'Conteúdo do comentário é obrigatório' });
    }

    const comentario = await Comentario.create({ conteudo, mensagemId });
    res.status(201).json(comentario);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao criar comentário' });
  }
});

// GET /mensagens/:id/comentarios
router.get('/', async (req, res) => {
  const mensagemId = req.params.id;

  try {
    const comentarios = await Comentario.findAll({ where: { mensagemId } });
    res.json(comentarios);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao buscar comentários' });
  }
});

module.exports = router;
