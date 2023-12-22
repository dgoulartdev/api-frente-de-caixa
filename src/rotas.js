const express = require("express");
const multer = require('./intermediarios/multer');

const {
    cadastrarUsuario,
    loginUsuario,
    detalharPerfilLogado,
    atualizarUsuario
} = require("./controladores/usuarios");
const validarCorpoRequisicao = require("./intermediarios/usuarios");
const validacaoToken = require("./intermediarios/validacaoToken");
const verificacaoPedido = require("./intermediarios/validacaoDelProduto")
const verificarCadastro = require("./validacoes/usuarioSchema");
const verificarLogin = require("./validacoes/loginSchema");
const validarCadastroProduto = require('./validacoes/produtoSchema');
const {
    listarCategorias,
    cadastrarProduto,
    editarProduto,
    detalharProduto,
    detalharProdutos,
    excluirProduto
} = require('./controladores/produtos');
const validarCadastroCliente = require("./validacoes/clienteSchema");
const {
    cadastrarCliente,
    editarCliente,
    listarClientes,
    detalharCliente
} = require("./controladores/clientes");
const { cadastrarPedido, listarPedidos } = require('./controladores/pedidos')
const validarCadastroPedido = require('./validacoes/pedidoSchema')


const rotas = express()

rotas.get("/categoria", listarCategorias)

rotas.post("/usuario", validarCorpoRequisicao(verificarCadastro), cadastrarUsuario)

rotas.post("/login", validarCorpoRequisicao(verificarLogin), loginUsuario)

rotas.use(validacaoToken)

rotas.put("/usuario", validarCorpoRequisicao(verificarCadastro), atualizarUsuario)
rotas.get("/usuario", detalharPerfilLogado)

rotas.post("/produto", multer.single('produto_imagem'), validarCorpoRequisicao(validarCadastroProduto), cadastrarProduto)
rotas.put("/produto/:id", multer.single('produto_imagem'), validarCorpoRequisicao(validarCadastroProduto), editarProduto)
rotas.get("/produto", detalharProdutos)
rotas.get("/produto/:id", detalharProduto)
rotas.delete("/produto/:id", verificacaoPedido, excluirProduto)


rotas.post("/cliente", validarCorpoRequisicao(validarCadastroCliente), cadastrarCliente)
rotas.put("/cliente/:id", validarCorpoRequisicao(validarCadastroCliente), editarCliente)
rotas.get("/cliente", listarClientes)
rotas.get("/cliente/:id", detalharCliente)

rotas.post('/pedido', validarCorpoRequisicao(validarCadastroPedido), cadastrarPedido)

rotas.get('/pedido', listarPedidos)


module.exports = rotas
