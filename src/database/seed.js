const db = require('./database');

db.exec('DELETE FROM jogos');
db.exec('DELETE FROM categorias');

const categorias = [
    ['Ação', 'Jogos de ação'],
    ['Esporte', 'Jogos esportivos'],
    ['Indie', 'Jogos independentes']
];

const stmtCategorias = db.prepare(`
    INSERT INTO categorias (nome, descricao)
    VALUES (?, ?)
`);

for (const categoria of categorias) {
    stmtCategorias.run(...categoria);
}

const jogos = [
    ['God of War', 199.90, 10, 1],
    ['The Last of Us', 149.90, 5, 1],
    ['FIFA 24', 299.90, 20, 2],
    ['Minecraft', 99.90, 50, 3],
    ['GTA V', 79.90, 30, 1],
    ['Cyberpunk 2077', 129.90, 15, 1],
    ['Red Dead Redemption 2', 199.90, 8, 1],
    ['Call of Duty', 249.90, 12, 2],
    ['Fortnite', 0, 999, 2],
    ['Valorant', 0, 999, 2],
    ['League of Legends', 0, 999, 2],
    ['Elden Ring', 229.90, 7, 1],
    ['Hollow Knight', 46.90, 25, 3],
    ['Celeste', 36.90, 20, 3],
    ['Cuphead', 59.90, 15, 3],
    ['Resident Evil 4', 199.90, 9, 1],
    ['Assassins Creed', 179.90, 11, 1],
    ['Spider-Man', 249.90, 6, 1],
    ['Gran Turismo', 199.90, 13, 2],
    ['Among Us', 10.00, 100, 3],
];

const stmt = db.prepare(`
    INSERT INTO jogos (nome, preco, estoque, categoria_id)
    VALUES (?, ?, ?, ?)
`);

for (const jogo of jogos) {
    stmt.run(...jogo);
}

console.log('Jogos inseridos!');