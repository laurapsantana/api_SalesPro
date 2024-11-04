const express = require('express');
const router = express.Router();
const contasController = require('../controllers/contas');

// Rota para listar todas as contas a receber
router.get('/', contasController.listarContas);

// Rota para adicionar uma nova conta a receber
router.post('/', contasController.adicionarConta);

module.exports = router;
