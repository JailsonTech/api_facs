const EstoqueDAO = require('../dao/estoqueDao');

module.exports = app => {
    app.post('/estoque', (request, response) => {
        const novoEstoque = request.body; // Supondo que você esteja usando um middleware como body-parser
        EstoqueDAO.adicionar(novoEstoque);
        response.status(201).send('Estoque adicionado com sucesso');
    });

    app.get('/estoque/:id', (request, response) => {
        const id = request.params.id;
        EstoqueDAO.get(id, (err, estoque) => {
            if (err) {
                response.status(404).send('Estoque não encontrado');
            } else {
                response.send(estoque);
            }
        });
    });

    app.get('/estoque', (request, response) => {
        EstoqueDAO.all((err, estoques) => {
            if (err) {
                response.status(404).send('Nenhum estoque encontrado');
            } else {
                response.send(estoques);
            }
        });
    });

    app.get('/estoque/total', (request, response) => {
        EstoqueDAO.total((err, total) => {
            if (err) {
                response.status(404).send('Erro ao obter total de estoques');
            } else {
                response.send({ total });
            }
        });
    });
};
