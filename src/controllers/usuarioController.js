const usuarioService = require('../services/usuarioService');

async function cadastrarUsuario(req, res) {
    const { nome, email, senha } = req.body;

    const resultado = await usuarioService.criarUsuario(nome, email, senha);
    if (resultado.error) {
        return res.status(400).json(resultado);
    }

    res.status(201).json(resultado);
}

async function listarUsuarios(req, res) {
    const usuarios = await usuarioService.listarUsuarios();
    res.status(200).json(usuarios);
}

async function buscarUsuario(req, res) {
    const { id } = req.params;
    const usuario = await usuarioService.buscarUsuarioPorId(id);

    if (!usuario) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    res.status(200).json(usuario);
}

module.exports = {
    cadastrarUsuario,
    listarUsuarios,
    buscarUsuario
};
