/**
 * Rota de jogos para gerenciamento dos jogos disponíveis na loja.
 * 
 */
const express = require('express');
const router = express.Router();

const db = require('../database/database');
const autenticar = require('../middleware/auth');

/** 
 * Rota para obter todos os jogos.
 * Retorna uma lista de jogos com seus respectivos detalhes.
 * Permite filtros por categoria, faixa de preço, ordenação e paginação.
 */

router.get('/', (req, res) => {
    try {
        const { 
            categoria_id, 
            preco_min, 
            preco_max, 
            ordem, 
            direcao,
            pagina = 1, 
            limite = 10 
        } = req.query;

        let sql = `
            SELECT 
                j.id,
                j.nome,
                j.preco,
                j.created_at,
                c.id AS categoria_id,
                c.nome AS categoria_nome
            FROM jogos j
            INNER JOIN categorias c ON j.categoria_id = c.id
            WHERE 1=1
        `;

        const params = [];

        if (categoria_id) {
            sql += ' AND j.categoria_id = ?';
            params.push(parseInt(categoria_id));
        }

        if (preco_min) {
            sql += ' AND j.preco >= ?';
            params.push(parseFloat(preco_min));
        }

        if (preco_max) {
            sql += ' AND j.preco <= ?';
            params.push(parseFloat(preco_max));
        }

        if (ordem) {
            const camposValidos = ['nome', 'preco', 'created_at'];

            if (camposValidos.includes(ordem)) {
                sql += ` ORDER BY j.${ordem}`;

                if (direcao === 'desc') {
                    sql += ' DESC';
                } else {
                    sql += ' ASC';
                }
            }
        }

        let countSql = sql.replace(
            `SELECT 
                j.id,
                j.nome,
                j.preco,
                j.created_at,
                c.id AS categoria_id,
                c.nome AS categoria_nome`,
            'SELECT COUNT(*) as total'
        );

        const total = db.prepare(countSql).get(...params).total;

        const limiteNum = parseInt(limite);
        const paginaNum = parseInt(pagina);
        const offset = (paginaNum - 1) * limiteNum;

        sql += ' LIMIT ? OFFSET ?';
        params.push(limiteNum, offset);

        const jogos = db.prepare(sql).all(...params);

        res.json({
            dados: jogos,
            paginacao: {
                pagina_atual: paginaNum,
                itens_por_pagina: limiteNum,
                total_itens: total,
                total_paginas: Math.ceil(total / limiteNum)
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ erro: 'Erro ao buscar jogos' });
    }
});

/** 
 * Rota para obter um jogo específico.
 * Retorna os detalhes do jogo solicitado.
 */

router.get('/:id', (req, res) => {
    try {

        const id = parseInt(req.params.id);

        const jogo = db.prepare(`
            SELECT 
                j.id,
                j.nome,
                j.preco,
                j.created_at,
                c.nome AS categoria_nome
            FROM jogos j
            INNER JOIN categorias c ON j.categoria_id = c.id
            WHERE j.id = ?
        `).get(id);

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

/** 
 * Rota para criar um novo jogo.
 * Valida os campos obrigatórios e insere o jogo no banco de dados.
 * Retorna os dados do jogo criado.
 */

router.post('/', autenticar, (req, res) => {
    try {
        const { nome, preco, estoque = 0, categoria_id } = req.body;

        if (!nome || !preco || !categoria_id) {
            return res.status(400).json({ erro: 'Campos obrigatórios' });
        }

        if (isNaN(preco) || preco <= 0) {
            return res.status(400).json({ erro: 'Preço deve ser um número positivo' });
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
        
        const jogo = db.prepare(`
            SELECT 
                j.id,
                j.nome,
                j.preco,
                j.created_at,
                c.nome AS categoria_nome
            FROM jogos j
            INNER JOIN categorias c ON j.categoria_id = c.id
            WHERE j.id = ?
        `).get(result.lastInsertRowid);

        res.status(201).json(jogo);

    } catch (error) {
        res.status(500).json({ erro: 'Erro ao criar jogo' });
    }
});

/** 
 * Rota para atualizar um jogo existente.
 * Valida os campos e atualiza o jogo no banco de dados.
 * Retorna os dados do jogo atualizado.
*/

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

        if (isNaN(preco) || preco <= 0) {
            return res.status(400).json({
                erro: 'Preço deve ser um número positivo'
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


        const jogoAtualizado = db.prepare(`
            SELECT 
                j.id,
                j.nome,
                j.preco,
                j.created_at,
                c.nome AS categoria_nome
            FROM jogos j
            INNER JOIN categorias c ON j.categoria_id = c.id
            WHERE j.id = ?
        `).get(id);

        res.json(jogoAtualizado);

    } catch (error) {
        res.status(500).json({ erro: 'Erro ao atualizar jogo' });
    }
});

/** 
 * Rota para deletar um jogo.
 * Valida se o jogo existe e deleta o jogo do banco de dados.
 * Retorna um status 204 (sem conteúdo) em caso de sucesso.
 */

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

module.exports = router;