document.addEventListener('DOMContentLoaded', () => {
  const tabelaBody = document.querySelector('#tabela-itens-pedido tbody');
  const modal = document.getElementById('modal-produto');
  const btnAdicionarProduto = document.getElementById('btn-adicionar-produto');
  const btnFecharModal = document.getElementById('btn-fechar-modal');
  const btnSalvarItem = document.getElementById('btn-salvar-item');

  let itens = [];

  btnAdicionarProduto.addEventListener('click', () => {
    modal.style.display = 'flex';
  });

  btnFecharModal.addEventListener('click', () => {
    modal.style.display = 'none';
    limparModal();
  });

  btnSalvarItem.addEventListener('click', () => {
    const descricao = document.getElementById('produto-descricao').value.trim();
    const quantidade = parseFloat(document.getElementById('produto-quantidade').value);
    const valor_unitario = parseFloat(document.getElementById('produto-valor').value);

    if (!descricao || quantidade <= 0 || valor_unitario <= 0) {
      alert('Preencha todos os campos corretamente.');
      return;
    }

    const item = { descricao, quantidade, valor_unitario };
    itens.push(item);
    renderizarTabela();
    modal.style.display = 'none';
    limparModal();
  });

  function renderizarTabela() {
    tabelaBody.innerHTML = '';
    itens.forEach((item, i) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${item.descricao}</td>
        <td>${item.quantidade}</td>
        <td>R$ ${item.valor_unitario.toFixed(2)}</td>
        <td>R$ ${(item.quantidade * item.valor_unitario).toFixed(2)}</td>
        <td><button onclick="removerItem(${i})">🗑️</button></td>
      `;
      tabelaBody.appendChild(tr);
    });
  }

  window.removerItem = (index) => {
    itens.splice(index, 1);
    renderizarTabela();
  };

  function limparModal() {
    document.getElementById('produto-descricao').value = '';
    document.getElementById('produto-quantidade').value = '';
    document.getElementById('produto-valor').value = '';
  }

  // Envio do formulário
  const formNovoPedido = document.getElementById('form-novo-pedido');
  formNovoPedido.addEventListener('submit', async (e) => {
    e.preventDefault();
    const tipo_pedido = formNovoPedido.tipo_pedido.value;
    const pessoa = formNovoPedido.pessoa.value;
    const observacao = formNovoPedido.observacao.value;
    const token = sessionStorage.getItem('token');

    if (itens.length === 0) {
      alert('Adicione pelo menos um item ao pedido.');
      return;
    }

    try {
      const res = await fetch('/api/pedidos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ tipo_pedido, pessoa_id: pessoa, observacao, itens })
      });

      const data = await res.json();
      if (data.status === 'OK') {
        alert('Pedido criado com sucesso!');
        window.location.href = '/pedidosConsulta.html';
      } else {
        alert(data.error || 'Erro ao criar pedido');
      }
    } catch (err) {
      console.error(err);
      alert('Erro ao criar pedido.');
    }
  });
});
