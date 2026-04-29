const express = require('express');
const { Personaje, Habilidad, PersonajeHabilidad } = require('../../models');
const { where } = require('sequelize');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const personajes = await Personaje.findAll({
      include: [{ model: Habilidad, attributes: ['id', 'nombre'], through: { attributes: ['nivel'] } }],
    });
    res.json(personajes);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const personaje = await Personaje.findByPk(req.params.id, {
      include: [{ model: Habilidad, attributes: ['id', 'nombre'], through: { attributes: ['nivel'] } }],
    });
    if (!personaje) return res.status(404).json({ mensaje: "Personaje no encontrado" })

    res.json(personaje);
  } catch (err) {
    next(err);
  }
});

router.get('/:id/habilidades', async (req, res, next) => {
  try {
    const personaje = await Personaje.findByPk(req.params.id, {
      include: [{ model: Habilidad, through: { attributes: ['nivel'] } }],
    });
    if (!personaje) return res.status(404).json({ mensaje: "Personaje no encontrado" })

    if (!personaje.Habilidads.length) return res.status(404).json({ mensaje: "Habilidades no encontradas" })

    res.json(personaje.Habilidads);
  } catch (err) {
    next(err);
  }
});

router.get('/:idP/habilidades/:idH', async (req, res, next) => {
  try {
    const personaje = await Personaje.findByPk(req.params.idP, {
      include: [{ model: Habilidad, through: { attributes: ['nivel'] } }],
    });
    if (!personaje) return res.status(404).json({ mensaje: "Personaje no encontrado" })

    if (!personaje.Habilidads.length) return res.status(404).json({ mensaje: "Habilidades no encontradas" })

    const habilidad = personaje.Habilidads.find((h) => h.id === parseInt(req.params.idH));
    if (!habilidad) return res.status(404).json({ mensaje: "Habilidad no encontrada" })
    res.json(habilidad);
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    res.json();
  } catch (err) {
    next(err);
  }
});

router.post('/:id/habilidades', async (req, res, next) => {
  try {
    res.json();
  } catch (err) {
    next(err);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    res.json();
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const personaje = await Personaje.findByPk(req.params.id, { attributes: ['id'] });
    if (!personaje) return res.status(404).json({ mensaje: "Personaje no encontrado" })
    await Personaje.destroy({ where: { id: personaje.id } });
    await PersonajeHabilidad.destroy({ where: { personajeId: personaje.id } });
    res.status(204).send()
  } catch (err) {
    next(err);
  }
});

router.delete('/:idP/habilidades/:idH', async (req, res, next) => {
  try {
    const relacion = await PersonajeHabilidad.findOne({
      attributes: ['id'],
      where: {
        personajeId: req.params.idP,
        habilidadId: req.params.idH
      }
    })
    if (!relacion) return res.status(404).json({ mensaje: "Habilidad no encontrada" })
    await PersonajeHabilidad.destroy({
      where: {
        personajeId: req.params.idP,
        habilidadId: req.params.idH
      }
    });
    res.status(204).send()
  } catch (err) {
    next(err);
  }
});

module.exports = router;
