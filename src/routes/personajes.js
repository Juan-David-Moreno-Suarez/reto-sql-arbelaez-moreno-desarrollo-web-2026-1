const express = require('express');
const { Personaje, Habilidad, PersonajeHabilidad, Perfil } = require('../../models');
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
    if (!personaje) return res.status(404).json({ mensaje: "Personaje no encontrado" });

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
    if (!personaje) return res.status(404).json({ mensaje: "Personaje no encontrado" });

    if (!personaje.Habilidads.length) {
      return res.status(404).json({ mensaje: "Habilidades no encontradas" });
    }

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
    if (!personaje) return res.status(404).json({ mensaje: "Personaje no encontrado" });

    if (!personaje.Habilidads.length) {
      return res.status(404).json({ mensaje: "Habilidades no encontradas" });
    }

    const habilidad = personaje.Habilidads.find(
      (h) => h.id === parseInt(req.params.idH)
    );
    if (!habilidad) {
      return res.status(404).json({ mensaje: "Habilidad no encontrada" });
    }

    res.json(habilidad);
  } catch (err) {
    next(err);
  }
});

// ===== POST crear personaje =====
router.post('/', async (req, res, next) => {
  try {
    const { nombre, descripcion, ataque, defensa, estamina, perfilId } = req.body;

    if (!nombre || ataque == null || defensa == null || estamina == null) {
      return res.status(400).json({ mensaje: "Faltan campos obligatorios" });
    }

    if ([ataque, defensa, estamina].some(v => isNaN(v) || v < 0)) {
      return res.status(400).json({
        mensaje: "Ataque, defensa y estamina deben ser números >= 0"
      });
    }

    if (perfilId != null) {
      const perfil = await Perfil.findByPk(perfilId);
      if (!perfil) {
        return res.status(404).json({ mensaje: "Perfil no encontrado" });
      }
    }

    const personaje = await Personaje.create({
      nombre,
      descripcion,
      ataque,
      defensa,
      estamina,
      perfilId
    });

    res.status(201).json(personaje);
  } catch (err) {
    next(err);
  }
});

// ===== POST agregar habilidad =====
router.post('/:id/habilidades', async (req, res, next) => {
  try {
    const { habilidadId, nivel } = req.body;

    if (!habilidadId || nivel == null) {
      return res.status(400).json({
        mensaje: "habilidadId y nivel son obligatorios"
      });
    }

    if (isNaN(nivel) || nivel < 0) {
      return res.status(400).json({
        mensaje: "nivel debe ser un número >= 0"
      });
    }

    const personaje = await Personaje.findByPk(req.params.id);
    if (!personaje) {
      return res.status(404).json({ mensaje: "Personaje no encontrado" });
    }

    const habilidad = await Habilidad.findByPk(habilidadId);
    if (!habilidad) {
      return res.status(404).json({ mensaje: "Habilidad no encontrada" });
    }

    const existe = await PersonajeHabilidad.findOne({
      where: {
        personajeId: req.params.id,
        habilidadId
      }
    });

    if (existe) {
      return res.status(400).json({
        mensaje: "La habilidad ya está asignada"
      });
    }

    const relacion = await PersonajeHabilidad.create({
      personajeId: req.params.id,
      habilidadId,
      nivel
    });

    res.status(201).json(relacion);
  } catch (err) {
    next(err);
  }
});

// ===== PUT actualizar personaje =====
router.put('/:id', async (req, res, next) => {
  try {
    const personaje = await Personaje.findByPk(req.params.id);

    if (!personaje) {
      return res.status(404).json({ mensaje: "Personaje no encontrado" });
    }

    const { nombre, descripcion, ataque, defensa, estamina } = req.body;

    if (
      nombre == null &&
      descripcion == null &&
      ataque == null &&
      defensa == null &&
      estamina == null
    ) {
      return res.status(400).json({
        mensaje: "No hay campos para actualizar"
      });
    }

    if ([ataque, defensa, estamina].some(
      v => v != null && (isNaN(v) || v < 0)
    )) {
      return res.status(400).json({
        mensaje: "Ataque, defensa y estamina deben ser números >= 0"
      });
    }

    await personaje.update({
      nombre: nombre ?? personaje.nombre,
      descripcion: descripcion ?? personaje.descripcion,
      ataque: ataque ?? personaje.ataque,
      defensa: defensa ?? personaje.defensa,
      estamina: estamina ?? personaje.estamina
    });

    res.json(personaje);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const personaje = await Personaje.findByPk(req.params.id, { attributes: ['id'] });
    if (!personaje) return res.status(404).json({ mensaje: "Personaje no encontrado" });

    await Personaje.destroy({ where: { id: personaje.id } });
    await PersonajeHabilidad.destroy({ where: { personajeId: personaje.id } });

    res.status(204).send();
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
    });

    if (!relacion) {
      return res.status(404).json({ mensaje: "Habilidad no encontrada" });
    }

    await PersonajeHabilidad.destroy({
      where: {
        personajeId: req.params.idP,
        habilidadId: req.params.idH
      }
    });

    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

module.exports = router;