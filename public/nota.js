document.getElementById('nota-fiscal-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const produto_id = document.getElementById('produto_id').value;
    const data = document.getElementById('data').value;
    const valor_total_input = document.getElementById('valor_total').value;
    const quantidade_vendida = document.getElementById('quantidade_vendida').value;

    // Converte o valor para o formato decimal aceito pelo PostgreSQL
    const valor_total = parseFloat(valor_total_input.replace(',', '.'));

    if (isNaN(valor_total)) {
        alert('Por favor, insira um valor total válido no formato 10,00');
        return;
    }

    const response = await fetch('http://localhost:3000/nota-fiscal', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ produto_id, data, valor_total, quantidade_vendida }),
    });

    const result = await response.json();
    if (response.ok) {
        alert('Nota Fiscal adicionada com sucesso!');
    } else {
        alert('Erro ao adicionar nota fiscal: ' + result.error);
    }
});
