const tabela = document.querySelector('#tabela-itens tbody');
const formBusca = document.getElementById('form-busca-itens');

formBusca.addEventListener('submit', e => {
  e.preventDefault();
  const filtro = {
    estoque_id: document.getElementById('busca-estoque').value,
    descricao_item: document.getElementById('busca-descricao').value
  };
  carregarItens(filtro);
});

async function carregarItens(filtro = {}) {
  try {
    const query = new URLSearchParams(filtro).toString();
    const res = await fetch(`/estoque/itens?${query}`);
    const dados = await res.json();
    tabela.innerHTML = '';

    dados.forEach(i => {
      tabela.innerHTML += `<tr>
        <td>${i.item_id}</td>
        <td>${i.estoque_id}</td>
        <td>${i.descricao_item}</td>
        <td>${i.tipo_medicao || '-'}</td>
        <td>${i.estoque_unidade}</td>
        <td>${i.estoque_peso}</td>
        <td>${i.custo_unitario || 0}</td>
        <td>${i.valor_venda || 0}</td>
        <td><button class="btn-ver" data-id="${i.item_id}">👁️</button></td>
      </tr>`;
    });
  } catch (err) {
    console.error('Erro ao carregar itens', err);
  }
}
