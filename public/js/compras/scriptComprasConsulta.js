const tabela = document.querySelector('#tabela-compras tbody');
const formBusca = document.getElementById('form-busca-compras');

formBusca.addEventListener('submit', e => {
  e.preventDefault();
  const filtro = {
    compra_id: document.getElementById('busca-id').value,
    fornecedor_id: document.getElementById('busca-fornecedor').value,
    status: document.getElementById('busca-status').value
  };
  carregarCompras(filtro);
});

async function carregarCompras(filtro = {}) {
  try {
    const query = new URLSearchParams(filtro).toString();
    const res = await fetch(`/compras?${query}`);
    const dados = await res.json();

    tabela.innerHTML = '';
    dados.forEach(c => {
      tabela.innerHTML += `<tr>
        <td>${c.compra_id}</td>
        <td>${c.fornecedor_id}</td>
        <td>${new Date(c.data_compra).toLocaleString()}</td>
        <td>${c.status}</td>
        <td>${c.valor_total}</td>
        <td>${c.observacao || ''}</td>
        <td>
          <button class="btn-ver" data-id="${c.compra_id}">👁️</button>
        </td>
      </tr>`;
    });
  } catch (err) {
    console.error(err);
  }
}

// Carrega inicialmente todas as compras
carregarCompras();
