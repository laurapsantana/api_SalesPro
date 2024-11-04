const express = require('express');
const bodyParser = require('body-parser');
const vendasRoutes = require('./routes/vendas');
const contasRoutes = require('./routes/contas');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Rotas
app.use('/vendas', vendasRoutes);
app.use('/contas', contasRoutes);

// Inicializando o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
