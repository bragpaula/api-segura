const jwt = require('jsonwebtoken');

const gerarTokens = (usuario) => {
  const payload = {
    id: usuario.id,
    email: usuario.email,
    isAdmin: usuario.isAdmin,
  };

  const access_token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '15m' });
  const refresh_token = jwt.sign(payload, process.env.REFRESH_SECRET, { expiresIn: '7d' });

  return { access_token, refresh_token };
};

module.exports = gerarTokens;
