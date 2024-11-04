const express = require('express');
const router = express.Router();
const vendasController = require('../controllers/vendas');

// Rota para listar todas as vendas
router.get('/', vendasController.listarVendas);

// Rota para adicionar uma nova venda
router.post('/', vendasController.adicionarVenda);

module.exports = router;
