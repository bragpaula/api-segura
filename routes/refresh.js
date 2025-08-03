const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const { REFRESH_SECRET, JWT_SECRET, ACCESS_TOKEN_EXPIRATION } = process.env;

router.post('/', (req, res) => {
  const { refresh_token } = req.body;

  if (!refresh_token) {
    return res.status(401).json({ mensagem: 'Refresh token ausente' });
  }

  try {
    const decoded = jwt.verify(refresh_token, REFRESH_SECRET);

    const newAccessToken = jwt.sign(
      { id: decoded.id },
      JWT_SECRET,
      { expiresIn: ACCESS_TOKEN_EXPIRATION || '15m' }
    );

    res.json({ access_token: newAccessToken });
  } catch (error) {
    res.status(403).json({ mensagem: 'Refresh token inválido ou expirado' });
  }
});

module.exports = router;
