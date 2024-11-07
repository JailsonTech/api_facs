const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

const app = express();
const port = 3000;

app.use(bodyParser.json());

// Conexão com o banco de dados MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', 
    database: 'loja'
});

// Conectando ao banco de dados
db.connect((err) => {
    if (err) throw err;
    console.log('Conectado ao banco de dados MySQL!');
});

// Rota para criar um cliente
app.post('/clientes', (req, res) => {
    const { nome, email, telefone, endereco } = req.body;
    
    // Validação básica
    if (!nome || !email) {
        return res.status(400).json({ error: "Nome e email são obrigatórios." });
    }

    const query = 'INSERT INTO Clientes (nome, email, telefone, endereco) VALUES (?, ?, ?, ?)';
    
    db.query(query, [nome, email, telefone, endereco], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ id_cliente: result.insertId });
    });
});


// Rota para criar um produto
app.post('/produtos', (req, res) => {
    const { nome_produto, preco, estoque } = req.body;
    const query = 'INSERT INTO Produtos (nome_produto, preco, estoque) VALUES (?, ?, ?)';
    
    db.query(query, [nome_produto, preco, estoque], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ id_produto: result.insertId });
    });
});

// Rota para criar um pedido
app.post('/pedidos', (req, res) => {
    const { id_cliente, id_produto, data_pedido, quantidade, valor_total } = req.body;
    const query = 'INSERT INTO Pedidos (id_cliente, id_produto, data_pedido, quantidade, valor_total) VALUES (?, ?, ?, ?, ?)';
    
    db.query(query, [id_cliente, id_produto, data_pedido, quantidade, valor_total], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ id_pedido: result.insertId });
    });
});

app.get('/pedidos', (req, res) => {
    const query = 'SELECT * FROM Pedidos';
    
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json(results);
    });
});

app.get('/produtos', (req, res) => {
    const query = 'SELECT * FROM Produtos';
    
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json(results);
    });
});

app.get('/clientes', (req, res) => {
    const query = 'SELECT * FROM Clientes';
    
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json(results);
    });
});


// Iniciando o servidor
app.listen(port, () => {
    console.log(`API rodando em http://localhost:${port}`);
});
