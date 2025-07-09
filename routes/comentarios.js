const express = require('express');
const router = express.Router({ mergeParams: true }); // permite acessar req.params.id
const Comentario = require('../models/comentario');
const Mensagem = require('../models/mensagem');
const Usuario = require('../models/usuario'); // necessário para o include do autor

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

    const comentario = await Comentario.create({
      conteudo,
      mensagemId,
      usuarioId: 1 // autor padrão
    });

    res.status(201).json(comentario);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao criar comentário' });
  }
});

// GET /mensagens/:id/comentarios
router.get('/', async (req, res) => {
  const mensagemId = req.params.id;

  try {
    const comentarios = await Comentario.findAll({
      where: { mensagemId },
      include: {
        association: 'autor',
        attributes: ['id', 'nome']
      }
    });

    res.json(comentarios);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao buscar comentários' });
  }
});

// PUT /comentarios/:comentarioId
router.put('/:comentarioId', async (req, res) => {
  const { conteudo, usuarioId, mensagemId } = req.body;
  const { comentarioId } = req.params;

  try {
    const comentario = await Comentario.findByPk(comentarioId);
    if (!comentario) {
      return res.status(404).json({ erro: 'Comentário não encontrado' });
    }

    if (usuarioId || mensagemId) {
      return res.status(400).json({ erro: 'Não é permitido alterar autor ou mensagem' });
    }

    if (!conteudo || conteudo.trim() === '') {
      return res.status(400).json({ erro: 'Conteúdo não pode ser vazio' });
    }

    comentario.conteudo = conteudo;
    await comentario.save();

    res.json({ mensagem: 'Comentário atualizado com sucesso', comentario });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao atualizar comentário' });
  }
});

// DELETE /comentarios/:comentarioId
router.delete('/:comentarioId', async (req, res) => {
  const { comentarioId } = req.params;

  try {
    const comentario = await Comentario.findByPk(comentarioId);
    if (!comentario) {
      return res.status(404).json({ erro: 'Comentário não encontrado' });
    }

    if (comentario.usuarioId !== 1) {
      return res.status(403).json({ erro: 'Você não tem permissão para deletar este comentário' });
    }

    await comentario.destroy();
    res.json({ mensagem: 'Comentário deletado com sucesso' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao deletar comentário' });
  }
});

module.exports = router;
