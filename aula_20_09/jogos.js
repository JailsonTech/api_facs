// Função para buscar os jogos da API
async function fetchJogos() {
    try {
        const response = await fetch('http://localhost:3000/jogos');
        const jogos = await response.json();
        const tableBody = document.getElementById('jogosTable');

        // Organiza os dados na tabela
        jogos.forEach(jogo => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${jogo.nome}</td>
                <td>${jogo.ano}</td>
                <td>${jogo.categoria}</td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Erro ao buscar os jogos:', error);
    }
}

// Chama a função para buscar os jogos ao carregar a página
window.onload = fetchJogos;