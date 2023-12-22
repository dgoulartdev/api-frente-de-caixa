const knex = require("../conexao");
const { imagemUpload, excluirImagem } = require("../utilidades/uploads");

const listarCategorias = async (req, res) => {
    try {
        const categorias = await knex("categorias").select("id", "descricao");
        return res.status(200).json(categorias);
    } catch (error) {
        return res.status(500).json({ mensagem: "Erro interno do servidor." });
    }
};

const cadastrarProduto = async (req, res) => {
    const { descricao, quantidade_estoque, valor, categoria_id } = req.body;
    const { file } = req;

    const categoriaExiste = await knex("categorias")
        .where({ id: categoria_id })
        .first();

    if (!categoriaExiste) {
        return res.status(404).json({ mensagem: "Essa categoria não existe" });
    }

    try {
        if (!file) {
            const novoProduto = await knex("produtos")
                .insert({ descricao, quantidade_estoque, valor, categoria_id })
                .returning("*");

            if (!novoProduto) {
                return res
                    .status(400)
                    .json({ mensagem: "O produto não foi cadastrado." });
            }
            return res.status(201).json(novoProduto[0]);
        }

        if (file) {
            let novoProduto = await knex("produtos")
                .insert({ descricao, quantidade_estoque, valor, categoria_id })
                .returning("*");

            if (!novoProduto) {
                return res
                    .status(400)
                    .json({ mensagem: "O produto não foi cadastrado." });
            }

            const { originalname, mimetype, buffer } = req.file;

            const id = novoProduto[0].id

            const arquivo = await imagemUpload(
                `produto/${id}/${originalname}`,
                buffer,
                mimetype
            )

            novoProduto = await knex("produtos")
                .update({ produto_imagem: arquivo.url })
                .where({ id })
                .returning('*')

            return res.status(201).json(novoProduto[0]);
        }
    } catch (error) {
        return res.status(500).json({ mensagem: "Erro interno do servidor." });
    }
};

const editarProduto = async (req, res) => {
    const { descricao, quantidade_estoque, valor, categoria_id } = req.body;
    const { id } = req.params;
    const { file } = req;

    const produtoExiste = await knex("produtos").where({ id }).first();

    if (!produtoExiste) {
        return res.status(404).json({ mensagem: "O produto não existe." });
    }

    try {
        if (!file) {
            const categoriaExiste = await knex("categorias")
                .where({ id: categoria_id })
                .first();

            if (!categoriaExiste) {
                return res
                    .status(404)
                    .json({ mensagem: "Essa categoria não existe" });
            }

            let atualizarProduto = await knex("produtos")
                .update({
                    descricao,
                    quantidade_estoque,
                    valor, categoria_id
                })
                .where({ id })
                .returning('*');

            return res.json(atualizarProduto[0]);
        }

        if (file) {
            const { originalname, mimetype, buffer } = req.file;

            const categoriaExiste = await knex("categorias")
                .where({ id: categoria_id })
                .first();

            if (!categoriaExiste) {
                return res
                    .status(404)
                    .json({ mensagem: "Essa categoria não existe" });
            }

            const arquivo = await imagemUpload(
                `produto/${id}/${originalname}`,
                buffer,
                mimetype
            )

            atualizarProduto = await knex("produtos")
                .update({
                    descricao,
                    quantidade_estoque,
                    valor,
                    categoria_id,
                    produto_imagem: arquivo.url
                })
                .where({ id })
                .returning('*');
        }

        return res.json(atualizarProduto[0]);
    } catch (error) {
        return res.status(500).json({ mensagem: "Erro interno do servidor." });
    }
};

const detalharProdutos = async (req, res) => {

    try {
        const produtos = await knex("produtos").orderBy("id");

        return res.status(200).json(produtos);
    } catch (error) {
        return res.status(500).json({ mensagem: "Error interno do sistema" })
    }

};

const detalharProduto = async (req, res) => {
    const { id } = req.params

    try {
        const produtos = await knex("produtos").where({ id }).first();

        if (!produtos) {
            return res.status(404).json({ mensagem: "Produto não encontrado" })
        }

        return res.status(200).json(produtos);
    } catch (error) {
        return res.status(500).json({ mensagem: "Error interno do sistema" })
    }
};

const excluirProduto = async (req, res) => {
    const { id } = req.params;
    const { imagemPath } = req.query;
    try {
        const produtoExistente = await knex("produtos").where({ id }).first();

        if (!produtoExistente) {
            return res.status(404).json({ mensagem: "O produto não existe." });
        }

        await knex("produtos").del().where({ id });

        await excluirImagem(imagemPath);

        return res.status(204).send();
    } catch (error) {
        return res.status(500).json({ mensagem: "Erro interno do servidor." });
    }
};


module.exports = {
    listarCategorias,
    cadastrarProduto,
    editarProduto,
    detalharProdutos,
    detalharProduto,
    excluirProduto,

};
