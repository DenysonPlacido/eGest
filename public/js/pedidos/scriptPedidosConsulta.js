document.addEventListener('DOMContentLoaded', () => {
  const tabelaBody = document.querySelector('#tabela-pedidos tbody');
  const formBusca = document.getElementById('form-busca');
  const formEdicao = document.getElementById('form-edicao');
  const formContainer = document.getElementById('form-edicao-container');
  const btnCloseForm = document.getElementById('btn-close-form');

  let pagina = 1;
  const porPagina = 10;
  let pedidos = [];

  async function carregarPedidos() {
    const tipo = document.getElementById('busca-tipo').value.trim();
    const status = document.getElementById('busca-status').value.trim();
    const token = sessionStorage.getItem('token');

    const res = await fetch(`/api/pedidos?tipo=${tipo}&status=${status}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    pedidos = await res.json();
    renderizarTabela();
  }

  function renderizarTabela() {
    tabelaBody.innerHTML = '';
    const inicio = (pagina - 1) * porPagina;
    const paginaPedidos = pedidos.slice(inicio, inicio + porPagina);

    paginaPedidos.forEach(p => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${p.pedido_id}</td>
        <td>${new Date(p.data_pedido).toLocaleDateString()}</td>
        <td>${p.tipo_pedido}</td>
        <td>${p.pessoa}</td>
        <td>${p.status}</td>
        <td>R$ ${Number(p.valor_total || 0).toFixed(2)}</td>
        <td>
          <button onclick="abrirDetalhes(${p.pedido_id})">👁️</button>
        </td>
      `;
      tabelaBody.appendChild(tr);
    });

    document.getElementById('pagina-atual').textContent = `Página ${pagina}`;
  }

  window.abrirDetalhes = async (id) => {
    const token = sessionStorage.getItem('token');
    const res = await fetch(`/api/pedidos/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const pedido = await res.json();

    formContainer.style.display = 'block';
    formEdicao.pedido_id.value = pedido.pedido_id;
    formEdicao.tipo_pedido.value = pedido.tipo_pedido;
    formEdicao.status.value = pedido.status;
    formEdicao.pessoa.value = pedido.pessoa;
    formEdicao.valor_total.value = `R$ ${Number(pedido.valor_total).toFixed(2)}`;
    formEdicao.observacao.value = pedido.observacao || '';

    const tbodyItens = document.querySelector('#tabela-itens tbody');
    tbodyItens.innerHTML = '';
    pedido.itens?.forEach(item => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${item.descricao}</td>
        <td>${item.quantidade}</td>
        <td>R$ ${Number(item.valor_unitario).toFixed(2)}</td>
        <td>R$ ${(item.quantidade * item.valor_unitario).toFixed(2)}</td>
      `;
      tbodyItens.appendChild(tr);
    });
  };

  btnCloseForm.addEventListener('click', () => {
    formContainer.style.display = 'none';
  });

  formBusca.addEventListener('submit', (e) => {
    e.preventDefault();
    carregarPedidos();
  });

  document.getElementById('btn-anterior').addEventListener('click', () => {
    if (pagina > 1) { pagina--; renderizarTabela(); }
  });
  document.getElementById('btn-proximo').addEventListener('click', () => {
    if (pagina * porPagina < pedidos.length) { pagina++; renderizarTabela(); }
  });

  carregarPedidos();
});
