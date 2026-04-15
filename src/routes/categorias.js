const express = require('express');
const router = express.Router();
const db = require('../database/database');

router.get('/', (req, res) => {
    const categorias = db.prepare('SELECT * FROM categorias').all();
    res.json(categorias);
});

router.get('/:id', (req, res) => {
    const id = parseInt(req.params.id);

    const categoria = db.prepare(
        'SELECT * FROM categorias WHERE id = ?'
    ).get(id);

    if (!categoria) {
        return res.status(404).json({
            erro: 'Categoria não encontrada'
        });
    }

    const jogos = db.prepare(
        'SELECT * FROM jogos WHERE categoria_id = ?'
    ).all(id);

    res.json({
        ...categoria,
        jogos
    });
});

router.post('/', (req, res) => {
    const { nome, descricao } = req.body;

    if (!nome) {
        return res.status(400).json({
            erro: 'Nome obrigatório'
        });
    }

    const result = db.prepare(
        'INSERT INTO categorias (nome, descricao) VALUES (?, ?)'
    ).run(nome, descricao);

    const categoria = db.prepare(
        'SELECT * FROM categorias WHERE id = ?'
    ).get(result.lastInsertRowid);

    res.status(201).json(categoria);
});

router.delete('/:id', (req, res) => {
    const id = parseInt(req.params.id);

    const temJogos = db.prepare(
        'SELECT COUNT(*) as total FROM jogos WHERE categoria_id = ?'
    ).get(id);

    if (temJogos.total > 0) {
        return res.status(400).json({
            erro: `Não pode deletar. Categoria tem ${temJogos.total} jogos`
        });
    }

    db.prepare('DELETE FROM categorias WHERE id = ?').run(id);

    res.status(204).send();
});

module.exports = router;