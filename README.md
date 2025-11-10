# Node.js template

This is a Node.js project.

Add your [configuration](https://codesandbox.io/docs/projects/learn/setting-up/tasks) to optimize it for [CodeSandbox](https://codesandbox.io/p/dashboard).

## Resources

- [CodeSandbox — Docs](https://codesandbox.io/docs/learn)
- [CodeSandbox — Discord](https://discord.gg/Ggarp3pX5H)
# FinApp - API Backend

Uma API RESTful para gerenciamento financeiro pessoal, desenvolvida com Node.js, Express e PostgreSQL (Neon).

## Funcionalidades

- **Autenticação JWT**: Cadastro e login de usuários.
- **Gestão de Transações**: Criar, listar, editar e excluir transações (receitas e despesas).
- **Dashboard**: Resumo financeiro mensal e estatísticas por período.
- **Filtros**: Listagem de transações por mês e ano.

## Tecnologias Utilizadas

- Node.js
- Express
- PostgreSQL (Neon)
- JWT (JSON Web Tokens)
- bcryptjs
- CORS
- dotenv

## Pré-requisitos

- Node.js (versão 16 ou superior)
- Conta no [Neon](https://neon.tech) para o banco de dados PostgreSQL

## Instalação

1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/finapp-backend.git
   cd finapp-backend
   Instale as dependências:

bash
npm install
Crie um arquivo .env na raiz do projeto e configure as variáveis de ambiente:

env
DATABASE_URL=sua_url_de_conexao_do_neon
JWT_SECRET=seu_jwt_secret
PORT=3001
Inicie o servidor:

bash
npm start
O servidor estará rodando em http://localhost:3001.

Endpoints
Autenticação
POST /auth/register: Cadastro de usuário.

POST /auth/login: Login de usuário.

Transações
GET /transactions: Lista transações (com filtros opcionais de mês e ano).

POST /transactions: Cria uma nova transação.

PUT /transactions/:id: Atualiza uma transação existente.

DELETE /transactions/:id: Remove uma transação.

Dashboard
GET /dashboard: Retorna o resumo financeiro do mês atual.

GET /stats: Retorna estatísticas de um período específico (parâmetros: month, year).

Health Check
GET /health: Verifica o status da API e a conexão com o banco de dados.

Exemplos de Uso
Cadastro de Usuário
bash
curl -X POST http://localhost:3001/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@email.com",
    "password": "senha123"
  }'
Login
bash
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@email.com",
    "password": "senha123"
  }'
Criar Transação
bash
curl -X POST http://localhost:3001/transactions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token_jwt>" \
  -d '{
    "description": "Salário",
    "amount": 3000.00,
    "type": "income",
    "category": "Salário",
    "date": "2024-01-15"
  }'
Estrutura do Banco de Dados
O projeto utiliza stored procedures para operações no banco de dados. Certifique-se de que as seguintes funções estejam definidas no seu banco:

register_user(name, email, password)

authenticate_user(email)

create_transaction(description, amount, type, category, date, user_id)

get_user_transactions(user_id, month, year)

update_transaction(transaction_id, user_id, description, amount, type, category, date)

delete_transaction(transaction_id, user_id)

Variáveis de Ambiente
DATABASE_URL: URL de conexão com o banco de dados PostgreSQL (Neon)

JWT_SECRET: Chave secreta para assinatura dos tokens JWT

PORT: Porta em que o servidor irá rodar (opcional, padrão 3001)

Contribuição
Contribuições são bem-vindas! Sinta-se à vontade para abrir uma issue ou enviar um pull request.

Licença
Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

Desenvolvido por Seu Nome
