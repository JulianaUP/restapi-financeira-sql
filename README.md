# Node.js template

This is a Node.js project.

Add your [configuration](https://codesandbox.io/docs/projects/learn/setting-up/tasks) to optimize it for [CodeSandbox](https://codesandbox.io/p/dashboard).

## Resources

- [CodeSandbox — Docs](https://codesandbox.io/docs/learn)
- [CodeSandbox — Discord](https://discord.gg/Ggarp3pX5H)
#  FinApp - API Backend

API para gerenciamento financeiro pessoal desenvolvida com Node.js, Express e PostgreSQL.

##  Funcionalidades

- **Cadastro e login** de usuários com autenticação JWT
- **Gerenciamento completo** de transações (receitas e despesas)
- **Dashboard** com resumo financeiro mensal
- **Filtros** por mês e ano
- **Estatísticas** e relatórios

## 🛠 Tecnologias

- **Backend:** Node.js, Express
- **Banco de Dados:** PostgreSQL (Neon)
- **Autenticação:** JWT, bcrypt
- **Segurança:** CORS
- **Variáveis de Ambiente:** dotenv

##  Instalação

```bash
# Clone o repositório
git clone https://github.com/JulianaUP/restapi-financeira-sql.git

# Entre no diretório
cd teste-finapp-banco

# Instale as dependências
npm install
⚙ Configuração
Crie um arquivo .env na raiz do projeto:

env
DATABASE_URL=sua_url_do_banco_neon
JWT_SECRET=sua_chave_secreta_aqui
PORT=3001
Obtenha a DATABASE_URL no dashboard do Neon

Gere um JWT_SECRET seguro com:

bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
 Executando
bash
npm start
Servidor rodando em: http://localhost:3001 (local) ou URL do CodeSandbox

 Endpoints
 Autenticação
POST /auth/register - Cadastrar usuário

POST /auth/login - Fazer login

 Transações
GET /transactions - Listar transações

POST /transactions - Criar transação

PUT /transactions/:id - Editar transação

DELETE /transactions/:id - Deletar transação

Dashboard
GET /dashboard - Resumo do mês atual

GET /stats?month=1&year=2024 - Estatísticas por período

Health Check
GET /health - Status da API e banco de dados

Exemplo de Uso
Cadastro de Usuário
bash
curl -X POST https://ld3jyx-3001.csb.app/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@email.com",
    "password": "123456"
  }'
Acessar com Token
bash
curl -X GET https://ld3jyx-3001.csb.app/transactions \
  -H "Authorization: Bearer SEU_TOKEN_JWT"
 Estrutura do Banco
Utiliza stored procedures PostgreSQL:

register_user() - Cadastra usuários

authenticate_user() - Autentica login

create_transaction() - Cria transações

get_user_transactions() - Lista transações

 Segurança
Senhas criptografadas com bcrypt

Autenticação via JWT tokens

CORS habilitado

Variáveis sensíveis em environment variables

Desenvolvido por Juliana Pessoa -Projeto de Estudos 
