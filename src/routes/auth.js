/**
 * Rota de autenticação para registro e login de usuários.
 * Utiliza bcrypt para hash de senhas e JWT para geração de tokens de autenticação.
 */

const express = require('express');
const router = express.Router();

const db = require('../database/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

/** 
 * Rota de registro de novos usuários.
 * Valida os campos obrigatórios, verifica se o email já está cadastrado, faz o hash da senha e gera um token JWT para o usuário registrado.
 * Retorna o token e os dados do usuário registrado.
 */

router.post('/register', async (req, res) => {
    try {
        const { nome, email, senha } = req.body;

        if (!nome || !email || !senha) {
            return res.status(400).json({ erro: 'Campos obrigatórios' });
        }

        if (senha.length < 6) {
            return res.status(400).json({ erro: 'Senha mínimo 6 caracteres' });
        }

        const usuarioExiste = db.prepare(
            'SELECT id FROM usuarios WHERE email = ?'
        ).get(email);

        if (usuarioExiste) {
            return res.status(400).json({ erro: 'Email já cadastrado' });
        }

        const salt = await bcrypt.genSalt(10);
        const senhaHash = await bcrypt.hash(senha, salt);

        const result = db.prepare(`
            INSERT INTO usuarios (nome, email, senha)
            VALUES (?, ?, ?)
        `).run(nome, email, senhaHash);

        const userId = result.lastInsertRowid;

        const token = jwt.sign(
            { userId, email },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(201).json({
            token,
            usuario: { id: userId, nome, email }
        });

    } catch (error) {
        res.status(500).json({ erro: 'Erro ao registrar' });
    }
});

/**
 * Rota de login de usuários.
 * Valida os campos obrigatórios, verifica se o email existe, compara a senha fornecida com o hash armazenado e gera um token JWT para o usuário autenticado.
 * Retorna o token e os dados do usuário autenticado.
 */

router.post('/login', async (req, res) => {
    try {
        const { email, senha } = req.body;

        if (!email || !senha) {
            return res.status(400).json({ erro: 'Campos obrigatórios' });
        }

        const usuario = db.prepare(
            'SELECT * FROM usuarios WHERE email = ?'
        ).get(email);

        if (!usuario) {
            return res.status(401).json({ erro: 'Credenciais inválidas' });
        }

        const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

        if (!senhaCorreta) {
            return res.status(401).json({ erro: 'Credenciais inválidas' });
        }

        const token = jwt.sign(
            { userId: usuario.id, email: usuario.email, role: usuario.role },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            token,
            usuario: {
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email
            }
        });

    } catch (error) {
        res.status(500).json({ erro: 'Erro no login' });
    }
});

module.exports = router;