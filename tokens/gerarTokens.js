const jwt = require('jsonwebtoken');

const gerarTokens = (usuario) => {
  const payload = {
    id: usuario.id,
    email: usuario.email,
    isAdmin: usuario.isAdmin,
  };

  const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign(payload, process.env.REFRESH_SECRET, { expiresIn: '7d' });

  return { accessToken, refreshToken };
};

module.exports = gerarTokens;
