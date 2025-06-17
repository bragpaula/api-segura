const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Mensagem = require('../models/mensagem');
const Usuario = require('../models/usuario');

// Validação do conteúdo
const validarMensagem = [
  body('conteudo')
    .notEmpty().withMessage('O campo "conteudo" é obrigatório')
];

// Criar mensagem
router.post('/', validarMensagem, async (req, res) => {
  const erros = validationResult(req);
  if (!erros.isEmpty()) {
    return res.status(400).json({ erros: erros.array() });
  }

  try {
    const novaMensagem = await Mensagem.create({
      conteudo: req.body.conteudo,
      usuarioId: 1 // usuário padrão
    });

    res.status(201).json(novaMensagem);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao criar mensagem' });
  }
});

// Listar todas as mensagens
router.get('/', async (req, res) => {
  try {
    const mensagens = await Mensagem.findAll({
      include: {
        model: Usuario,
        attributes: ['id', 'nome', 'email']
      }
    });
    res.json(mensagens);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar mensagens' });
  }
});

// Buscar mensagem por ID
router.get('/:id', async (req, res) => {
  try {
    const mensagem = await Mensagem.findByPk(req.params.id, {
      include: {
        model: Usuario,
        attributes: ['id', 'nome', 'email']
      }
    });

    if (!mensagem) {
      return res.status(404).json({ erro: 'Mensagem não encontrada' });
    }

    res.json(mensagem);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar mensagem' });
  }
});

// Atualizar conteúdo da mensagem (mas não o autor!)
router.put('/:id', validarMensagem, async (req, res) => {
  const erros = validationResult(req);
  if (!erros.isEmpty()) {
    return res.status(400).json({ erros: erros.array() });
  }

  try {
    const mensagem = await Mensagem.findByPk(req.params.id);

    if (!mensagem) {
      return res.status(404).json({ erro: 'Mensagem não encontrada' });
    }

    // Impede alteração de autor
    if (req.body.usuarioId && req.body.usuarioId !== mensagem.usuarioId) {
      return res.status(403).json({ erro: 'Você não pode alterar o autor da mensagem' });
    }

    mensagem.conteudo = req.body.conteudo;
    await mensagem.save();

    res.json(mensagem);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao atualizar mensagem' });
  }
});

// Deletar mensagem
router.delete('/:id', async (req, res) => {
  try {
    const mensagem = await Mensagem.findByPk(req.params.id);

    if (!mensagem) {
      return res.status(404).json({ erro: 'Mensagem não encontrada' });
    }

    await mensagem.destroy();
    res.json({ mensagem: 'Mensagem deletada com sucesso' });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao deletar mensagem' });
  }
});

module.exports = router;
