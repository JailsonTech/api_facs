import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import bodyParser from 'body-parser';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public'))); // Serve arquivos estáticos

let jogos = [];

// Carrega os jogos do arquivo JSON ao iniciar o servidor
const loadJogosFromFile = () => {
    if (fs.existsSync(path.join(__dirname, 'jogos.json'))) {
        const data = fs.readFileSync(path.join(__dirname, 'jogos.json'), 'utf-8');
        jogos = JSON.parse(data);
    }
};

loadJogosFromFile();

// Rota para listar jogos
app.get('/jogos', (req, res) => {
    res.json(jogos);
});

// Rota para adicionar um novo jogo
app.post('/salvar_jogos', (req, res) => {
    const novoJogo = req.body;
    const existeJogo = jogos.find(jogo => jogo.nome === novoJogo.nome && jogo.ano === novoJogo.ano);

    if (existeJogo) {
        return res.status(400).json({ message: 'Jogo já existe!' });
    }

    jogos.push(novoJogo);
    saveJogosToFile(); // Salva os jogos no arquivo após adicionar
    res.status(201).json({ message: 'Jogo salvo com sucesso!', jogo: novoJogo });
});

// Função para salvar jogos em um arquivo JSON
const saveJogosToFile = () => {
    fs.writeFileSync(path.join(__dirname, 'jogos.json'), JSON.stringify(jogos, null, 2));
};

// Inicia o servidor
app.listen(3000, () => console.log('Servidor rodando - porta 3000'));
