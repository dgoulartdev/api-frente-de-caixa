const bcrypt = require('bcrypt')

const criptografarSenha = async (senha) => {
    const senhaCriptografada = bcrypt.hash(senha, 10)

    return senhaCriptografada
}

module.exports = criptografarSenha