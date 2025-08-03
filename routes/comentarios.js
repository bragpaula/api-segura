const express = require('express');
const router = express.Router({mergeParams: true});
const Comentario = require('../models/comentario');
const Mensagem = require('../models/mensagem');
const Usuario = require('../models/usuario');
const authMiddleware = require('../middleware/auth');

// GET /comentarios - Listar todos os comentários
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
          model: Usuario,
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

// POST /comentarios/:mensagemId - Criar novo comentário (autenticado)
router.post('/', authMiddleware, async (req, res) => {
  const { conteudo } = req.body;
  const { mensagemId } = req.params;
  const usuarioId = req.usuario.id;

  if (!conteudo) {
    return res.status(400).json({ mensagem: 'O conteúdo do comentário é obrigatório.' });
  }

  try {
    const mensagemExistente = await Mensagem.findByPk(mensagemId);
    if (!mensagemExistente) {
      return res.status(404).json({ mensagem: 'Mensagem não encontrada.' });
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

// PUT /comentarios/:id - Atualizar comentário (autenticado)
router.put('/:id', authMiddleware, async (req, res) => {
  const comentarioId = req.params.id;
  const { conteudo } = req.body;
  const usuarioId = req.usuario.id;

  if (!conteudo) {
    return res.status(400).json({ mensagem: 'O conteúdo do comentário é obrigatório.' });
  }

  try {
    const comentario = await Comentario.findByPk(comentarioId);

    if (!comentario) {
      return res.status(404).json({ mensagem: 'Comentário não encontrado.' });
    }

    if (comentario.usuarioId !== usuarioId) {
      return res.status(403).json({ mensagem: 'Você só pode editar seus próprios comentários.' });
    }

    comentario.conteudo = conteudo;
    await comentario.save();

    res.json({ mensagem: 'Comentário atualizado com sucesso.', comentario });
  } catch (error) {
    res.status(500).json({ mensagem: 'Erro ao atualizar comentário', erro: error.message });
  }
});

// DELETE /comentarios/:id - Excluir comentário (autenticado)
router.delete('/:id', authMiddleware, async (req, res) => {
  const comentarioId = req.params.id;
  const usuarioId = req.usuario.id;

  try {
    const comentario = await Comentario.findByPk(comentarioId);

    if (!comentario) {
      return res.status(404).json({ mensagem: 'Comentário não encontrado.' });
    }

    if (comentario.usuarioId !== usuarioId) {
      return res.status(403).json({ mensagem: 'Você só pode excluir seus próprios comentários.' });
    }

    await comentario.destroy();
    res.json({ mensagem: 'Comentário excluído com sucesso.' });
  } catch (error) {
    res.status(500).json({ mensagem: 'Erro ao excluir comentário', erro: error.message });
  }
});

module.exports = router;
