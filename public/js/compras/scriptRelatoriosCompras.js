const tabelaRelatorios = document.querySelector('#tabela-relatorios-compras tbody');
const formRelatorios = document.getElementById('form-filtro-relatorios-compras');
const msgRelatorios = document.getElementById('msg-relatorios-compras');

formRelatorios.addEventListener('submit', e => {
  e.preventDefault();
  const filtro = {
    compra_id: document.getElementById('filtro-compra-id').value,
    fornecedor_id: document.getElementById('filtro-fornecedor').value,
    data_inicio: document.getElementById('filtro-data-inicio').value,
    data_fim: document.getElementById('filtro-data-fim').value
  };
  gerarRelatorioCompras(filtro);
});

async function gerarRelatorioCompras(filtro = {}) {
  try {
    const query = new URLSearchParams(filtro).toString();
    const res = await fetch(`/compras/relatorios?${query}`);
    const dados = await res.json();

    tabelaRelatorios.innerHTML = '';
    dados.forEach(c => {
      tabelaRelatorios.innerHTML += `<tr>
        <td>${c.compra_id}</td>
        <td>${c.fornecedor_id}</td>
        <td>${new Date(c.data_compra).toLocaleDateString()}</td>
        <td>${c.status}</td>
        <td>${c.valor_total}</td>
        <td>${c.observacao || ''}</td>
      </tr>`;
    });
  } catch (err) {
    console.error(err);
    msgRelatorios.innerText = 'Erro ao gerar relatório';
  }
}

// Carrega inicialmente
gerarRelatorioCompras();
