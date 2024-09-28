async function salvarJogos() {
    const nome = document.getElementById('nome').value;
    const ano = document.getElementById('ano').value;
    const categoria = document.getElementById('categoria').value;

    const novoJogo = { nome, ano, categoria };

    try {
        const response = await fetch('http://localhost:3000/salvar_jogos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(novoJogo),
        });

        const message = await response.json();
        alert(message.message); // Exibe a mensagem de sucesso ou erro

        if (response.ok) {
            document.getElementById('jogoForm').reset(); // Limpa os campos do formulário
            fetchJogos(); // Atualiza a lista de jogos após salvar
        }
    } catch (error) {
        console.error('Erro ao salvar os jogos:', error);
    }
}

// Adiciona um event listener para o formulário
document.getElementById('jogoForm').addEventListener('submit', (event) => {
    event.preventDefault(); // Evita o recarregamento da página
    salvarJogos(); // Chama a função para salvar o jogo
});
