const express = require("express");
const { Client } = require("pg");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || "seu_segredo_aqui";
const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// 🔐 MIDDLEWARE DE AUTENTICAÇÃO
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Token de acesso requerido" });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Token inválido" });
    }
    req.user = user;
    next();
  });
};

client.connect().then(() => console.log("✅ Conectado ao banco!"));

// 🏠 Página inicial
app.get("/", (req, res) => {
  res.json({
    message: "🚀 API FinApp - MVP Completo",
    version: "1.0.0",
    endpoints: {
      auth: ["POST /auth/register", "POST /auth/login"],
      transactions: [
        "GET  /transactions",
        "POST /transactions",
        "PUT  /transactions/:id",
        "DELETE /transactions/:id",
      ],
      dashboard: ["GET /dashboard", "GET /stats?month=1&year=2024"],
    },
  });
});

// 👤 AUTENTICAÇÃO - US01, US02, US03

// US01 - Cadastro de usuário
app.post("/auth/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ error: "Nome, email e senha são obrigatórios" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await client.query(
      "SELECT * FROM register_user($1, $2, $3)",
      [name, email, hashedPassword]
    );

    res.status(201).json({
      success: true,
      user: result.rows[0],
      message: "Usuário criado com sucesso!",
    });
  } catch (err) {
    if (err.code === "23505") {
      // Unique violation
      res.status(400).json({ error: "Email já cadastrado" });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
});

// US02 - Login
app.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email e senha são obrigatórios" });
    }

    const result = await client.query("SELECT * FROM authenticate_user($1)", [
      email,
    ]);

    if (result.rows.length === 0) {
      return res.status(400).json({ error: "Credenciais inválidas" });
    }

    const user = result.rows[0];
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(400).json({ error: "Credenciais inválidas" });
    }

    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "24h",
    });

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 💰 TRANSAÇÕES - US04, US05, US06, US07

// US04 - Criar transação
app.post("/transactions", authenticateToken, async (req, res) => {
  try {
    const { description, amount, type, category, date } = req.body;
    const userId = req.user.userId;

    if (!description || !amount || !type) {
      return res
        .status(400)
        .json({ error: "Descrição, valor e tipo são obrigatórios" });
    }

    if (type !== "income" && type !== "expense") {
      return res
        .status(400)
        .json({ error: "Tipo deve ser 'income' ou 'expense'" });
    }

    const result = await client.query(
      "SELECT * FROM create_transaction($1, $2, $3, $4, $5, $6)",
      [
        description,
        amount,
        type,
        category || "Outros",
        date || new Date(),
        userId,
      ]
    );

    res.json({
      success: true,
      transaction: result.rows[0],
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// US05 - Listar transações com filtro
app.get("/transactions", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { month, year } = req.query;

    const result = await client.query(
      "SELECT * FROM get_user_transactions($1, $2, $3)",
      [userId, month ? parseInt(month) : null, year ? parseInt(year) : null]
    );

    res.json({
      success: true,
      transactions: result.rows,
      total: result.rows.length,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// US06 - Editar transação
app.put("/transactions/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { description, amount, type, category, date } = req.body;
    const userId = req.user.userId;

    if (!description || !amount || !type) {
      return res
        .status(400)
        .json({ error: "Descrição, valor e tipo são obrigatórios" });
    }

    const result = await client.query(
      "SELECT * FROM update_transaction($1, $2, $3, $4, $5, $6, $7)",
      [id, userId, description, amount, type, category, date]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Transação não encontrada" });
    }

    res.json({
      success: true,
      transaction: result.rows[0],
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// US07 - Deletar transação
app.delete("/transactions/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const result = await client.query(
      "SELECT delete_transaction($1, $2) as deleted",
      [id, userId]
    );

    if (!result.rows[0].deleted) {
      return res.status(404).json({ error: "Transação não encontrada" });
    }

    res.json({
      success: true,
      message: "Transação deletada com sucesso!",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📊 DASHBOARD - US08, US09

// US08 - Dashboard do mês atual
app.get("/dashboard", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();

    // Resumo do mês atual
    const summaryResult = await client.query(
      `SELECT * FROM user_financial_summary 
       WHERE user_id = $1 AND month = $2 AND year = $3`,
      [userId, currentMonth, currentYear]
    );

    // Top categorias do mês
    const categoriesResult = await client.query(
      `SELECT * FROM user_categories_stats 
       WHERE user_id = $1 AND type = 'expense'
       ORDER BY total DESC LIMIT 5`,
      [userId]
    );

    const summary = summaryResult.rows[0] || {
      total_income: 0,
      total_expense: 0,
      balance: 0,
      total_transactions: 0,
    };

    res.json({
      success: true,
      dashboard: {
        summary,
        top_categories: categoriesResult.rows,
        period: {
          month: currentMonth,
          year: currentYear,
          month_name: new Date().toLocaleString("pt-BR", { month: "long" }),
        },
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// US09 - Estatísticas por período específico
app.get("/stats", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { month, year } = req.query;

    if (!month || !year) {
      return res
        .status(400)
        .json({ error: "Parâmetros month e year são obrigatórios" });
    }

    const result = await client.query(
      `SELECT * FROM user_financial_summary 
       WHERE user_id = $1 AND month = $2 AND year = $3`,
      [userId, parseInt(month), parseInt(year)]
    );

    const stats = result.rows[0] || {
      total_income: 0,
      total_expense: 0,
      balance: 0,
      total_transactions: 0,
    };

    res.json({
      success: true,
      stats,
      period: { month: parseInt(month), year: parseInt(year) },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔧 HEALTH CHECK
app.get("/health", async (req, res) => {
  try {
    await client.query("SELECT 1");
    res.json({
      status: "healthy",
      database: "connected",
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    res.status(500).json({
      status: "unhealthy",
      error: err.message,
    });
  }
});

// 🚀 Iniciar servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando: http://localhost:${PORT}`);
  console.log("🎯 MVP Implementado - Código 100% Limpo!");
  console.log("📊 Endpoints disponíveis:");
  console.log("   🔐 /auth/register, /auth/login");
  console.log("   💰 /transactions (GET, POST, PUT, DELETE)");
  console.log("   📈 /dashboard, /stats");
  console.log("   ❤️  /health");
});
