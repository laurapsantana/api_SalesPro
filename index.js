const express = require('express');
const { Pool } = require('pg');
const app = express();
const router = express.Router();
const db = require('./db');
require('dotenv').config();  // Carrega variáveis de ambiente

// Configurações de conexão com o banco de dados PostgreSQL
const pool = new Pool({
  connectionString: process.env.CONNECTION_STRING,
});

// Middleware para tratar requisições com JSON
app.use(express.json());

// Rota de teste para verificar se a API está conectando ao banco corretamente
app.get('/produtos', async (req, res) => {
  try {
    const result = await pool.query('select * from fatec.fatec_produtos'); 
    res.json(result.rows);  // Retorna os resultados da query
  } catch (err) {
    console.error('Erro ao buscar dados dos produtos:', err);
    res.status(500).send('Erro ao buscar produtos');
  }
});

// Rota para buscar dados dos clientes
app.get('/clientes', async (req, res) => {
  try {
    const result = await pool.query('select * from fatec.fatec_clientes'); 
    res.json(result.rows);  // Retorna os resultados da query em formato JSON
  } catch (err) {
    console.error('Erro ao buscar dados dos clientes:', err);
    res.status(500).send('Erro ao buscar dados dos clientes');
  }
});

app.get('/vendas', async (req, res) => {
  try {
    const result = await pool.query('select * from fatec.fatec_vendas'); 
    res.json(result.rows);  // Retorna os resultados da query em formato JSON
  } catch (err) {
    console.error('Erro ao buscar dados de vendas:', err);
    res.status(500).send('Erro ao buscar dados das vendas');
  }
});

app.get('/contas-receber', async (req, res) => {
  try {
    const result = await pool.query('select * from fatec.fatec_contas_receber'); 
    res.json(result.rows);  // Retorna os resultados da query em formato JSON
  } catch (err) {
    console.error('Erro ao buscar contas a receber:', err);
    res.status(500).send('Erro ao buscar dados de contas a receber');
  }
});

// Rota para obter os produtos mais vendidos
app.get('/produtos-mais-vendidos', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
          codigo_produto, 
          descricao_produto, 
          SUM(qtde) AS total_vendido
      FROM 
          fatec.fatec_vendas
      GROUP BY 
          codigo_produto, descricao_produto
      ORDER BY 
          total_vendido DESC
      LIMIT 10;
    `);

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Erro ao obter produtos mais vendidos:", error);
    res.status(500).json({ error: "Erro ao obter produtos mais vendidos" });
  }
});

// Rota para obter as vendas mensais
app.get('/venda-mensal', async (req, res) => {
  try {
    const query = `
      SELECT 
        TO_CHAR(data_emissao, 'YYYY-MM') AS mes,
        SUM(total) AS total
      FROM 
        fatec.fatec_vendas
      GROUP BY 
        TO_CHAR(data_emissao, 'YYYY-MM')
      ORDER BY 
        mes;
    `;

    const result = await pool.query(query);
    const vendasMensais = result.rows.map(row => ({
      mes: row.mes,
      total: parseFloat(row.total)
    }));

    res.status(200).json(vendasMensais);
  } catch (error) {
    console.error('Erro ao buscar vendas mensais:', error);
    res.status(500).json({ error: 'Erro ao buscar vendas mensais' });
  }
});

// Exemplo de endpoint para produtos mais vendidos na semana
app.get('/produtos/mais-vendidos/semana', async (req, res) => {
  try {
      const resultado = await pool.query(` // Alterado de db para pool
          SELECT codigo_produto, descricao_produto, SUM(qtde) AS total_vendas
          FROM fatec.fatec_vendas
          WHERE data_emissao >= CURRENT_DATE - INTERVAL '7 days'
          GROUP BY codigo_produto, descricao_produto
          ORDER BY total_vendas DESC
          LIMIT 10;
      `);
      res.json(resultado.rows);
  } catch (error) {
      console.error('Erro ao buscar produtos mais vendidos na semana:', error);
      res.status(500).send('Erro ao buscar produtos mais vendidos.');
  }
});


// Endpoint para produtos mais vendidos no mês
app.get('/produtos-mais-vendidos-mes/:mes', async (req, res) => {
  const mes = req.params.mes; // O mês será passado como parâmetro
  const query = `
    SELECT codigo_produto, descricao_produto, SUM(qtde) AS total_vendas
    FROM fatec.fatec_vendas
    WHERE EXTRACT(MONTH FROM data_emissao) = $1
    GROUP BY codigo_produto, descricao_produto
    ORDER BY total_vendas DESC
    LIMIT 20;
  `;

  try {
    const result = await pool.query(query, [mes]); 
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar produtos mais vendidos:', error);
    res.status(500).json({ error: 'Erro ao buscar dados' });
  }
});


module.exports = router;

// Inicializa o servidor na porta 3000
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
