const jwt = require("jsonwebtoken");
const knex = require("../conexao");

const validacaoToken = async (req, res, next) => {
    const { authorization } = req.headers;

    if (authorization === "Bearer" || !authorization) {
        return res.status(400).json({
            mensagem: "token de autenticação válido deve ser enviado.",
        });
    }

    try {
        const token = authorization.split(" ")[1];

        const validacao = jwt.verify(token, process.env.SENHA_JWT);

        const usuarioLogado = await knex("usuarios").where("id", validacao.id)

        if (usuarioLogado.length < 0) {
            return res.status(403).json({ mensagem: "Não autorizado" });
        }

        const { senha: _, ...usuario } = usuarioLogado[0];

        req.usuario = usuario;

        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ mensagem: 'Token expirado. Faça o login novamente.' });
        } else if (error.name === 'SyntaxError') {
            return res.status(400).json({ mensagem: 'Token invalido.' })
        }

        return res.status(500).json({ mensagem: "Erro interno do sistema" });
    }
};

module.exports = validacaoToken
