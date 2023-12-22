const joi = require('joi')

const pedidoSchema = joi.object({
    cliente_id: joi.number().positive().integer().required(),
    pedido_produtos: joi.array().required(),
    observacao: joi.string()
})

module.exports = pedidoSchema