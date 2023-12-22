const juntarPedidos = (pedidos) => {
    const novoArray = {}

    for (let pedido of pedidos) {
        if (novoArray[pedido.produto_id]) {
            novoArray[pedido.produto_id].quantidade_produto += pedido.quantidade_produto;
        } else {
            novoArray[pedido.produto_id] = pedido
        }
    };

    return Object.values(novoArray)
}

module.exports = juntarPedidos