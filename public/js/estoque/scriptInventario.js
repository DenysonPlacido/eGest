const tabela = document.querySelector('#tabela-inventario tbody');
const formBusca = document.getElementById('form-busca-inventario');
const btnSalvar = document.getElementById('btn-salvar-inventario');
const msg = document.getElementById('msg-inventario');

formBusca.addEventListener('submit', e => {
  e.preventDefault();
  const filtro = {
    estoque_id: document.getElementById('busca-estoque').value,
    descricao_item: document.getElementById('busca-descricao').value
  };
  carregarInventario(filtro);
});

async function carregarInventario(filtro = {}) {
  try {
    const query = new URLSearchParams(filtro).toString();
    const res = await fetch(`/estoque/inventario?${query}`);
    const dados = await res.json();

    tabela.innerHTML = '';
    dados.forEach(i => {
      tabela.innerHTML += `<tr>
        <td>${i.item_id}</td>
        <td>${i.estoque_id}</td>
        <td>${i.descricao_item}</td>
        <td>${i.estoque_unidade}</td>
        <td><input type="number" class="contagem" value="${i.estoque_unidade}" min="0"></td>
        <td class="diferenca">0</td>
        <td><button class="btn-calcular" data-id="${i.item_id}">📊 Calcular</button></td>
      </tr>`;
    });

    document.querySelectorAll('.btn-calcular').forEach(btn => {
      btn.addEventListener('click', () => {
        const tr = btn.closest('tr');
        const contada = parseFloat(tr.querySelector('.contagem').value);
        const atual = parseFloat(tr.cells[3].innerText);
        tr.querySelector('.diferenca').innerText = contada - atual;
      });
    });
  } catch (err) {
    console.error(err);
  }
}

btnSalvar.addEventListener('click', async () => {
  const ajustes = Array.from(tabela.querySelectorAll('tr')).map(tr => ({
    item_id: parseInt(tr.querySelector('.btn-calcular').dataset.id),
    qtd_contada: parseFloat(tr.querySelector('.contagem').value)
  }));

  try {
    const res = await fetch('/estoque/inventario/ajustar', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ ajustes })
    });
    const data = await res.json();
    msg.innerText = data.mensagem || 'Ajustes salvos com sucesso';
    carregarInventario(); // recarrega tabela
  } catch (err) {
    console.error(err);
    msg.innerText = 'Erro ao salvar ajustes';
  }
});

carregarInventario();
