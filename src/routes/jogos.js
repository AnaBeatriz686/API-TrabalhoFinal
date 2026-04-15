const express = require('express');
const router = express.Router();

const db = require('../database/database');
const autenticar = require('../middleware/auth');

router.get('/', (req, res) => {
    try {
        const stmt = db.prepare(`
            SELECT 
                j.id,
                j.nome,
                j.preco,
                j.estoque,
                j.created_at,
                c.id AS categoria_id,
                c.nome AS categoria_nome
            FROM jogos j
            INNER JOIN categorias c ON j.categoria_id = c.id
        `);

        const jogos = stmt.all();

        res.json(jogos);
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao buscar jogos' });
    }
});

router.get('/:id', (req, res) => {
    try {
        
        const id = parseInt(req.params.id);

        const jogo = db.prepare(
            'SELECT * FROM jogos WHERE id = ?'
        ).get(id);

        if (!jogo) {
            return res.status(404).json({
                erro: 'Jogo não encontrado'
            });
        }

        res.json(jogo);

    } catch (error) {
        res.status(500).json({ erro: 'Erro ao buscar jogo' });
    }
});