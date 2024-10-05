const express = require('express');
const consign = require('consign');
const Tabelas = require('./config/Tabelas');

Tabelas.init()
Tabelas.seed()

const app = express();

consign().include('controllers').into(app);

app.listen(3000,() =>{
    console.log('Servidor rodando - porta 3000');
})

app.get('/', (req, res) =>{
    res.send('Servidor online!)')
})