const express = require('express');
const { Pool } = require('pg');
const app = express();
const router = express.Router();
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
      const resultado = await pool.query(`
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

// Endpoint para obter desempenho por região
app.get('/desempenho-por-regiao', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        cidade, 
        SUM(total) AS total_vendas
      FROM 
        fatec.fatec_vendas
      GROUP BY 
        cidade
      ORDER BY 
        total_vendas DESC;
    `);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Erro ao obter desempenho por região:", error);
    res.status(500).json({ error: "Erro ao obter desempenho por região" });
  }
});

// Endpoint para retornar uma análise detalhada das vendas
app.get('/analise/vendas', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        TO_CHAR(data_emissao, 'YYYY-MM-DD') AS data,
        SUM(total) AS total_vendas,
        COUNT(*) AS numero_vendas
      FROM 
        fatec.fatec_vendas
      GROUP BY 
        data_emissao
      ORDER BY 
        data;
    `);
    const analiseVendas = result.rows.map(row => ({
      data: row.data,
      total_vendas: parseFloat(row.total_vendas),
      numero_vendas: parseInt(row.numero_vendas)
    }));
    res.status(200).json(analiseVendas);
  } catch (error) {
    console.error('Erro ao buscar análise de vendas:', error);
    res.status(500).json({ error: 'Erro ao buscar análise de vendas' });
  }
});

// Endpoint para retornar os clientes que mais compraram nos últimos meses
app.get('/relatorios/clientes-frequentes', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id_cliente, razao_cliente, COUNT(*) AS total_compras
      FROM fatec.fatec_vendas
      GROUP BY id_cliente, razao_cliente
      ORDER BY total_compras DESC
      LIMIT 10;
    `);

    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar clientes frequentes:', error);
    res.status(500).json({ error: 'Erro ao buscar clientes frequentes' });
  }
});

// Endpoint para retornar todos os produtos de uma categoria específica aqui esta sendo utilizado a categoria copos
//app.get('/produtos/por-categoria/:categoria', async (req, res) => {
  //const categoria = req.params.categoria; // O nome da categoria será passado como parâmetro
  //try {
   // const result = await pool.query(`
   //   SELECT * 
   //   FROM fatec.fatec_produtos
   //   WHERE id_grupo = 202;
   /// `, [categoria]);

   // res.status(200).json(result.rows);
  //} catch (error) {
  //  console.error('Erro ao buscar produtos por categoria:', error);
  //  res.status(500).json({ error: 'Erro ao buscar produtos por categoria' });
 // }
//});

// Endpoint para retornar os detalhes de um cliente específico baseado no seu ID
app.get('/cliente/:id', async (req, res) => {
  const id = req.params.id; // O ID do cliente será passado como parâmetro tera que ser o id exato do cliente ex:6541
  try {
    const result = await pool.query(`
      SELECT * 
      FROM fatec.fatec_clientes 
      WHERE id_cliente = $1; 
    `, [id]);

    if (result.rows.length > 0) {
      res.status(200).json(result.rows[0]);
    } else {
      res.status(404).json({ error: 'Cliente não encontrado' });
    }
  } catch (error) {
    console.error('Erro ao buscar detalhes do cliente:', error);
    res.status(500).json({ error: 'Erro ao buscar detalhes do cliente' });
  }
});


module.exports = router;

// Inicializa o servidor na porta 3000
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
