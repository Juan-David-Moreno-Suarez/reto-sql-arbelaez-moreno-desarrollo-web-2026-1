const express = require('express');
const { Personaje, Habilidad } = require('../../models');
 
const router = express.Router();
 
router.get('/', async (req, res, next) => {
  try {
    const personajes = await Personaje.findAll({
      include: [{ model: Habilidad, through: { attributes: ['nivel'] } }],
    });
    res.json(personajes);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const personaje = await Personaje.findByPk(req.params.id,{
      include: [{ model: Habilidad, through: { attributes: ['nivel'] } }],
    });
    if (!personaje) res.status(404).json({mensaje: "Personaje no encontrado"})

    res.json(personaje);
  } catch (err) { 
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const personajes = await Personaje.findAll({
      include: [{ model: Habilidad, through: { attributes: ['nivel'] } }],
    });
    res.json(personajes);
  } catch (err) {
    next(err);
  }
});
 
module.exports = router;
