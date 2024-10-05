const conexao = require('./conexao');
const ClienteDAO = require('../dao/ClienteDao');
const Cliente = require('../models/Cliente');

class Tabelas {
    init() {
        conexao.serialize(() => {
            conexao.run(`CREATE TABLE IF NOT EXISTS clientes (
                id INTEGER PRIMARY KEY,
                nome VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL,
                senha VARCHAR(255) NOT NULL
            )`);

            conexao.run(`CREATE TABLE IF NOT EXISTS estoques (
                id INTEGER PRIMARY KEY,
                nome VARCHAR(255) NOT NULL,
                valor REAL NOT NULL,
                quantidade INTEGER NOT NULL
            )`);

            conexao.run(`CREATE TABLE IF NOT EXISTS vendas (
                id INTEGER PRIMARY KEY,
                id_cliente INTEGER NOT NULL,
                id_estoque INTEGER NOT NULL,
                valor_total REAL NOT NULL,
                quantidade INTEGER NOT NULL,
                FOREIGN KEY(id_cliente) REFERENCES clientes(id),
                FOREIGN KEY(id_estoque) REFERENCES estoques(id)
            )`);
        });
    }

    seed() {
        ClienteDAO.total((err, total) => {
            if (total === 0) {
                ClienteDAO.adicionar(new Cliente('Cliente 1', 'cliente1@teste.com', '123456'));
                ClienteDAO.adicionar(new Cliente('Cliente 2', 'cliente2@teste.com', '123456'));
                ClienteDAO.adicionar(new Cliente('Cliente 3', 'cliente3@teste.com', '123456'));
                ClienteDAO.adicionar(new Cliente('Cliente 4', 'cliente4@teste.com', '123456'));
                ClienteDAO.adicionar(new Cliente('Cliente 5', 'cliente5@teste.com', '123456'));
            }
        });

        this.seedEstoque();
        this.seedVendas();
    }

    seedEstoque() {
        const estoques = [
            { nome: 'Produto A', valor: 10.00, quantidade: 100 },
            { nome: 'Produto B', valor: 20.00, quantidade: 200 },
            { nome: 'Produto C', valor: 30.00, quantidade: 300 },
            { nome: 'Produto D', valor: 40.00, quantidade: 400 },
            { nome: 'Produto E', valor: 50.00, quantidade: 500 },
        ];

        estoques.forEach(produto => {
            conexao.run(`INSERT INTO estoques (nome, valor, quantidade) VALUES (?, ?, ?)`, 
                [produto.nome, produto.valor, produto.quantidade], 
                (err) => {
                    if (err) console.error(err.message);
                });
        });
    }

    seedVendas() {
        const vendas = [
            { id_cliente: 1, id_estoque: 1, valor_total: 10.00, quantidade: 1 },
            { id_cliente: 2, id_estoque: 2, valor_total: 40.00, quantidade: 2 },
            { id_cliente: 3, id_estoque: 3, valor_total: 90.00, quantidade: 3 },
            { id_cliente: 4, id_estoque: 4, valor_total: 160.00, quantidade: 4 },
            { id_cliente: 5, id_estoque: 5, valor_total: 250.00, quantidade: 5 },
        ];

        vendas.forEach(venda => {
            conexao.run(`INSERT INTO vendas (id_cliente, id_estoque, valor_total, quantidade) VALUES (?, ?, ?, ?)`, 
                [venda.id_cliente, venda.id_estoque, venda.valor_total, venda.quantidade], 
                (err) => {
                    if (err) console.error(err.message);
                });
        });
    }
}

module.exports = new Tabelas();
