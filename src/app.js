require('dotenv').config();
const express = require('express');
const { sequelize } = require('../models');

const personajesRouter = require('./routes/personajes');
const usuariosRouter = require('./routes/usuarios');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('/api/personajes', personajesRouter);
app.use('/api/usuarios', usuariosRouter);

// Middleware global de manejo de errores (siempre al final)
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: 'Error interno del servidor' });
});

// Verifica conexión y arranca
(async () => {
    await sequelize.authenticate();
    app.listen(PORT, () => console.log(`Servidor en http://localhost:${PORT}`));
})();
