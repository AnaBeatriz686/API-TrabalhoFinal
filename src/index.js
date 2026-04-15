const express = require('express');
require('dotenv').config();

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3000;

const authRoutes = require('./routes/auth');

app.use('/auth', authRoutes);

const jogosRoutes = require('./routes/jogos');

app.use('/api/jogos', jogosRoutes);

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
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