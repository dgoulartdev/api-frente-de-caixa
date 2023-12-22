const knex = require("../conexao");

const verificacaoProdPedido = async (req, res, next) => {
    const { id } = req.params

    try {
        const verificacaoPedido = await knex("pedido_produtos").where({ produto_id: id }).first()

        if (verificacaoPedido) {
            return res.status(403).json({ menssagem: "Não permitido apagar produtos que pertenção a pedidos feitos" })
        }

        next()
    } catch (error) {
        return res.status(500).json({ mensagem: "erro interno do sistema" })

    }
}

module.exports = verificacaoProdPedido
