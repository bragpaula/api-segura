module.exports = (req, res, next) => {
  if (req.usuario && req.usuario.isAdmin) {
    return next();
  }
  return res.status(403).json({ mensagem: 'Acesso restrito a administradores' });
};
