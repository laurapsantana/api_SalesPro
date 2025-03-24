const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');

// Criar usuário (cadastro)
router.post('/', usuarioController.cadastrarUsuario);

// Listar usuários
router.get('/', usuarioController.listarUsuarios);

// Buscar usuário por ID
router.get('/:id', usuarioController.buscarUsuario);

module.exports = router;
