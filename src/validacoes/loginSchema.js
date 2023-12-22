const joi = require('joi')

const verificarLogin = joi.object({

    email: joi.string().required().messages({
        'string.empty': 'O campo email é obrigatório!',
        'any.required': 'O campo email é obrigatório'
    }),
    senha: joi.string().required().messages({
        'string.empty': 'O campo senha é obrigatório!',
        'any.required': 'O campo senha é obrigatório'
    }),
})


module.exports = verificarLogin