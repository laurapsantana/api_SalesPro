const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.CONNECTION_STRING,
});

async function login(req, res) {
  const { email, senha } = req.body;

  try {
    const result = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    const usuario = result.rows[0];
    const senhaValida = await bcrypt.compare(senha, usuario.senha);

    if (!senhaValida) {
      return res.status(400).json({ error: "Senha incorreta" });
    }

    const token = jwt.sign(
      { id: usuario.id, email: usuario.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      message: "Login bem-sucedido!",
      token: token,
      usuario: {
        id: usuario.id,
        email: usuario.email,
        nome: usuario.nome
      }
    });

  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
}

module.exports = {
  login
};
