/**
 * Ponto de entrada da aplicação Express para a API de gerenciamento de jogos.
 * Configura as rotas de autenticação, jogos e categorias, e inicia o servidor.
 */

require('dotenv').config();
require('./database/seed');

const express = require('express');
const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3000;

const authRoutes = require('./routes/auth');

app.use('/auth', authRoutes);

const jogosRoutes = require('./routes/jogos');

app.use('/api/jogos', jogosRoutes);

const categoriasRoutes = require('./routes/categorias');

app.use('/api/categorias', categoriasRoutes);

if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log(`Servidor rodando na porta ${PORT}`);
    });
}

module.exports = app;
