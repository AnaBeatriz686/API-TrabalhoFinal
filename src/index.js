const express = require('express');
require('dotenv').config();

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3000;

const authRoutes = require('./routes/auth');

app.use('/auth', authRoutes);

const jogosRoutes = require('./routes/jogos');

app.use('/api/jogos', jogosRoutes);

const categoriasRoutes = require('./routes/categorias');

app.use('/api/categorias', categoriasRoutes);

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});