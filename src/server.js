const express = require('express');
const bodyParser = require('body-parser');
const vendasRoutes = require('./routes/vendas');
const contasRoutes = require('./routes/contas');
const authRoutes = require('.routes/auth');
const usuariosRoutes = require('./routes/usuarios');
const sequelize = require('./config/db');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Rotas
app.use('/vendas', vendasRoutes);
app.use('/contas', contasRoutes);
app.use('/auth', authRoutes);
app.use('/usuarios', usuariosRoutes);

// Inicializando o servidor
sequelize.sync().then(() => {
  app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
});
