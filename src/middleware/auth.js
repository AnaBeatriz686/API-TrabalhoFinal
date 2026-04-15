/**
 * Middleware de autenticação usando JWT para proteger rotas que exigem autenticação.
 * O middleware verifica a presença e validade do token JWT no cabeçalho Authorization das requisições.
 */

const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

function autenticar(req, res, next) {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        return res.status(401).json({ erro: 'Token não fornecido' });
    }

    const parts = authHeader.split(' ');

    if (parts.length !== 2) {
        return res.status(401).json({ erro: 'Token mal formatado' });
    }

    const [scheme, token] = parts;

    if (!/^Bearer$/i.test(scheme)) {
        return res.status(401).json({ erro: 'Token mal formatado' });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ erro: 'Token inválido' });
        }

        req.userId = decoded.userId;
        next();
    });
}

module.exports = autenticar;