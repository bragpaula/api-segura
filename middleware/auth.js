const jwt = require('jsonwebtoken');
const JWT_SECRET = 'apisegura';

module.exports = function (req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ mensagem: 'Token não fornecido' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.usuario = decoded; // dados do token disponíveis nas rotas protegidas
    next();
  } catch (error) {
    res.status(401).json({ mensagem: 'Token inválido' });
  }
};
