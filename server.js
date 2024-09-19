const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
const port = 3000;

// Configurar o pool de conexão com o PostgreSQL
const pool = new Pool({
    user: 'seu_usuario', // substitua pelo seu usuário
    host: 'localhost',
    database: 'db_facs',
    password: 'sua_senha', // substitua pela sua senha
    port: 5432,
});

// Middleware
app.use(cors());
app.use(express.json());

// Rota para criar tabelas
app.post('/create-tables', async (req, res) => {
    try {
        await pool.query(`
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
        `);
        res.status(201).json({ message: 'Tabelas criadas com sucesso!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao criar tabelas' });
    }
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
