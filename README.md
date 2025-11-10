# Node.js template

This is a Node.js project.

Add your [configuration](https://codesandbox.io/docs/projects/learn/setting-up/tasks) to optimize it for [CodeSandbox](https://codesandbox.io/p/dashboard).

## Resources

- [CodeSandbox — Docs](https://codesandbox.io/docs/learn)
- [CodeSandbox — Discord](https://discord.gg/Ggarp3pX5H)
#  FinApp - API Backend

API para gerenciamento financeiro pessoal desenvolvida com Node.js, Express e PostgreSQL.

## Funcionalidades

- Cadastro e login de usuários
- Gerenciamento de transações (receitas/despesas)
- Dashboard com resumo financeiro
- Filtros por mês e ano

##  Tecnologias

- Node.js + Express
- PostgreSQL (Neon)
- JWT + bcrypt
- CORS

##  Instalação

```bash
git clone https://github.com/seu-usuario/finapp-backend.git
cd finapp-backend
npm install
⚙ Configuração
Crie um arquivo .env na raiz do projeto:

env
DATABASE_URL=sua_url_do_banco_neon
JWT_SECRET=sua_chave_secreta_aqui
PORT=3001
Obtenha a DATABASE_URL no dashboard do Neon

Gere um JWT_SECRET com:

bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
 Executando
bash
npm start
Servidor rodando em: http://localhost:3001

Endpoints
Autenticação:

POST /auth/register - Cadastrar usuário

POST /auth/login - Fazer login

Transações:

GET /transactions - Listar transações

POST /transactions - Criar transação

PUT /transactions/:id - Editar transação

DELETE /transactions/:id - Deletar transação

Dashboard:

GET /dashboard - Resumo do mês

GET /stats?month=1&year=2024 - Estatísticas

Desenvolvido por Juliana Nascimento Pessoa - Projeto de estudos
