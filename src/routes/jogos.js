const express = require('express');
const router = express.Router();

const db = require('../database/database');
const autenticar = require('../middleware/auth');

router.get('/', (req, res) => {
    try {
        const jogos = db.prepare(`
            SELECT 
                j.id,
                j.nome,
                j.preco,
                j.created_at,
                c.id AS categoria_id,
                c.nome AS categoria_nome
            FROM jogos j
            INNER JOIN categorias c ON j.categoria_id = c.id
            ORDER BY j.nome
        `).all();

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

router.post('/', autenticar, (req, res) => {
    try {
        const { nome, preco, estoque = 0, categoria_id } = req.body;

        if (!nome || !preco || !categoria_id) {
            return res.status(400).json({ erro: 'Campos obrigatórios' });
        }

        const categoriaExiste = db.prepare(
            'SELECT id FROM categorias WHERE id = ?'
        ).get(categoria_id);

        if (!categoriaExiste) {
            return res.status(400).json({ erro: 'Categoria não existe' });
        }

        const result = db.prepare(`
            INSERT INTO jogos (nome, preco, estoque, categoria_id)
            VALUES (?, ?, ?, ?)
        `).run(nome, preco, estoque, categoria_id);

        const jogo = db.prepare(
            'SELECT * FROM jogos WHERE id = ?'
        ).get(result.lastInsertRowid);

        res.status(201).json(jogo);

    } catch (error) {
        res.status(500).json({ erro: 'Erro ao criar jogo' });
    }
});

router.put('/:id', autenticar, (req, res) => {
    try {
        const id = parseInt(req.params.id);

        const jogoExiste = db.prepare(
            'SELECT * FROM jogos WHERE id = ?'
        ).get(id);

        if (!jogoExiste) {
            return res.status(404).json({
                erro: 'Jogo não encontrado'
            });
        }

        const { nome, preco, categoria_id } = req.body;

        if (!nome || !preco || !categoria_id) {
            return res.status(400).json({
                erro: 'Campos obrigatórios faltando'
            });
        }

        const categoriaExiste = db.prepare(
            'SELECT id FROM categorias WHERE id = ?'
        ).get(categoria_id);

        if (!categoriaExiste) {
            return res.status(400).json({
                erro: 'Categoria não existe'
            });
        }

        db.prepare(`
            UPDATE jogos
            SET nome = ?, preco = ?, categoria_id = ?
            WHERE id = ?
        `).run(nome, preco, categoria_id, id);

        const jogoAtualizado = db.prepare(
            'SELECT * FROM jogos WHERE id = ?'
        ).get(id);

        res.json(jogoAtualizado);

    } catch (error) {
        res.status(500).json({ erro: 'Erro ao atualizar jogo' });
    }
});

router.delete('/:id', autenticar, (req, res) => {
    try {
        const id = parseInt(req.params.id);

        const jogoExiste = db.prepare(
            'SELECT * FROM jogos WHERE id = ?'
        ).get(id);

        if (!jogoExiste) {
            return res.status(404).json({
                erro: 'Jogo não encontrado'
            });
        }

        db.prepare(
            'DELETE FROM jogos WHERE id = ?'
        ).run(id);

        res.status(204).send();

    } catch (error) {
        res.status(500).json({ erro: 'Erro ao deletar jogo' });
    }
});