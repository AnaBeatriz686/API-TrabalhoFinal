# API REST - Gerenciamento de Jogos

    - API REST completa para gerenciamento de jogos, categorias e usuários com autenticação JWT.
    - Permite criar, listar, atualizar e remover jogos e categorias e gerenciar usuários.
    - Os dados são armazenados utilizando o SQLite.

## Deploy:
    API disponível em: https://api-trabalhofinal.onrender.com/api/jogos

## Tecnologias utilizadas:

    - Node.js.
    - Express.
    - SQLite (better-sqlite3).
    - JWT (autenticação).
    - Bcrypt (hash de senha).
    - Dotenv.
    - JavaScript.
    - Jest e Supertest
    - Visual Studio Code.
    - Postman (para testes).


## Funcionalidades:

    - CRUD completo de jogos.
    - CRUD de categorias.
    - Autenticação de usuários (login/registro).
    - Filtros, ordenação e paginação.
    - Relacionamento entre jogos e categorias (JOIN).
    - Validações robustas.
    - Proteção de rotas com JWT.
    - Seed automático.

## Testes automatizados:

    Para testar a integridade da rota principal, usar npm test.

## Executando o projeto: 

    1. Clonar o repositório (git clone https://github.com/AnaBeatriz686/API-TrabalhoFinal.git).
    2. Acessar a pasta (cd <projeto>).
    3. Instalar as dependências (npm install).
    4. Criar arquivo .env (touch .env).
    5. npm run dev (desenvolvimento) ou npm start (produção).

## Variáveis de ambiente:

    No arquivo ".env":

    PORT=3000
    JWT_SECRET=sua_chave

## Segurança

    - Senhas são armazenadas utilizando hash com bcrypt.
    - Rotas protegidas utilizam autenticação JWT.
    - Tokens devem ser enviados no header:
    Authorization: Bearer TOKEN

## Endpoints:

### Auth

#### POST /auth/register

    Criar usuário
    {
      "nome": "Ana",
      "email": "ana@email.com",
      "senha": "123456"
    }

#### POST /auth/login

    Login
    {
      "email": "ana@email.com",
      "senha": "123456"
    }

### Jogos

#### GET /api/jogos

    Listar jogos com filtros
    Exemplo: /api/jogos?preco_min=10&preco_max=100&ordem=preco&direcao=asc&pagina=1&limite=10

#### GET /api/jogos/:id

    Buscar jogo por ID

#### POST /api/jogos (rota protegida)

    Criar jogo
    {
      "nome": "GTA V",
      "preco": 100,
      "categoria_id": 1
    }

#### PUT /api/jogos/:id (rota protegida)

    Atualizar jogo

#### DELETE /api/jogos/:id (rota protegida)

    Deletar jogo

### Categorias

#### GET /api/categorias

    Listar categorias

#### POST /api/categorias

    Criar categoria
    {
      "nome": "RPG",
      "descricao": "Jogos de RPG"
    }

## Paginação:

    Resposta:
    {
      "dados": [],
      "paginacao": {
      "pagina_atual": 1,
      "itens_por_pagina": 10,
      "total_itens": 50,
      "total_paginas": 5
      }
    }

## Validações:

### Jogos
    - nome: obrigatório.
    - preco: obrigatório e deve ser um número positivo.
    - categoria_id: obrigatório e deve existir na tabela de categorias.

### Usuários
    - nome: obrigatório.
    - email: obrigatório e único.
    - senha: obrigatória (armazenada com hash).

### Categorias
    - nome: obrigatório e único.

## Status Codes:

    - 200 OK → Requisição bem sucedida.
    - 201 Created → Recurso criado com sucesso.
    - 204 No Content → Recurso deletado com sucesso.
    - 400 Bad Request → Erro de validação.
    - 401 Unauthorized → Acesso não autorizado (token inválido ou ausente).
    - 404 Not Found → Recurso não encontrado.
    - 500 Internal Server Error → Erro interno do servidor.

## Testes Postman:



