const bcrypt = require('bcryptjs');

// Simulação de um banco de dados (substitua por sua lógica real)
const usuarios = [
    { id: 1, email: "luiza@email.com", senha: "$2b$10$F8ClFPlffwp55IIi5dUWZOAfzSfv3pwjy7wO3wNIL9hgxiDAeIQcy" } // A senha criptografada aqui deve vir do seu banco
];

// Função para verificar a senha
async function verificarLogin(email, senhaInserida) {
    // Buscar usuário no banco de dados pelo email
    const usuario = usuarios.find(u => u.email === email);

    if (!usuario) {
        console.log("Usuário não encontrado");
        return false;
    }

    // Comparar a senha fornecida com o hash armazenado
    const senhaValida = await bcrypt.compare(senhaInserida, usuario.senha);
    if (senhaValida) {
        console.log("Login bem-sucedido!");
        return true;
    } else {
        console.log("Senha incorreta!");
        return false;
    }
}

verificarLogin("luiza@email.com", "minhaSenhaSegura"); // Teste com a senha fornecida
