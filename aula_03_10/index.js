const express = require('express'); // Corrigido de "required" para "require"
const mysql = require('mysql'); // Corrigido de "required" para "require"
const bodyParser = require('body-parser'); // Corrigido de "required" para "require"

// Criar uma instância do express
const app = express();
app.use(bodyParser.json());

// Conexão com o banco de dados
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',      
    password: '',      
    database: 'api'    
});


// Conectando ao banco de dados
db.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
        return;
    }
    console.log('Conectado com sucesso!');
});

// Inserir dados
app.post('/usuario', (req, res) => {
    const { nome, email } = req.body;

    if (!nome || !email) {
        return res.status(400).json({ message: 'Nome e e-mail são obrigatórios' });
    }

    const query = 'INSERT INTO usuario(nome, email) VALUES(?, ?)';
    db.query(query, [nome, email], (err, result) => {
        if (err) {
            console.error('Erro ao inserir dados:', err);
            return res.status(500).json({ message: 'Erro ao inserir usuário' });
        }

        return res.status(201).json({ message: 'Usuário inserido com sucesso' });
    });
});

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
