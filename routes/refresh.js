const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const { REFRESH_SECRET, JWT_SECRET, ACCESS_TOKEN_EXPIRATION } = process.env;

router.post('/', (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ mensagem: 'Refresh token ausente' });
  }

  try {
    const decoded = jwt.verify(refreshToken, REFRESH_SECRET);

    const newAccessToken = jwt.sign(
      { id: decoded.id },
      JWT_SECRET,
      { expiresIn: ACCESS_TOKEN_EXPIRATION || '15m' }
    );

    res.json({ accessToken: newAccessToken });
  } catch (error) {
    res.status(403).json({ mensagem: 'Refresh token inválido ou expirado' });
  }
});

module.exports = router;
