const tabelaCotacoes = document.querySelector('#tabela-cotacoes tbody');
const formCotacao = document.getElementById('form-cotacao');

formCotacao.addEventListener('submit', e => {
  e.preventDefault();
  const filtro = {
    fornecedor: document.getElementById('busca-fornecedor').value,
    produto: document.getElementById('busca-produto').value
  };
  carregarCotacoes(filtro);
});

async function carregarCotacoes(filtro = {}) {
  try {
    const query = new URLSearchParams(filtro).toString();
    const res = await fetch(`/compras/cotacoes?${query}`);
    const dados = await res.json();

    tabelaCotacoes.innerHTML = '';
    dados.forEach(c => {
      tabelaCotacoes.innerHTML += `<tr>
        <td>${c.cotacao_id}</td>
        <td>${c.fornecedor_id}</td>
        <td>${c.produto_id}</td>
        <td>${c.preco_unitario}</td>
        <td>${new Date(c.data).toLocaleDateString()}</td>
      </tr>`;
    });
  } catch (err) {
    console.error(err);
  }
}

// Carrega inicialmente
carregarCotacoes();
