const express = require('express');
const { Perfil, Usuario, Personaje, Habilidad } = require('../../models');
const { where } = require('sequelize');
const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const usuarios = await Usuario.findAll({
      include: [{ model: Perfil, attributes: ['id'] }],
    });
    res.json(usuarios);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id, {
      include: [{ model: Perfil, attributes: ['id'] }],
    });
    if (!usuario) res.status(404).json({mensaje: "Usuario no encontrado"})
    res.json(usuario);
  } catch (err) {
    next(err);
  }
});

router.get('/:id/personajes', async (req, res, next) => {
  try {
    const perfil = await Perfil.findOne({
      attributes: ['id'], where: {usuarioId: req.params.id}
    });
    if (!perfil) res.status(404).json({mensaje: "Perfil no encontrado"})
    const personajes = await Personaje.findAll({
      include: [{ model: Habilidad, through: { attributes: ['nivel'] } }],
      where: {perfilId: perfil.id}
    });
    if (!personajes.length) res.status(404).json({error: "No hay personajes creados"})
    res.json(personajes);
  } catch (err) {
    next(err);
  }
});

module.exports = router;