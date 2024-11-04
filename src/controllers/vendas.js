const pool = require('../db/db');

// Função para listar todas as vendas
exports.listarVendas = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM fatec.vendas');
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar vendas' });
  }
};

// Função para adicionar uma venda
exports.adicionarVenda = async (req, res) => {
  const { produto, valor, vendedor, data } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO fatec.vendas (produto, valor, vendedor, data) VALUES ($1, $2, $3, $4) RETURNING *',
      [produto, valor, vendedor, data]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao adicionar venda' });
  }
};
