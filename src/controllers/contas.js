const pool = require('../db/db');

// Função para listar todas as contas a receber
exports.listarContas = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM fatec.contas_a_receber');
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar contas a receber' });
  }
};

// Função para adicionar uma conta a receber
exports.adicionarConta = async (req, res) => {
  const { cliente, valor, data_vencimento, status } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO fatec.contas_a_receber (cliente, valor, data_vencimento, status) VALUES ($1, $2, $3, $4) RETURNING *',
      [cliente, valor, data_vencimento, status]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao adicionar conta a receber' });
  }
};
