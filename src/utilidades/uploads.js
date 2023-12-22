const aws = require('aws-sdk');

const endpoint = new aws.Endpoint(process.env.ENDPOINT_S3)

const s3 = new aws.S3({
    endpoint,
    credentials: {
        accessKeyId: process.env.KEY_ID,
        secretAccessKey: process.env.APP_KEY
    }
})

const imagemUpload = async (path, buffer, mimetype) => {

    try {
        const produto_imagem = await s3.upload({
            Bucket: process.env.BACKBLAZE_BUCKET,
            Key: path,
            Body: buffer,
            ContentType: mimetype
        }).promise()

        return {
            url: `https://${process.env.BACKBLAZE_BUCKET}.${process.env.ENDPOINT_S3}/${produto_imagem.Key}`
        }
    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro interno do servidor' })
    }
}

const excluirImagem = async (path) => {
    await s3.delectObject({
        Bucket: process.env.BACKBLAZE_BUCKET,
        key: path
    }).promise()
}

module.exports = { 
    imagemUpload, 
    excluirImagem
}