const express = require('express');
const router = express.Router();

// Importando o controller de autenticação
const authController = require('../controllers/authController');

// Rota de login utilizando o controller
router.post('/login', authController.login);

module.exports = router;
