const bcrypt = require('bcrypt');

// Simulação de banco de dados (substitua com a lógica real de banco de dados)
const usuarios = [
    { id: 1, email: "luiza@email.com", senha: "$2b$10$WBpZU.aKBKSRtuIzw/t3YONWz2TWrx7vpoqxzmfvbxyMzLV9dmB0G" } // A senha criptografada aqui deve vir do banco
];

// Função para login
async function login(req, res) {
    const { email, senha } = req.body;

    // Buscar usuário pelo email
    const usuario = usuarios.find(u => u.email === email);

    if (!usuario) {
        return res.status(404).json({ error: "Usuário não encontrado" });
    }

    // Comparar a senha fornecida com o hash armazenado
    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (senhaValida) {
        res.status(200).json({ message: "Login bem-sucedido!" });
    } else {
        res.status(400).json({ error: "Senha incorreta" });
    }
}

module.exports = {
    login
};
