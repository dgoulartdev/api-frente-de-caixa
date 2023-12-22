const validarCorpoRequisicao = (validacaoJoi) => async (req, res, next) => {
    try {
        await validacaoJoi.validateAsync(req.body);
        next();
    } catch (error) {
        return res.status(400).json({ mensagem: `${error.message}` })
    }
};

module.exports = validarCorpoRequisicao;
