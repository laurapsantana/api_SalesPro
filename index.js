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
    const result = await pool.query('select * from public.fatec_produtos'); 
    res.json(result.rows);  // Retorna os resultados da query
  } catch (err) {
    console.error('Erro ao buscar dados dos produtos:', err);
    res.status(500).send('Erro ao buscar produtos');
  }
});

// Rota para buscar dados dos clientes
app.get('/clientes', async (req, res) => {
  try {
    const result = await pool.query('select * from public.fatec_clientes'); 
    res.json(result.rows);  // Retorna os resultados da query em formato JSON
  } catch (err) {
    console.error('Erro ao buscar dados dos clientes:', err);
    res.status(500).send('Erro ao buscar dados dos clientes');
  }
});

// Rota para buscar dados das vendas
app.get('/vendas', async (req, res) => {
  try {
    const result = await pool.query('select * from public.fatec_vendas'); 
    res.json(result.rows);  // Retorna os resultados da query em formato JSON
  } catch (err) {
    console.error('Erro ao buscar dados de vendas:', err);
    res.status(500).send('Erro ao buscar dados das vendas');
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
          public.fatec_vendas
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
        public.fatec_vendas
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
          FROM public.fatec_vendas
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
app.get('/produtos-mais-vendidos-mes/mes', async (req, res) => {
  const mes = req.params.mes; // O mês será passado como parâmetro
  const query = `
    SELECT codigo_produto, descricao_produto, SUM(qtde) AS total_vendas
    FROM public.fatec_vendas
    WHERE EXTRACT(MONTH FROM data_emissao) = 1
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
app.get('/desempenho-por-cidade', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        cidade, 
        SUM(total) AS total_vendas
      FROM 
        public.fatec_vendas
      GROUP BY 
        cidade
      ORDER BY 
        total_vendas DESC;
    `);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Erro ao obter desempenho por cidade:", error);
    res.status(500).json({ error: "Erro ao obter desempenho por cidade" });
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
        public.fatec_vendas
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
      FROM public.fatec_vendas
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

// Endpoint para retornar os detalhes de um cliente específico baseado no seu ID
app.get('/cliente/:id', async (req, res) => {
  const id = req.params.id; // O ID do cliente será passado como parâmetro tera que ser o id exato do cliente ex:6541
  try {
    const result = await pool.query(`
      SELECT * 
      FROM public.fatec_clientes 
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

app.get('/clientes-top-compradores', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        id_cliente,
        razao_cliente,
        SUM(qtde) AS total_qtde_comprada,
        SUM(total) AS total_gasto
      FROM public.fatec_vendas
      GROUP BY id_cliente, razao_cliente
      ORDER BY total_qtde_comprada DESC
      LIMIT 10;
    `);

    res.json(result.rows);
  } catch (error) {
    console.error("Erro ao buscar clientes que mais compraram:", error);
    res.status(500).json({ error: "Erro ao buscar clientes que mais compraram" });
  }
});

app.get('/clientes-frequentes/:mes', async (req, res) => {
  const mes = req.params.mes; // O mês será passado como parâmetro
  try {
    const query = `
     SELECT 
        id_cliente,
        razao_cliente,
        SUM(total) AS total_compras
      FROM 
        public.fatec_vendas 
      WHERE 
        EXTRACT(YEAR FROM data_emissao) = 2024
        AND EXTRACT(MONTH FROM data_emissao) = $1
      GROUP BY 
        id_cliente, razao_cliente
      ORDER BY 
        total_compras DESC
      LIMIT 10;
    `;

    const { rows } = await pool.query(query, [mes]);

    res.json(rows);
  } catch (error) {
    console.error("Erro ao buscar clientes frequentes:", error);
    res.status(500).json({ error: 'Erro ao buscar clientes frequentes' });
  }
});

// Gráfico de Pizza por Mês
app.get('/piechart-data/:month', async (req, res) => {
  const { month } = req.params;
  try {
    const result = await pool.query(
      `SELECT descricao_produto, SUM(qtde) AS total
       FROM public.fatec_vendas
       WHERE EXTRACT(MONTH FROM data_emissao) = $1
       GROUP BY descricao_produto
       ORDER BY total DESC
       LIMIT 4`, [month]);
    const total = result.rows.reduce((sum, row) => sum + parseFloat(row.total), 0);
    const values = result.rows.map(row => (parseFloat(row.total) / total) * 100);
    res.json({ values });
  } catch (err) {
    console.error('Erro ao buscar dados do gráfico:', err);
    res.status(500).send('Erro ao buscar dados');
  }
});

// Produtos Mais Vendidos por Mês
app.get('/top-products/:month', async (req, res) => {
  const { month } = req.params;
  try {
    const result = await pool.query(
      `SELECT descricao_produto, SUM(qtde) AS qtde
       FROM public.fatec_vendas
       WHERE EXTRACT(MONTH FROM data_emissao) = $1
       GROUP BY descricao_produto
       ORDER BY qtde DESC
       LIMIT 10`, [month]);
    res.json(result.rows);
  } catch (err) {
    console.error('Erro ao buscar produtos mais vendidos:', err);
    res.status(500).send('Erro ao buscar produtos');
  }
});

// Endpoint para retornar as vendas dos últimos 6 meses
app.get('/vendas/ultimos-6-meses', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        TO_CHAR(data_emissao, 'YYYY-MM') AS mes,
        SUM(total) AS total_vendas
      FROM 
        public.fatec_vendas
      WHERE 
        data_emissao >= CURRENT_DATE - INTERVAL '7 months'
      GROUP BY 
        TO_CHAR(data_emissao, 'YYYY-MM')
      ORDER BY 
        mes;
    `);

    const vendasUltimos6Meses = result.rows.map(row => ({
      mes: row.mes,
      total_vendas: parseFloat(row.total_vendas)
    }));

    res.status(200).json(vendasUltimos6Meses);
  } catch (error) {
    console.error('Erro ao buscar vendas dos últimos 6 meses:', error);
    res.status(500).json({ error: 'Erro ao buscar vendas dos últimos 6 meses' });
  }
});

// Endpoint para listar as cidades que mais e menos venderam
app.get('/vendas/por-cidade', async (req, res) => {
  try {
    const query = `
      SELECT 
        cidade, 
        uf, 
        SUM(total) AS total_vendas
      FROM 
        public.fatec_vendas
      GROUP BY 
        cidade, uf
      ORDER BY 
        total_vendas DESC;
    `;

    const result = await pool.query(query);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Nenhuma venda encontrada' });
    }

    const cidadesQueMaisVenderam = result.rows.slice(0, 5); // Top 5 cidades que mais venderam
    const cidadesQueMenosVenderam = result.rows.slice(-5); // Top 5 cidades que menos venderam

    res.status(200).json({
      cidadesQueMaisVenderam,
      cidadesQueMenosVenderam,
    });
  } catch (error) {
    console.error('Erro ao buscar vendas por cidade:', error);
    res.status(500).json({ error: 'Erro ao buscar vendas por cidade' });
  }
});

 // Consulta SQL para buscar as cidades e o total de vendas
app.get('/dados-pizza', async (req, res) => {
  try {
    console.log("Iniciando a consulta para gráfico de pizza...");

    const query = `
      SELECT cidade, SUM(valor_unitario * qtde) AS total_vendas
      FROM public.fatec_vendas
      GROUP BY cidade
      ORDER BY total_vendas DESC
      LIMIT 4; 
    `;
    
    console.log("Executando consulta SQL:", query);

    const result = await pool.query(query);
    console.log("Resultados obtidos:", result.rows);

    const dadosPizza = result.rows.map(row => ({
      label: row.cidade,
      value: parseFloat(row.total_vendas)
    }));

    console.log("Dados formatados para o gráfico de pizza:", dadosPizza);

    res.json(dadosPizza);
  } catch (error) {
    console.error('Erro ao buscar dados para gráfico de pizza:', error.message);
    res.status(500).json({ message: 'Erro interno ao processar a solicitação.' });
  }
});

// Endpoint: /cidades-mais-venderam no mês selecionado
app.get('/cidades-mais-venderam-mes/:mes', async (req, res) => {
  const mes = req.params.mes; // O mês será passado como parâmetro
  const query = `
    SELECT
        cidade,
        uf,
        SUM(total) AS valor_total
      FROM
        public.fatec_vendas
      WHERE
        EXTRACT(MONTH FROM data_emissao) = $1
      GROUP BY
        cidade, uf
      ORDER BY
        valor_total DESC
      LIMIT 15;
  `;

  try {
    const result = await pool.query(query, [mes]); 
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar cidades que mais venderam:', error);
    res.status(500).json({ error: 'Erro ao buscar dados' });
  }
});

// Rota para listar os usuários
app.get('/usuarios', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM public.usuarios'); 
    res.json(result.rows);  // Retorna os resultados da query
  } catch (err) {
    console.error('Erro ao buscar usuários:', err);
    res.status(500).send('Erro ao buscar usuários');
  }
});


//module.exports = router;

// Inicializa o servidor na porta 3000
const port = process.env.PORT || 3000;
app.get('/', (req, res) => {
  res.send('API SalesPro está no ar! 🚀');
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
