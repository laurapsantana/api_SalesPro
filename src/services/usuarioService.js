const bcrypt = require('bcrypt');
const Usuario = require('../models/usuario');

async function criarUsuario(nome, email, senha) {
    const usuarioExistente = await Usuario.findOne({ where: { email } });
    if (usuarioExistente) {
        return { error: 'E-mail já cadastrado' };
    }

    const senhaHash = await bcrypt.hash(senha, 10);
    const usuario = await Usuario.create({ nome, email, senha: senhaHash });

    return usuario;
}

async function listarUsuarios() {
    return await Usuario.findAll({ attributes: { exclude: ['senha'] } });
}

async function buscarUsuarioPorId(id) {
    return await Usuario.findByPk(id, { attributes: { exclude: ['senha'] } });
}

module.exports = {
    criarUsuario,
    listarUsuarios,
    buscarUsuarioPorId
};
