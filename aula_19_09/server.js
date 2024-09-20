require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const fs = require('fs');
const csv = require('csv-parser');

const app = express();
const port = 3000;

// Configurar o pool de conexão com o PostgreSQL
const pool = new Pool({
    user: process.env.FACS_USER,
    host: process.env.FACS_HOST,
    database: process.env.FACS_NAME,
    password: process.env.FACS_PASSWORD,
    port: process.env.FACS_PORT,
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Função para garantir que as tabelas existam
const ensureTablesExist = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS produtos (
            id SERIAL PRIMARY KEY,
            nome VARCHAR(255) NOT NULL,
            preco DECIMAL(10, 2) NOT NULL,
            quantidade INT NOT NULL,
            descricao TEXT
        );
        CREATE TABLE IF NOT EXISTS nota_fiscal (
            id SERIAL PRIMARY KEY,
            produto_id INT REFERENCES produtos(id),
            data DATE NOT NULL,
            valor_total DECIMAL(10, 2) NOT NULL,
            quantidade_vendida INT NOT NULL
        );
    `;
    await pool.query(query);
};

// Rota para carregar dados do CSV
app.post('/load-data', async (req, res) => {
    await ensureTablesExist();

    // Carregar produtos
    fs.createReadStream('produtos.csv')
        .pipe(csv())
        .on('data', async (row) => {
            await pool.query(
                'INSERT INTO produtos (nome, preco, quantidade, descricao) VALUES ($1, $2, $3, $4)',
                [row.nome, parseFloat(row.preco.replace(',', '.')), parseInt(row.quantidade), row.descricao]
            );
        })
        .on('end', async () => {
            console.log('Produtos carregados com sucesso');
            // Carregar notas fiscais
            fs.createReadStream('NotaFiscal.csv')
                .pipe(csv())
                .on('data', async (row) => {
                    await pool.query(
                        'INSERT INTO nota_fiscal (produto_id, data, valor_total, quantidade_vendida) VALUES ($1, $2, $3, $4)',
                        [parseInt(row.produto_id), row.data, parseFloat(row.valor_total.replace(',', '.')), parseInt(row.quantidade_vendida)]
                    );
                })
                .on('end', () => {
                    console.log('Notas fiscais carregadas com sucesso');
                    res.status(200).json({ message: 'Dados carregados com sucesso!' });
                });
        });
});

// Rota para obter dados de produtos
app.get('/produtos', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM produtos');
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao buscar produtos' });
    }
});

// Rota para obter dados de nota fiscal
app.get('/nota-fiscal', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM nota_fiscal');
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao buscar notas fiscais' });
    }
});

// Iniciar o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
