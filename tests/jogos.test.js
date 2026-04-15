const request = require('supertest');
const app = require('../src/index');

describe('Testes da rota de jogos', () => {

    it('Deve listar jogos', async () => {
        const res = await request(app).get('/api/jogos');

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('dados');
    });

    it('Deve retornar 404 para jogo inexistente', async () => {
        const res = await request(app).get('/api/jogos/9999');

        expect(res.statusCode).toBe(404);
    });
});