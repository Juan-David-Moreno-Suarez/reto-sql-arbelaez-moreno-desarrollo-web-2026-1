const express = require('express');
const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    res.json({ mensaje: 'Ruta de usuarios funcionando' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;