const tabela = document.querySelector('#tabela-estoques tbody');
const formBusca = document.getElementById('form-busca');

formBusca.addEventListener('submit', e => {
  e.preventDefault();
  carregarEstoques({
    id: document.getElementById('busca-id').value,
    localizacao: document.getElementById('busca-localizacao').value
  });
});

async function carregarEstoques(filtro = {}) {
  try {
    const query = new URLSearchParams(filtro).toString();
    const res = await fetch(`/estoque?${query}`);
    const dados = await res.json();
    tabela.innerHTML = '';
    dados.forEach(e => {
      tabela.innerHTML += `<tr>
        <td>${e.estoque_id}</td>
        <td>${e.localizacao}</td>
        <td>${e.responsavel_nome || '-'}</td>
        <td>${new Date(e.data_inclusao).toLocaleString()}</td>
        <td>${e.ativo}</td>
        <td><button class="btn-ver" data-id="${e.estoque_id}">👁️</button></td>
      </tr>`;
    });
  } catch (err) {
    console.error(err);
  }
}

carregarEstoques();
