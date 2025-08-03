const express = require('express');
const router = express.Router();
const Mensagem = require('../models/mensagem');
const Comentario = require('../models/comentario');
const Usuario = require('../models/usuario');
const authMiddleware = require('../middleware/auth');

// Listar todas as mensagens
router.get('/', async (req, res) => {
  try {
    const mensagens = await Mensagem.findAll({
      include: [
        {
          model: Usuario,
          as: 'autor',
          attributes: ['id', 'nome']
        },
        {
          model: Comentario,
          as: 'comentarios',
          attributes: ['id', 'conteudo', 'usuarioId']
        }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.json(mensagens);
  } catch (error) {
    res.status(500).json({ mensagem: 'Erro ao buscar mensagens', erro: error.message });
  }
});

// Criar nova mensagem
router.post('/', authMiddleware, async (req, res) => {
  const { titulo, conteudo } = req.body;
  const usuarioId = req.usuario.id;

  if (!conteudo) {
    return res.status(400).json({ mensagem: 'Conteúdo é obrigatório' });
  }

  try {
    const novaMensagem = await Mensagem.create({ titulo, conteudo, usuarioId });
    res.status(201).json(novaMensagem);
  } catch (error) {
    res.status(500).json({ mensagem: 'Erro ao criar mensagem', erro: error.message });
  }
});

// Buscar mensagem por ID
router.get('/:id', authMiddleware, async (req, res) => {
  const mensagemId = req.params.id;

  try {
    const mensagem = await Mensagem.findByPk(mensagemId, {
      include: [
        {
          model: Usuario,
          as: 'autor',
          attributes: ['id', 'nome']
        },
        {
          model: Comentario,
          as: 'comentarios',
          attributes: ['id', 'conteudo', 'usuarioId']
        }
      ]
    });

    if (!mensagem) {
      return res.status(404).json({ mensagem: 'Mensagem não encontrada' });
    }

    // Acesso liberado para qualquer usuário autenticado (admin ou comum)
    res.json(mensagem);
  } catch (error) {
    res.status(500).json({ mensagem: 'Erro ao buscar mensagem', erro: error.message });
  }
});

// Atualizar mensagem
router.put('/:id', authMiddleware, async (req, res) => {
  const mensagemId = req.params.id;
  const usuarioId = req.usuario.id;
  const { titulo, conteudo } = req.body;

  // Validação básica
  if (!titulo || !conteudo) {
    return res.status(400).json({ mensagem: 'Título e conteúdo são obrigatórios.' });
  }

  try {
    const mensagem = await Mensagem.findByPk(mensagemId);

    if (!mensagem) {
      return res.status(404).json({ mensagem: 'Mensagem não encontrada.' });
    }

    if (mensagem.usuarioId !== usuarioId) {
      return res.status(403).json({ mensagem: 'Você só pode editar suas próprias mensagens.' });
    }

    // Atualiza os campos e salva
    mensagem.titulo = titulo;
    mensagem.conteudo = conteudo;
    await mensagem.save();

    res.json({
      mensagem: 'Mensagem atualizada com sucesso.',
      mensagemAtualizada: mensagem
    });
  } catch (error) {
    res.status(500).json({
      mensagem: 'Erro ao atualizar mensagem.',
      erro: error.message
    });
  }
});


// PATCH /mensagens/:id - Atualização parcial
router.patch('/:id', authMiddleware, async (req, res) => {
  const mensagemId = req.params.id;
  const { conteudo, titulo } = req.body;
  const usuarioId = req.usuario.id;

  try {
    const mensagem = await Mensagem.findByPk(mensagemId);

    if (!mensagem) {
      return res.status(404).json({ mensagem: 'Mensagem não encontrada' });
    }

    // Só o autor ou admin pode editar
    if (mensagem.usuarioId !== usuarioId && !req.usuario.isAdmin) {
      return res.status(403).json({ mensagem: 'Você não tem permissão para editar esta mensagem.' });
    }

    // Atualiza apenas os campos que vierem no body
    if (conteudo !== undefined) mensagem.conteudo = conteudo;
    if (titulo !== undefined) mensagem.titulo = titulo;

    // Nada foi enviado
    if (conteudo === undefined && titulo === undefined) {
      return res.status(400).json({ mensagem: 'Nada para atualizar. Envie ao menos título ou conteúdo.' });
    }

    await mensagem.save();

    res.json({ mensagem: 'Mensagem atualizada com sucesso', dados: mensagem });
  } catch (error) {
    res.status(500).json({ mensagem: 'Erro ao atualizar mensagem', erro: error.message });
  }
});



// Deletar mensagem
router.delete('/:id', authMiddleware, async (req, res) => {
  const mensagemId = req.params.id;
  const usuarioId = req.usuario.id;

  try {
    const mensagem = await Mensagem.findByPk(mensagemId);

    if (!mensagem) {
      return res.status(404).json({ mensagem: 'Mensagem não encontrada' });
    }

    if (mensagem.usuarioId !== usuarioId) {
      return res.status(403).json({ mensagem: 'Você só pode deletar suas próprias mensagens' });
    }

    await mensagem.destroy();
    res.json({ mensagem: 'Mensagem deletada com sucesso' });
  } catch (error) {
    res.status(500).json({ mensagem: 'Erro ao deletar mensagem', erro: error.message });
  }
});

module.exports = router;
