const criptografarSenha = require("../utilidades/criptografarSenha");
const knex = require("../conexao");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const cadastrarUsuario = async (req, res) => {
    const { nome, email, senha } = req.body;

    try {
        const emailExistente = await knex("usuarios").where({ email }).first();

        if (emailExistente) {
            return res.status(400).json({ mensagem: "O email já existe" });
        }

        const senhaCriptografada = await criptografarSenha(senha);

        const usuario = await knex("usuarios")
            .insert({ nome, email, senha: senhaCriptografada })
            .returning(["id", "nome", "email"]);

        if (!usuario) {
            return res
                .status(400)
                .json({ mensagem: "O usuário não foi cadastrado." });
        }

        return res.status(201).json(usuario[0]);
    } catch (error) {
        return res.status(500).json({ mensagem: "Erro interno do servidor." });
    }
};

const loginUsuario = async (req, res) => {
    const { email, senha } = req.body;

    try {
        const verificarUsuario = await knex("usuarios").where("email", email);

        if (verificarUsuario.length < 1) {
            return res
                .status(400)
                .json({ mensagem: "Email ou Senha invalido" });
        }

        const validacaoSenha = await bcrypt.compare(
            senha,
            verificarUsuario[0].senha
        );

        if (!validacaoSenha) {
            return res
                .status(400)
                .json({ mensagem: "Email ou Senha invalido" });
        }

        const token = jwt.sign(
            { id: verificarUsuario[0].id },
            process.env.SENHA_JWT,
            {
                expiresIn: "1h",
            }
        );

        const { senha: _, ...usuario } = verificarUsuario[0];

        res.status(201).json({ usuario, token });
    } catch (error) {
        res.status(500).json({ menssagem: "erro interno do sistema" });
    }
};

const detalharPerfilLogado = async (req, res) => {
    return res.json(req.usuario);
};

const atualizarUsuario = async (req, res) => {
    const { nome, email, senha } = req.body;
    const { id: usuarioId } = req.usuario;

    try {
        const usuarioExistente = await knex("usuarios")
            .where({ email })
            .whereNot({ id: usuarioId })
            .first();

        if (usuarioExistente) {
            return res.status(400).json({
                mensagem: "O e-mail já está sendo usado por outro usuário.",
            });
        }

        const senhaCriptografada = await criptografarSenha(senha);

        const usuarioAtualizado = await knex("usuarios")
            .where({ id: usuarioId })
            .update({ nome, email, senha: senhaCriptografada });

        if (!usuarioAtualizado) {
            return res.status(400).json({
                mensagem:
                    "Não foi possível atualizar as informações do usuário.",
            });
        }

        return res.status(204).send();
    } catch (error) {
        return res.status(500).json({ mensagem: "Erro interno do servidor." });
    }
};


module.exports = {
    cadastrarUsuario,
    loginUsuario,
    detalharPerfilLogado,
    atualizarUsuario
};
