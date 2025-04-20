const { Pool } = require('pg');

// NÃO carregue .env se estiver no ambiente do Render
if (process.env.DB_MODE !== 'render') {
  require('dotenv').config(); // Apenas carrega o .env se for local
}

const isRender = process.env.DB_MODE === 'render';

const connectionString = isRender
  ? process.env.RENDER_CONNECTION_STRING
  : process.env.CONNECTION_STRING;

const pool = new Pool({
  connectionString,
  ssl: isRender ? { rejectUnauthorized: false } : false
});

pool.on('connect', () => {
  console.log(`Conectado ao banco de dados ${isRender ? 'Render' : 'local'}.`);
});

module.exports = pool;






























/*const { Pool } = require('pg');
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
*/

