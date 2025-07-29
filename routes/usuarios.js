const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');

const Usuario = require('../models/usuario');
const auth = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');
const autorizadoOuAdmin = require('../middleware/autorizadoOuAdmin');


// Regras de validação
const validacoesUsuario = [
  body('nome')
    .notEmpty().withMessage('O nome é obrigatório'),

  body('email')
    .isEmail().withMessage('Formato de email inválido'),

  body('senha')
    .isLength({ min: 8 }).withMessage('A senha deve ter pelo menos 8 caracteres')
    .matches(/\d/).withMessage('A senha deve conter pelo menos 1 número')
    .matches(/[A-Z]/).withMessage('A senha deve conter pelo menos 1 letra maiúscula')
    .matches(/[a-z]/).withMessage('A senha deve conter pelo menos 1 letra minúscula')
    .matches(/[@!%*?&]/).withMessage('A senha deve conter pelo menos 1 caractere especial (@!%*?&)')
];

// Criar usuário (aberto)
router.post('/', validacoesUsuario, async (req, res) => {
  const erros = validationResult(req);
  if (!erros.isEmpty()) {
    return res.status(400).json({ erros: erros.array() });
  }

  const { nome, email, senha } = req.body;

  try {
    const usuarioExistente = await Usuario.findOne({ where: { email } });

    if (usuarioExistente) {
      return res.status(409).json({ erro: 'Email já cadastrado' });
    }

    const senhaHash = await bcrypt.hash(senha, 10);

    const novoUsuario = await Usuario.create({
      nome,
      email,
      senha: senhaHash
    });

    // Não retorna a senha no JSON de resposta
    const { senha: _, ...usuarioSemSenha } = novoUsuario.toJSON();

    res.status(201).json(usuarioSemSenha);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao criar usuário' });
  }
});

// Listar usuários (apenas admin)
router.get('/', auth, isAdmin, async (req, res) => {
  try {
    const usuarios = await Usuario.findAll({
      attributes: { exclude: ['senha'] }
    });
    res.json(usuarios);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar usuários' });
  }
});

// Obter um usuário por ID
router.get('/:id', auth, autorizadoOuAdmin, async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id, {
      attributes: { exclude: ['senha'] }
    });

    if (!usuario) {
      return res.status(404).json({ erro: 'Usuário não encontrado' });
    }

    res.json(usuario);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar usuário' });
  }
});

// Atualizar usuário
router.put('/:id', auth, autorizadoOuAdmin, validacoesUsuario, async (req, res) => {
  const erros = validationResult(req);
  if (!erros.isEmpty()) {
    return res.status(400).json({ erros: erros.array() });
  }

  try {
    const usuario = await Usuario.findByPk(req.params.id);

    if (!usuario) {
      return res.status(404).json({ erro: 'Usuário não encontrado' });
    }

    const { nome, email, senha } = req.body;

    // Checar se novo email já existe
    if (email !== usuario.email) {
      const emailExistente = await Usuario.findOne({ where: { email } });
      if (emailExistente) {
        return res.status(409).json({ erro: 'Email já cadastrado' });
      }
    }

    const senhaHash = await bcrypt.hash(senha, 10);

    await usuario.update({
      nome,
      email,
      senha: senhaHash
    });

    const { senha: _, ...usuarioAtualizado } = usuario.toJSON();

    res.json(usuarioAtualizado);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao atualizar usuário' });
  }
});

// Deletar usuário
router.delete('/:id', auth, autorizadoOuAdmin, async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id);

    if (!usuario) {
      return res.status(404).json({ erro: 'Usuário não encontrado' });
    }

    await usuario.destroy();
    res.json({ mensagem: 'Usuário deletado com sucesso' });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao deletar usuário' });
  }
});

module.exports = router;
