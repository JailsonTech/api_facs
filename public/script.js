document.addEventListener('DOMContentLoaded', () => {
    fetchProdutos();
    fetchCpfs();
});

async function fetchProdutos() {
    const response = await fetch('http://localhost:3000/produtos');
    const produtos = await response.json();
    const select = document.getElementById('produto-select');

    produtos.forEach(produto => {
        const option = document.createElement('option');
        option.value = produto.id;
        option.textContent = produto.nome;
        select.appendChild(option);
    });

    select.addEventListener('change', (e) => {
        const selectedId = e.target.value;
        if (selectedId) {
            const selectedProduto = produtos.find(produto => produto.id == selectedId);
            displayProdutoDetails(selectedProduto);
        } else {
            document.getElementById('produto-details').innerHTML = '';
        }
    });
}

function displayProdutoDetails(produto) {
    const detailsDiv = document.getElementById('produto-details');
    if (typeof produto.preco === 'number') {
        detailsDiv.innerHTML = `
            <h2>Detalhes do Produto</h2>
            <p><strong>Nome:</strong> ${produto.nome}</p>
            <p><strong>Preço:</strong> R$ ${produto.preco.toFixed(2)}</p>
            <p><strong>Quantidade:</strong> ${produto.quantidade}</p>
            <p><strong>Descrição:</strong> ${produto.descricao}</p>
        `;
    } else {
        detailsDiv.innerHTML = `<p>Erro: preço inválido.</p>`;
    }
}

async function fetchCpfs() {
    const response = await fetch('http://localhost:3000/nota-fiscal');
    const notasFiscais = await response.json();
    const select = document.getElementById('cpf-select');

    const uniqueCpfs = [...new Set(notasFiscais.map(nota => nota.cpf_cnpj))];
    uniqueCpfs.forEach(cpf => {
        const option = document.createElement('option');
        option.value = cpf;
        option.textContent = cpf;
        select.appendChild(option);
    });

    select.addEventListener('change', (e) => {
        const selectedCpf = e.target.value;
        if (selectedCpf) {
            const filteredNotas = notasFiscais.filter(nota => nota.cpf_cnpj === selectedCpf);
            displayNotaFiscalDetails(filteredNotas);
        } else {
            document.getElementById('nota-fiscal-details').innerHTML = '';
        }
    });
}

function displayNotaFiscalDetails(notas) {
    const detailsDiv = document.getElementById('nota-fiscal-details');
    detailsDiv.innerHTML = '<h2>Detalhes da Nota Fiscal</h2>';

    notas.forEach(nota => {
        if (typeof nota.valor_total === 'number') {
            detailsDiv.innerHTML += `
                <p><strong>Nº NF-e:</strong> ${nota.numero_nfe}</p>
                <p><strong>Série:</strong> ${nota.serie}</p>
                <p><strong>Status:</strong> ${nota.status}</p>
                <p><strong>Data de Emissão:</strong> ${nota.data_emissao}</p>
                <p><strong>Valor Total:</strong> R$ ${nota.valor_total.toFixed(2)}</p>
                <p><strong>Chave DANFE:</strong> ${nota.chave_danfe}</p>
                <hr />
            `;
        } else {
            detailsDiv.innerHTML += `<p>Erro: valor total inválido.</p>`;
        }
    });
}
