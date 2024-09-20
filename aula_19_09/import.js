const fs = require('fs');
const csv = require('csv-parser');
const { Pool } = require('pg');
require('dotenv').config();

// Configuração do pool de conexão com o PostgreSQL
const pool = new Pool({
    user: process.env.FACS_USER,
    host: process.env.FACS_HOST,
    database: process.env.FACS_NAME,
    password: process.env.FACS_PASSWORD,
    port: process.env.FACS_PORT,
});

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
            numero_nfe VARCHAR(50),
            serie VARCHAR(50),
            status VARCHAR(50),
            data_emissao DATE,
            natureza_operacao VARCHAR(100),
            cpf_cnpj VARCHAR(20),
            valor_total DECIMAL(10, 2),
            chave_danfe VARCHAR(50)
        );
    `;
    await pool.query(query);
};

// Função para importar produtos do CSV
const importProdutos = async () => {
    await ensureTablesExist(); // Garantir que as tabelas existam

    const produtos = [];
    
    fs.createReadStream('produtos.csv')
        .pipe(csv())
        .on('data', (row) => {
            const precoVendaVarejo = parseFloat(row['Preço Venda Varejo'].replace(',', '.'));
            const quantidadeEmEstoque = parseInt(row['Quantidade em Estoque']);
            const descricao = row['Descrição'] ? row['Descrição'].normalize('NFD').replace(/[\u0300-\u036f]/g, "") : '';

            // Validação dos dados
            if (!isNaN(precoVendaVarejo) && !isNaN(quantidadeEmEstoque)) {
                produtos.push({
                    nome: row['Tipo de Produto'],
                    preco: precoVendaVarejo,
                    quantidade: quantidadeEmEstoque,
                    descricao: descricao
                });
            } else {
                console.warn(`Produto inválido: ${JSON.stringify(row)}`);
            }
        })
        .on('end', async () => {
            for (const produto of produtos) {
                await pool.query(
                    'INSERT INTO produtos (nome, preco, quantidade, descricao) VALUES ($1, $2, $3, $4)',
                    [produto.nome, produto.preco, produto.quantidade, produto.descricao]
                );
            }
            console.log('Produtos importados com sucesso.');
        })
        .on('error', (error) => {
            console.error('Erro ao processar o CSV de produtos:', error.message);
        });
};

// Função para importar notas fiscais do CSV
const importNotasFiscais = async () => {
    const notasFiscais = [];

    fs.createReadStream('NotaFiscal.csv')
        .pipe(csv())
        .on('data', (row) => {
            const valorTotal = parseFloat(row['Valor Total'].replace(',', '.'));
            const dataEmissao = row['Data Emissão'] ? row['Data Emissão'].split('/').reverse().join('-') : null; // Converte para YYYY-MM-DD

            // Validação dos dados
            if (!isNaN(valorTotal) && dataEmissao) {
                notasFiscais.push({
                    numero_nfe: row['Nº NF-e/RPS'],
                    serie: row['Série'],
                    status: row['Status'],
                    data_emissao: dataEmissao,
                    natureza_operacao: row['Natureza da Operação'],
                    cpf_cnpj: row['CPF/CNPJ'],
                    valor_total: valorTotal,
                    chave_danfe: row['Chave DANFE']
                });
            } else {
                console.warn(`Nota fiscal inválida: ${JSON.stringify(row)}`);
            }
        })
        .on('end', async () => {
            for (const nota of notasFiscais) {
                await pool.query(
                    'INSERT INTO nota_fiscal (numero_nfe, serie, status, data_emissao, natureza_operacao, cpf_cnpj, valor_total, chave_danfe) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
                    [nota.numero_nfe, nota.serie, nota.status, nota.data_emissao, nota.natureza_operacao, nota.cpf_cnpj, nota.valor_total, nota.chave_danfe]
                );
            }
            console.log('Notas fiscais importadas com sucesso.');
        })
        .on('error', (error) => {
            console.error('Erro ao processar o CSV de notas fiscais:', error.message);
        });
};

// Chamar as funções de importação
const importData = async () => {
    try {
        await importProdutos();
        await importNotasFiscais();
    } catch (error) {
        console.error('Erro ao importar dados:', error.message);
    }
};

// Executar a importação
importData();
