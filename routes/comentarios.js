const express = require('express');
const router = express.Router();
const Comentario = require('../models/comentario');
const Mensagem = require('../models/mensagem');
const authMiddleware = require('../middleware/auth');

// Listar todos os comentários
router.get('/', async (req, res) => {
  try {
    const comentarios = await Comentario.findAll({
      include: [
        {
          model: Mensagem,
          as: 'mensagem',
          attributes: ['id', 'conteudo']
        },
        {
          model: require('../models/usuario'),
          as: 'autor',
          attributes: ['id', 'nome']
        }
      ]
    });
    res.json(comentarios);
  } catch (error) {
    res.status(500).json({ mensagem: 'Erro ao buscar comentários', erro: error.message });
  }
});

// Criar novo comentário (com autenticação)
router.post('/', authMiddleware, async (req, res) => {
  const { conteudo, mensagemId } = req.body;
  const usuarioId = req.usuario.id;

  if (!conteudo || !mensagemId) {
    return res.status(400).json({ mensagem: 'Conteúdo e mensagemId são obrigatórios' });
  }

  try {
    const novaMensagem = await Mensagem.findByPk(mensagemId);
    if (!novaMensagem) {
      return res.status(404).json({ mensagem: 'Mensagem não encontrada' });
    }

    const comentario = await Comentario.create({
      conteudo,
      mensagemId,
      usuarioId
    });

    res.status(201).json(comentario);
  } catch (error) {
    res.status(500).json({ mensagem: 'Erro ao criar comentário', erro: error.message });
  }
});

// Excluir um comentário (autenticado)
router.delete('/:id', authMiddleware, async (req, res) => {
  const comentarioId = req.params.id;
  const usuarioId = req.usuario.id;

  try {
    const comentario = await Comentario.findByPk(comentarioId);

    if (!comentario) {
      return res.status(404).json({ mensagem: 'Comentário não encontrado' });
    }

    if (comentario.usuarioId !== usuarioId) {
      return res.status(403).json({ mensagem: 'Você só pode excluir seus próprios comentários' });
    }

    await comentario.destroy();
    res.json({ mensagem: 'Comentário excluído com sucesso' });
  } catch (error) {
    res.status(500).json({ mensagem: 'Erro ao excluir comentário', erro: error.message });
  }
});

module.exports = router;
