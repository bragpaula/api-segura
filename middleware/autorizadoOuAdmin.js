module.exports = (req, res, next) => {
  const idParam = parseInt(req.params.id);
  const idUsuarioLogado = req.usuario.id;

  if (req.usuario.isAdmin || idParam === idUsuarioLogado) {
    return next();
  }

  return res.status(403).json({ mensagem: 'Você só pode acessar seus próprios dados' });
};
