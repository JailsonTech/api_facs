import express from 'express'

const app = express();


const jogos = [
    { nome: 'The Legend of Zelda: Breath of the Wild', ano: 2017, categoria: 'Aventura' },
    { nome: 'God of War', ano: 2018, categoria: 'Ação' },
    { nome: 'Minecraft', ano: 2011, categoria: 'Sandbox' },
    { nome: 'The Witcher 3: Wild Hunt', ano: 2015, categoria: 'RPG' },
];

// Rota para a raiz
app.get('/', (req, res) => res.send('Servidor funcionando - Ok!'));

// Rota para listar jogos
app.get('/jogos', (req, res) => {
    res.json(jogos);
});

app.listen(3000, ()=> console.log('Servidor rodando - porta 3000'));

