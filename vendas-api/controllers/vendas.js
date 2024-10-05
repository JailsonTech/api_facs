
const VendasDAO = require('../dao/VendasDao');

module.exports = app => {
    app.post('/vendas', (request, response) => {
        const novaVenda = request.body; // Supondo que você esteja usando um middleware como body-parser
        VendasDAO.adicionar(novaVenda);
        response.status(201).send('Venda adicionada com sucesso');
    });

    app.get('/vendas/:id', (request, response) => {
        const id = request.params.id;
        VendasDAO.get(id, (err, venda) => {
            if (err) {
                response.status(404).send('Venda não encontrada');
            } else {
                response.send(venda);
            }
        });
    });

    app.get('/vendas', (request, response) => {
        VendasDAO.all((err, vendas) => {
            if (err) {
                response.status(404).send('Nenhuma venda encontrada');
            } else {
                response.send(vendas);
            }
        });
    });

    app.get('/vendas/total', (request, response) => {
        VendasDAO.total((err, total) => {
            if (err) {
                response.status(404).send('Erro ao obter total de vendas');
            } else {
                response.send({ total });
            }
        });
    });
};
