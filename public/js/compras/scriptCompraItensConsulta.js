const tabelaItens = document.querySelector('#tabela-itens-compra tbody');
const formBuscaItens = document.getElementById('form-busca-itens-compra');

formBuscaItens.addEventListener('submit', e => {
  e.preventDefault();
  const filtro = {
    compra_id: document.getElementById('busca-compra-id').value,
    descricao_item: document.getElementById('busca-descricao').value
  };
  carregarItensCompra(filtro);
});

async function carregarItensCompra(filtro = {}) {
  try {
    const query = new URLSearchParams(filtro).toString();
    const res = await fetch(`/compras/itens?${query}`);
    const dados = await res.json();

    tabelaItens.innerHTML = '';
    dados.forEach(i => {
      tabelaItens.innerHTML += `<tr>
        <td>${i.compra_item_id}</td>
        <td>${i.compra_id}</td>
        <td>${i.item_id}</td>
        <td>${i.quantidade}</td>
        <td>${i.preco_unitario}</td>
        <td>${i.preco_total}</td>
      </tr>`;
    });
  } catch (err) {
    console.error(err);
  }
}

// Carrega inicialmente
carregarItensCompra();
