const knex = require('../conexao')

const cadastrarCliente = async (req, res) => {
    const { nome, email, cpf, cep, rua, numero, bairro, cidade, estado } = req.body;

    try {
        const emailExistente = await knex("clientes").where({ email }).first();

        if (emailExistente) {
            return res.status(400).json({ mensagem: "O email já existe cadastrado para outro cliente." });
        }

        const cpfExistente = await knex("clientes").where({ cpf }).first();

        if (cpfExistente) {
            return res.status(400).json({ mensagem: "O cpf já existe cadastrado para outro cliente." });
        }

        const cliente = await knex("clientes")
            .insert({ nome, email, cpf, cep, rua, numero, bairro, cidade, estado })
            .returning('*');

        if (!cliente) {
            return res
                .status(400)
                .json({ mensagem: "O cliente não foi cadastrado." });
        }

        return res.status(201).json(cliente[0]);
    } catch (error) {
        return res.status(500).json({ mensagem: "Erro interno do servidor." });
    }
}

const editarCliente = async (req, res) => {
    const { nome, email, cpf, cep, rua, numero, bairro, cidade, estado } = req.body
    const { id } = req.params;

    const clienteExiste = await knex('clientes').where({ id }).first()

    if (!clienteExiste) {
        return res.status(404).json({ mensagem: "O cliente não existe." })
    }

    try {
        if (email !== clienteExiste.email) {
            const emailExiste = await knex('clientes').where({ email: email }).first()

            if (emailExiste)
                return res.status(400).json({ mensagem: "O email já existe cadastrado para outro cliente." })
        }

        if (cpf !== clienteExiste.cpf) {
            const cpfExiste = await knex('clientes').where({ cpf: cpf }).first()

            if (cpfExiste)
                return res.status(400).json({ mensagem: "O cpf já existe cadastrado para outro cliente." })
        }

        await knex('clientes')
            .update({ nome, email, cpf, cep, rua, numero, bairro, cidade, estado })
            .where({ id })

        return res.status(204).send()
    } catch (error) {
        return res.status(500).json({ mensagem: "Erro interno do servidor." })
    }
}

const listarClientes = async (req, res) => {
    const cliente = await knex('clientes')

    try {
        return res.status(200).json(cliente)
    } catch (error) {
        return res.status(500).json({ mensagem: "Erro interno do servidor" })
    }
}

const detalharCliente = async (req, res) => {
    const { id } = req.params

    try {
        const cliente = await knex('clientes').where({ id }).first()

        if (!cliente) {
            return res.status(404).json({ mensagem: "cliente não encontrado" })
        }
        return res.status(200).json(cliente)
    } catch (error) {
        return res.status(500).json({ mensagem: "Erro interno do servidor" })
    }
}

module.exports = {
    cadastrarCliente,
    editarCliente,
    listarClientes,
    detalharCliente
}