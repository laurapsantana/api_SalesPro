const { Pool } = require('pg');
require('dotenv').config();

// Configuração da conexão com o PostgreSQL
const pool = new Pool({
  host: process.env.DB_HOST,        // Corretamente referenciado como DB_HOST
  port: process.env.DB_PORT,        // Referência para a porta
  user: process.env.DB_USER,        // Referência para o usuário
  password: process.env.DB_PASSWORD,// Referência para a senha
  database: process.env.DB_NAME     // Referência para o banco de dados
});

pool.on('connect', () => {
  console.log('Conectado ao banco de dados PostgreSQL.');
});

module.exports = pool;
