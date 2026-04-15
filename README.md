# API REST - Gerenciamento de Jogos

    - API REST completa para gerenciamento de jogos, categorias e usuários com autenticação JWT.
    - Permite criar, listar, atualizar e remover jogos e categorias e gerenciar usuários.
    - Os dados são armazenados utilizando o SQLite.

---

## Deploy:
[API disponível aqui](https://api-trabalhofinal.onrender.com/api/jogos).

---

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

---

## Funcionalidades:

    - CRUD completo de jogos.
    - CRUD de categorias.
    - Autenticação de usuários (login/registro).
    - Filtros, ordenação e paginação.
    - Relacionamento entre jogos e categorias (JOIN).
    - Validações robustas.
    - Proteção de rotas com JWT.
    - Seed automático.

---

## Testes automatizados:

    Para testar a integridade da rota principal, usar npm test.

---

## Executando o projeto: 

    1. Clonar o repositório (git clone https://github.com/AnaBeatriz686/API-TrabalhoFinal.git).
    2. Acessar a pasta (cd <projeto>).
    3. Instalar as dependências (npm install).
    4. Criar arquivo .env (touch .env).
    5. npm run dev (desenvolvimento) ou npm start (produção).

---

## Variáveis de ambiente:

    No arquivo ".env":

    PORT=3000
    JWT_SECRET=sua_chave

---

## Segurança

    - Senhas são armazenadas utilizando hash com bcrypt.
    - Rotas protegidas utilizam autenticação JWT.
    - Tokens devem ser enviados no header:
    Authorization: Bearer TOKEN

---

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

---

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

---

## Status Codes:

    - 200 OK → Requisição bem sucedida.
    - 201 Created → Recurso criado com sucesso.
    - 204 No Content → Recurso deletado com sucesso.
    - 400 Bad Request → Erro de validação.
    - 401 Unauthorized → Acesso não autorizado (token inválido ou ausente).
    - 404 Not Found → Recurso não encontrado.
    - 500 Internal Server Error → Erro interno do servidor.

---

## Testes Postman:

### POST /auth/register

<img width="1468" height="447" alt="image" src="https://github.com/user-attachments/assets/bff8577a-bce6-4c8b-b234-78ef03a1f184" />

### POST /auth/register (campos faltando)

<img width="1467" height="560" alt="image" src="https://github.com/user-attachments/assets/d9d3ce1a-3092-41a6-b97a-ffcafb2d7f86" />

### POST /auth/register (senha pequena)

<img width="1472" height="545" alt="image" src="https://github.com/user-attachments/assets/22ace247-22b0-4a06-a1c3-91028c30fcbd" />

### POST /auth/register (email duplicado)

<img width="1468" height="542" alt="image" src="https://github.com/user-attachments/assets/a28c12df-3279-405f-93f7-e1c4ed5bed28" />

### POST /auth/login

<img width="1472" height="407" alt="image" src="https://github.com/user-attachments/assets/c20ecd25-8869-4a44-b28e-7ef00a0ab4ac" />

### POST /auth/login (email errado)

<img width="1466" height="544" alt="image" src="https://github.com/user-attachments/assets/cae5d47c-469b-4340-87bb-0e2cd297db12" />

### POST /auth/login (senha errada)

<img width="1465" height="550" alt="image" src="https://github.com/user-attachments/assets/d27a0291-8e42-4be3-8b66-d1306f123b3a" />

### GET /api/categorias

<img width="1474" height="706" alt="image" src="https://github.com/user-attachments/assets/f2248b4d-56f0-4c68-a76c-1a5410956bf0" />

### GET /api/categorias/1

<img width="1468" height="918" alt="image" src="https://github.com/user-attachments/assets/a50e1349-068b-464c-944b-5e30082b8db9" />

### POST /api/categorias

<img width="1472" height="577" alt="image" src="https://github.com/user-attachments/assets/2a2bbdf1-747c-4c87-8783-87ce7587fd6e" />

### DELETE /api/categorias/4

<img width="1470" height="379" alt="image" src="https://github.com/user-attachments/assets/e2f7fbac-b654-4108-b07a-b8164cc98ea2" />

### DELETE /api/categorias/3 (com muitos jogos)

<img width="1467" height="350" alt="image" src="https://github.com/user-attachments/assets/110fc8f4-7c05-44b0-a6e5-da119703496e" />

### GET /api/jogos

<img width="1469" height="929" alt="image" src="https://github.com/user-attachments/assets/1f87cbfc-2941-4085-b7f9-055648f25652" />

### GET /api/jogos/23

<img width="1469" height="432" alt="image" src="https://github.com/user-attachments/assets/5a15fa36-c805-48e9-b29e-cf78490ad2f0" />

### GET /api/jogos/40 (id inexistente)

<img width="1468" height="347" alt="image" src="https://github.com/user-attachments/assets/9d1d2803-4ad1-492c-845f-2e89988af69a" />

### POST /api/jogos

<img width="1472" height="616" alt="image" src="https://github.com/user-attachments/assets/cf74fc7f-e0b7-42f5-8de6-985548a84217" />

### PUT /api/jogos/22

<img width="1471" height="604" alt="image" src="https://github.com/user-attachments/assets/de8f2808-17f8-48c1-a1ed-9367179329f0" />

### DELETE /api/jogos/21

<img width="1471" height="326" alt="image" src="https://github.com/user-attachments/assets/fb315c73-31ad-4bfa-af58-e57edb8bb1fa" />

### GET /api/jogos (por categoria)

<img width="1469" height="925" alt="image" src="https://github.com/user-attachments/assets/dbe0c709-7d50-4835-96a5-cf1bb2de7d43" />

### GET /api/jogos (por preço)

<img width="1467" height="931" alt="image" src="https://github.com/user-attachments/assets/8ea81ec4-849f-4c54-87d7-518df468fc86" />

### GET /api/jogos (ordenados)

<img width="1466" height="933" alt="image" src="https://github.com/user-attachments/assets/6f5662ce-db6d-4066-b721-b168cb5b60a3" />

### GET /api/jogos (paginação)

<img width="1468" height="933" alt="image" src="https://github.com/user-attachments/assets/300089f0-84de-4569-b141-8fdb80a94823" />
