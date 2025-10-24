// ...existing code...
import { showAlert } from '../alerts.js';

const API_BASE = 'https://e-gest-back-end.vercel.app/api/estoque/itemestoque';

let paginaAtual = 1;
const limitePorPagina = 10;
let resultados = [];

const formBusca = document.getElementById('form-busca-itens');
const btnExportar = document.getElementById('btn-exportar-itens');
const btnAnterior = document.getElementById('btn-anterior-itens');
const btnProximo = document.getElementById('btn-proximo-itens');
const paginaLabel = document.getElementById('pagina-atual-itens');
const btnNovo = document.getElementById('btn-novo-item');

const formEdicaoContainer = document.getElementById('form-edicao-item-container');
const formEdicao = document.getElementById('form-edicao-item');
const formEdicaoTitle = document.getElementById('form-edicao-item-title');
const btnToggleEdit = document.getElementById('btn-toggle-edit-item');
const btnCloseForm = document.getElementById('btn-close-form-item');
const btnSalvar = document.getElementById('btn-salvar-item');
const btnCancelarEdicao = document.getElementById('btn-cancelar-edicao-item');
const btnExcluir = document.getElementById('btn-excluir-item');

let editMode = false;

// ---------- helpers ----------
function onlyDigits(str) { return (str || '').toString().replace(/\D/g, ''); }

function attachMasks() {
  if (!formEdicao) return;
  const peso = formEdicao.querySelector('[name="estoque_peso"]');
  const custo = formEdicao.querySelector('[name="custo_unitario"]');
  const valor = formEdicao.querySelector('[name="valor_venda"]');

  const moneyMask = (e) => {
    const v = (e.target.value || '').replace(/[^\d.,]/g, '').replace(',', '.');
    e.target.value = v;
  };

  if (peso) peso.addEventListener('input', moneyMask);
  if (custo) custo.addEventListener('input', moneyMask);
  if (valor) valor.addEventListener('input', moneyMask);
}

// adiciona logo após attachMasks — define comportamento visual do formulário
function setFormMode(mode) {
  if (!formEdicao) return;
  const inputs = formEdicao.querySelectorAll('input, textarea, select');
  const idDisplay = formEdicao.querySelector('[name="item_id_display"]'); // movido para topo

  if (mode === 'view') {
    inputs.forEach(i => i.disabled = true);
    if (formEdicao.item_id) formEdicao.item_id.disabled = true;
    if (idDisplay) idDisplay.disabled = true;

    btnSalvar && (btnSalvar.style.display = 'none');
    btnExcluir && (btnExcluir.style.display = 'none');
    btnCancelarEdicao && (btnCancelarEdicao.style.display = 'none');
    btnToggleEdit && (btnToggleEdit.style.display = 'inline-block');
  } else { // 'edit'
    inputs.forEach(i => i.disabled = false);
    if (formEdicao.item_id) formEdicao.item_id.disabled = true; // proteger chave
    if (idDisplay) idDisplay.disabled = true;

    btnSalvar && (btnSalvar.style.display = 'inline-block');
    btnExcluir && (btnExcluir.style.display = 'inline-block');
    btnCancelarEdicao && (btnCancelarEdicao.style.display = 'inline-block');
    btnToggleEdit && (btnToggleEdit.style.display = 'none');
  }
}

// ---------- eventos UI ----------
formBusca && formBusca.addEventListener('submit', (e) => {
  e.preventDefault();
  paginaAtual = 1;
  buscarItens();
});

btnAnterior && btnAnterior.addEventListener('click', async () => {
  if (paginaAtual > 1) {
    paginaAtual--;
    await buscarItens();
  }
});

btnProximo && btnProximo.addEventListener('click', async () => {
  paginaAtual++;
  await buscarItens();
});

btnExportar && btnExportar.addEventListener('click', () => {
  if (!resultados.length) return showAlert('⚠️ Nenhum dado para exportar', 'warning', 4000);

  const cabecalho = ['Item ID', 'Estoque ID', 'Descrição', 'Tipo Medição', 'Unidade', 'Peso', 'Custo Unit.', 'Valor Venda'];
  const linhas = resultados.map(i => [
    i.item_id,
    i.estoque_id,
    i.descricao_item || '',
    i.tipo_medicao || '',
    i.estoque_unidade || '',
    i.estoque_peso || '',
    i.custo_unitario != null ? i.custo_unitario : '',
    i.valor_venda != null ? i.valor_venda : ''
  ].join(';'));

  const csv = [cabecalho.join(';'), ...linhas].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `itens_pagina_${paginaAtual}.csv`;
  link.click();
});




btnNovo && btnNovo.addEventListener('click', () => {
  if (!formEdicaoContainer || !formEdicao) {
    window.location.href = 'itemNew.html';
    return;
  }

  formEdicao.reset();
  formEdicaoTitle.textContent = 'Novo Item';
  
  editMode = true;
  setFormMode('edit');
  formEdicaoContainer.style.display = 'flex';
  attachMasks();
});


function abrirFormulario(item, modoEdit = false) {
  if (!formEdicaoContainer || !formEdicao) {
    const url = modoEdit ? `itemEdit.html?id=${encodeURIComponent(item.item_id)}` : `itemView.html?id=${encodeURIComponent(item.item_id)}`;
    window.location.href = url;
    return;
  }

  // abrir com helper
  openFormItem();
  editMode = modoEdit;
  formEdicaoTitle.textContent = modoEdit ? `Editar Item — ${item.item_id}` : `Visualizar Item — ${item.item_id}`;

  // preencher campos se existirem
  const setIf = (name, value) => { if (formEdicao[name]) formEdicao[name].value = value ?? ''; };

  setIf('item_id', item.item_id);
  setIf('estoque_id', item.estoque_id);
  setIf('descricao_item', item.descricao_item || '');
  setIf('tipo_medicao', item.tipo_medicao || '');
  setIf('estoque_unidade', item.estoque_unidade || '');
  setIf('estoque_peso', item.estoque_peso ?? '');
  setIf('custo_unitario', item.custo_unitario != null ? item.custo_unitario : '');
  setIf('valor_venda', item.valor_venda != null ? item.valor_venda : '');

  setFormMode(modoEdit ? 'edit' : 'view');
  attachMasks();

  // ajustar tamanho do modal de acordo com conteúdo
  requestAnimationFrame(adjustModalSizing);
}



// fechar formulário
btnCloseForm && btnCloseForm.addEventListener('click', () => {
  if (formEdicaoContainer) formEdicaoContainer.style.display = 'none';
});

// cancelar edição
btnCancelarEdicao && btnCancelarEdicao.addEventListener('click', () => {
  if (formEdicaoContainer) formEdicaoContainer.style.display = 'none';
});

// toggle para editar quando estiver em visualização
btnToggleEdit && btnToggleEdit.addEventListener('click', () => {
  editMode = true;
  setFormMode('edit');
  formEdicaoTitle.textContent = formEdicaoTitle.textContent.replace('Visualizar', 'Editar');
});

// excluir item (DELETE)
btnExcluir && btnExcluir.addEventListener('click', async () => {
  if (!formEdicao) return;
  const id = formEdicao.item_id?.value;
  if (!id) return showAlert('ID inválido', 'error', 3000);
  if (!confirm('Tem certeza que deseja excluir este item?')) return;

  const token = localStorage.getItem('token');
  const empresaId = localStorage.getItem('empresaId');

  try {
    const res = await fetch(`${API_BASE}/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'x-empresa-id': empresaId
      }
    });

    if (!res.ok) {
      const e = await res.json().catch(() => null);
      throw new Error(e?.error || e?.mensagem || 'Erro ao excluir item');
    }

    const result = await res.json();
    showAlert(result.mensagem || '✅ Item excluído.', 'success', 4000);
    formEdicaoContainer.style.display = 'none';
    await buscarItens();
  } catch (err) {
    showAlert(`❌ ${err.message}`, 'error', 4000);
  }
});

// salvar (PUT para edição, POST para novo)
formEdicao && formEdicao.addEventListener('submit', async (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(e.target).entries());

  // normalizações básicas
  data.estoque_peso = onlyDigits(data.estoque_peso || '').replace(/^0+/, '') || data.estoque_peso;
  data.custo_unitario = (data.custo_unitario || '').replace(',', '.');
  data.valor_venda = (data.valor_venda || '').replace(',', '.');

  const token = localStorage.getItem('token');
  const empresaId = localStorage.getItem('empresaId');

  try {
    const isNew = !data.item_id;
    const url = isNew ? API_BASE : `${API_BASE}/${data.item_id}`;
    const method = isNew ? 'POST' : 'PUT';

    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'x-empresa-id': empresaId
      },
      body: JSON.stringify(data)
    });

    if (!res.ok) {
      const e = await res.json().catch(() => null);
      throw new Error(e?.error || e?.mensagem || 'Erro ao salvar item');
    }

    const result = await res.json();
    showAlert(result.mensagem || (isNew ? '✅ Item criado!' : '✅ Item atualizado!'), 'success', 4000);
    formEdicaoContainer.style.display = 'none';
    await buscarItens();
  } catch (err) {
    showAlert(`❌ ${err.message}`, 'error', 4000);
  }
});

// ---------- busca e render ----------
async function buscarItens() {
  const estoqueId = document.getElementById('busca-estoque')?.value.trim() || '';
  const itemId = document.getElementById('busca-item-id')?.value.trim() || '';
  const descricao = document.getElementById('busca-descricao')?.value.trim() || '';

  const params = new URLSearchParams();
  if (estoqueId) params.set('estoque_id', estoqueId);
  if (itemId) params.set('item_id', itemId);
  if (descricao) params.set('descricao_item', descricao);
  params.set('limit', limitePorPagina);
  params.set('offset', (paginaAtual - 1) * limitePorPagina);

  const token = localStorage.getItem('token');
  const empresaId = localStorage.getItem('empresaId');

  try {
    const res = await fetch(`${API_BASE}?${params.toString()}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'x-empresa-id': empresaId
      }
    });

    if (!res.ok) {
      const errBody = await res.json().catch(() => null);
      throw new Error(errBody?.error || errBody?.mensagem || 'Erro ao buscar itens');
    }

    resultados = await res.json();
    renderizarResultados(resultados);
    if (paginaLabel) paginaLabel.textContent = `Página ${paginaAtual}`;
  } catch (err) {
    console.error('❌ Erro ao carregar itens:', err);
    showAlert(`❌ ${err.message}`, 'error', 4000);
    resultados = [];
    const tbody = document.querySelector('#tabela-itens tbody');
    if (tbody) tbody.innerHTML = '';
  }
}

function renderizarResultados(lista) {
  const tbody = document.querySelector('#tabela-itens tbody');
  if (!tbody) return;
  tbody.innerHTML = '';

  if (!lista || !lista.length) {
    tbody.innerHTML = `<tr><td colspan="9">Nenhum item encontrado.</td></tr>`;
    showAlert('Nenhum item encontrado.', 'warning', 3000);
    return;
  }

  lista.forEach(i => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${i.item_id}</td>
      <td>${i.estoque_id}</td>
      <td>${i.descricao_item || '—'}</td>
      <td>${i.tipo_medicao || '—'}</td>
      <td>${i.estoque_unidade || '—'}</td>
      <td>${i.estoque_peso || '—'}</td>
      <td>${i.custo_unitario != null ? i.custo_unitario : '—'}</td>
      <td>${i.valor_venda != null ? i.valor_venda : '—'}</td>
      <td>
        <button class="btn-visualizar" data-id="${i.item_id}" title="Visualizar">👁️</button>
        <button class="btn-editar" data-id="${i.item_id}" title="Editar">✏️</button>
      </td>
    `;
    tbody.appendChild(tr);

    tr.querySelector('.btn-visualizar')?.addEventListener('click', () => abrirFormulario(i, false));
    tr.querySelector('.btn-editar')?.addEventListener('click', () => abrirFormulario(i, true));
  });
}

// abre formulário de edição/visualização (mesmo padrão do scriptConsultaPessoa)
function closeFormItem() {
  if (!formEdicaoContainer) return;
  formEdicaoContainer.style.display = 'none';
  editMode = false;
  try { setFormMode('view'); } catch (e) { }
  if (formEdicao) formEdicao.reset();
}

function openFormItem() {
  if (!formEdicaoContainer) return;
  formEdicaoContainer.style.display = 'flex';
  formEdicaoContainer.style.alignItems = 'center';
  formEdicaoContainer.style.justifyContent = 'center';
  requestAnimationFrame(adjustModalSizing);
}

function adjustModalSizing() {
  const modal = formEdicaoContainer;
  const content = modal?.querySelector('.modal-content');
  if (!modal || !content) return;
  const maxH = Math.max(window.innerHeight - 80, 200);
  content.style.maxHeight = `${maxH}px`;
  if (content.scrollHeight > window.innerHeight * 0.9) {
    modal.classList.add('align-top');
  } else {
    modal.classList.remove('align-top');
  }
}

// assegurar bindings após DOM carregado (evita problemas se modal for injetado)
document.addEventListener('DOMContentLoaded', () => {
  // re-obter elementos por segurança
  const btnClose = document.getElementById('btn-close-form-item');
  const btnCancel = document.getElementById('btn-cancelar-edicao-item');
  const btnToggle = document.getElementById('btn-toggle-edit-item');

  // garantir type="button"
  [btnClose, btnCancel, btnToggle].forEach(b => {
    if (b && b.getAttribute('type') !== 'button') b.setAttribute('type', 'button');
  });

  btnClose?.addEventListener('click', (e) => { e.preventDefault(); closeFormItem(); });
  btnCancel?.addEventListener('click', (e) => { e.preventDefault(); closeFormItem(); });
  btnToggle?.addEventListener('click', (e) => {
    e.preventDefault();
    editMode = true;
    try { setFormMode('edit'); } catch (err) { }
    openFormItem();
  });

  // clicar fora fecha
  window.addEventListener('click', (ev) => {
    if (ev.target === formEdicaoContainer) closeFormItem();
  });

  // ESC fecha
  window.addEventListener('keydown', (ev) => {
    if (ev.key === 'Escape') closeFormItem();
  });

  // delegação: elementos com data-close dentro do modal fecham-no
  formEdicaoContainer?.addEventListener('click', (ev) => {
    if (ev.target.closest('[data-close]')) closeFormItem();
  });

  // redimensionamento ajusta o modal
  window.addEventListener('resize', () => requestAnimationFrame(adjustModalSizing));
});



// inicialização
(function init() {
  buscarItens();
  attachMasks();
  // garantir estado inicial de visualização
  setFormMode('view');

  // clique fora para fechar formulários modais (UX)
  window.addEventListener('click', (ev) => {
    if (ev.target === formEdicaoContainer) formEdicaoContainer.style.display = 'none';
  });
})();