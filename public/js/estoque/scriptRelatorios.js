const tabela = document.querySelector('#tabela-relatorios tbody');
const formFiltro = document.getElementById('form-filtro-relatorios');
const msg = document.getElementById('msg-relatorios');

formFiltro.addEventListener('submit', e => {
  e.preventDefault();
  const filtro = {
    estoque_id: document.getElementById('filtro-estoque').value,
    descricao_item: document.getElementById('filtro-descricao').value,
    data_inicio: document.getElementById('filtro-data-inicio').value,
    data_fim: document.getElementById('filtro-data-fim').value
  };
  gerarRelatorio(filtro);
});

async function gerarRelatorio(filtro = {}) {
  try {
    const query = new URLSearchParams(filtro).toString();
    const res = await fetch(`/estoque/relatorios?${query}`);
    const dados = await res.json();

    tabela.innerHTML = '';
    dados.forEach(i => {
      tabela.innerHTML += `<tr>
        <td>${i.item_id}</td>
        <td>${i.descricao_item}</td>
        <td>${i.estoque_atual}</td>
        <td>${i.giro || 0}</td>
        <td>${i.valorizacao || 0}</td>
        <td>${i.estoque_minimo || '-'}</td>
        <td>${i.observacoes || ''}</td>
      </tr>`;
    });
  } catch (err) {
    console.error('Erro ao gerar relatório', err);
    msg.innerText = 'Erro ao gerar relatório';
  }
}

// Gera relatório inicial ao carregar página
gerarRelatorio();
