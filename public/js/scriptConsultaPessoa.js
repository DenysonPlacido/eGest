// /workspaces/eGest/public/js/scriptConsultaPessoa.js
import { showAlert } from './alerts.js';

const API_BASE = 'https://e-gest-back-end.vercel.app/api/pessoas';

let paginaAtual = 1;
const limitePorPagina = 10;
let resultados = [];

const formBusca = document.getElementById('form-busca');
const btnExportar = document.getElementById('btn-exportar');
const btnAnterior = document.getElementById('btn-anterior');
const btnProximo = document.getElementById('btn-proximo');
const paginaLabel = document.getElementById('pagina-atual');
const btnNovo = document.getElementById('btn-novo');


const formEdicaoContainer = document.getElementById('form-edicao-container');
const formEdicao = document.getElementById('form-edicao');
const formEdicaoTitle = document.getElementById('form-edicao-title');
const btnToggleEdit = document.getElementById('btn-toggle-edit');
const btnCloseForm = document.getElementById('btn-close-form');
const btnSalvar = document.getElementById('btn-salvar');
const btnCancelarEdicao = document.getElementById('btn-cancelar-edicao');
const btnExcluir = document.getElementById('btn-excluir-edicao');

const modalEndereco = document.getElementById('modal-endereco');
const btnBuscarEndereco = document.getElementById('btn-buscar-endereco');
const btnPesquisarEndereco = document.getElementById('btn-pesquisar-endereco');
const btnFecharModalEndereco = document.getElementById('btn-fechar-modal-endereco');
const resultadoEnderecos = document.getElementById('resultado-enderecos');

let editMode = false; // false = somente visualizacao; true = edicao

if (btnCloseForm) {
  btnCloseForm.addEventListener('click', () => {
    formEdicaoContainer.style.display = 'none';
  });
}

if (btnCancelarEdicao) {
  btnCancelarEdicao.addEventListener('click', () => {
    formEdicaoContainer.style.display = 'none';
  });
}

if (btnToggleEdit) {
  btnToggleEdit.addEventListener('click', () => {
    editMode = true;
    setFormMode('edit');
    formEdicaoTitle.textContent = `Editar Pessoa — ${formEdicao.pessoa_id.value}`;
  });
}

// ---------- Mask helpers ----------
function onlyDigits(str){ return str.replace(/\D/g,''); }

function maskCPF_CNPJ(value){
  const digits = onlyDigits(value);
  if(digits.length <= 11){
    // CPF: 000.000.000-00
    return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{0,2})/, (_,a,b,c,d) => {
      return `${a}${b?'.'+b:''}${c?'.'+c:''}${d?'-'+d:''}`;
    }).slice(0,14);
  } else {
    // CNPJ: 00.000.000/0000-00
    return digits.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{0,2})/, (_,a,b,c,d,e) => {
      return `${a}${b?'.'+b:''}${c?'.'+c:''}${d?'/'+d:''}${e?'-'+e:''}`;
    }).slice(0,18);
  }
}

function maskPhone(value){
  const d = onlyDigits(value);
  if(d.length <= 10){
    // (00) 0000-0000
    return d.replace(/(\d{2})(\d{4})(\d{0,4})/, (_,a,b,c) => `${a?`(${a}) `:''}${b}${c?'-'+c:''}`).slice(0,13);
  } else {
    // (00) 00000-0000
    return d.replace(/(\d{2})(\d{5})(\d{0,4})/, (_,a,b,c) => `${a?`(${a}) `:''}${b}${c?'-'+c:''}`).slice(0,14);
  }
}

function maskCEP(value){
  const d = onlyDigits(value).slice(0,8);
  return d.replace(/(\d{5})(\d{0,3})/, (_,a,b) => `${a}${b?'-'+b:''}`);
}

// attach masks to inputs (applied in edit mode)
function attachMasks() {
  const cpf = formEdicao.querySelector('[name="cpf_cnpj"]');
  const ddd = formEdicao.querySelector('[name="ddd"]');
  const fone = formEdicao.querySelector('[name="fone"]');
  const cep = formEdicao.querySelector('[name="cep"]');

  if(cpf){
    cpf.addEventListener('input', (e) => { e.target.value = maskCPF_CNPJ(e.target.value); });
  }
  if(fone){
    fone.addEventListener('input', (e) => { e.target.value = maskPhone(e.target.value); });
  }
  if(cep){
    cep.addEventListener('input', (e) => { e.target.value = maskCEP(e.target.value); });
  }
  // ddd simple digits only
  if(ddd){
    ddd.addEventListener('input', (e) => { e.target.value = onlyDigits(e.target.value).slice(0,4); });
  }
}

// ---------- Busca Pessoas ----------
formBusca.addEventListener('submit', async (e) => {
  e.preventDefault();
  paginaAtual = 1;
  await buscarPessoas();
});

btnAnterior.addEventListener('click', async () => {
  if (paginaAtual > 1) {
    paginaAtual--;
    await buscarPessoas();
  }
});

btnProximo.addEventListener('click', async () => {
  paginaAtual++;
  await buscarPessoas();
});

btnExportar.addEventListener('click', () => {
  if (!resultados.length) return showAlert('⚠️ Nenhum dado para exportar', 'warning', 4000);

  const cabecalho = [
    'ID','Nome','CPF/CNPJ','Data Nasc','Email','DDD','Telefone',
    'CEP','Logradouro','Bairro','Número','Complemento','Cidade','UF','País','Tipo Pessoa'
  ];

  const linhas = resultados.map(p => [
    p.pessoa_id,
    p.nome,
    p.cpf_cnpj,
    p.data_nascimento ? new Date(p.data_nascimento).toLocaleDateString() : '',
    p.email || '',
    p.ddd || '',
    p.fone || '',
    p.cep || '',
    (p.nome_do_logradouro || p.logradouro || '') ,
    p.bairro || '',
    p.numero || '',
    p.complemento || '',
    p.nome_cidade || '',
    p.codigo_uf || '',
    p.nome_pais || '',
    p.tipo_pessoa || ''
  ].join(';'));

  const csv = [cabecalho.join(';'), ...linhas].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `pessoas_pagina_${paginaAtual}.csv`;
  link.click();
});

async function buscarPessoas() {
  const nome = document.getElementById('busca-nome').value.trim();
  const pessoa_id = document.getElementById('busca-id').value.trim();

  // build query safely
  const params = new URLSearchParams();
  params.set('nome', nome || '');
  params.set('pessoa_id', pessoa_id || '');
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
      const errBody = await res.json().catch(()=>null);
      throw new Error(errBody?.error || errBody?.message || 'Erro ao buscar pessoas');
    }

    resultados = await res.json();
    renderizarResultados(resultados);
    paginaLabel.textContent = `Página ${paginaAtual}`;
  } catch (err) {
    showAlert(`❌ ${err.message}`, 'error', 4000);
    resultados = [];
    document.querySelector('#tabela-pessoas tbody').innerHTML = '';
  }
}

function renderizarResultados(lista) {
  const tbody = document.querySelector('#tabela-pessoas tbody');
  tbody.innerHTML = '';

  if (!lista.length) {
    showAlert('Nenhum resultado encontrado.', 'warning', 4000);
    return;
  }

  lista.forEach(pessoa => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${pessoa.pessoa_id}</td>
      <td>${pessoa.nome || '—'}</td>
      <td>${pessoa.cpf_cnpj || '—'}</td>
      <td>${pessoa.data_nascimento ? new Date(pessoa.data_nascimento).toLocaleDateString() : '—'}</td>
      <td>${pessoa.email || '—'}</td>
      <td>${(pessoa.ddd || '') + (pessoa.fone ? ' ' + pessoa.fone : '') || '—'}</td>
      <td>${pessoa.nome_do_logradouro || pessoa.logradouro || '—'}</td>
      <td>${pessoa.nome_cidade ? `${pessoa.nome_cidade} / ${pessoa.codigo_uf || ''}` : '—'}</td>
      <td>${pessoa.nome_pais || '—'}</td>
      <td>
        <button class="btn-visualizar" data-id="${pessoa.pessoa_id}">👁️</button>
        <button class="btn-editar" data-id="${pessoa.pessoa_id}">✏️</button>
      </td>
    `;
    tbody.appendChild(tr);

    tr.querySelector('.btn-visualizar').addEventListener('click', () => abrirFormulario(pessoa, false));
    tr.querySelector('.btn-editar').addEventListener('click', () => abrirFormulario(pessoa, true));
  });
}


btnNovo && btnNovo.addEventListener('click', () => {
  if (!formEdicaoContainer || !formEdicao) {
    window.location.href = 'cadastroPessoa.html';
    return;
  }

  formEdicao.reset();
  formEdicaoTitle.textContent = 'Nova Pessoa';

  editMode = true;
  setFormMode('edit');
  formEdicaoContainer.style.display = 'flex';
  attachMasks();
});



// abre formulário — se modoEdit = false: só leitura (visualizar); se true: abrir já em edição
function abrirFormulario(pessoa, modoEdit = false) {
  formEdicaoContainer.style.display = 'flex';
  editMode = modoEdit;

  formEdicaoTitle.textContent = modoEdit ? `Editar Pessoa — ${pessoa.pessoa_id}` : `Visualizar Pessoa — ${pessoa.pessoa_id}`;

  // preencher campos
  formEdicao.pessoa_id.value = pessoa.pessoa_id;
  formEdicao.nome.value = pessoa.nome || '';
  formEdicao.cpf_cnpj.value = pessoa.cpf_cnpj || '';
  formEdicao.data_nascimento.value = pessoa.data_nascimento ? pessoa.data_nascimento.split('T')[0] : '';
  formEdicao.email.value = pessoa.email || '';
  formEdicao.ddd.value = pessoa.ddd || '';
  formEdicao.fone.value = pessoa.fone || '';
  formEdicao.cep.value = pessoa.cep || '';
  formEdicao.logradouro.value = pessoa.nome_do_logradouro || pessoa.logradouro || '';
  formEdicao.bairro.value = pessoa.bairro || '';
  formEdicao.numero.value = pessoa.numero || '';
  formEdicao.complemento.value = pessoa.complemento || '';
  formEdicao.nome_cidade.value = pessoa.nome_cidade || '';
  formEdicao.codigo_uf.value = pessoa.codigo_uf || '';
  formEdicao.nome_pais.value = pessoa.nome_pais || '';

  // técnicos
  formEdicao.cod_logradouro.value = pessoa.cod_logradouro || '';
  formEdicao.cod_cidade.value = pessoa.cod_cidade || '';
  formEdicao.id_pais.value = pessoa.id_pais || '';

  setFormMode(editMode ? 'edit' : 'view');
  attachMasks();
}

function setFormMode(mode){
  // mode: 'view' or 'edit'
  const inputs = formEdicao.querySelectorAll('input');
  if(mode === 'view'){
    inputs.forEach(i => { i.disabled = true; });
    // keep cpf disabled as per spec
    formEdicao.querySelector('[name="cpf_cnpj"]').disabled = true;
    btnSalvar.style.display = 'none';
    btnExcluir.style.display = 'none';
    btnCancelarEdicao.style.display = 'inline-block';
    btnToggleEdit.style.display = 'inline-block';
  } else {
    inputs.forEach(i => { i.disabled = false; });
    // cpf stays disabled (we don't allow changing cpf/cnpj)
    formEdicao.querySelector('[name="cpf_cnpj"]').disabled = true;
    formEdicao.querySelector('[name="nome_cidade"]').disabled = true;
    formEdicao.querySelector('[name="codigo_uf"]').disabled = true;
    formEdicao.querySelector('[name="nome_pais"]').disabled = true;

    btnSalvar.style.display = 'inline-block';
    btnExcluir.style.display = 'inline-block';
    btnCancelarEdicao.style.display = 'inline-block';
    btnToggleEdit.style.display = 'none';
  }
}

// toggle: se estava em view, passa para edit
btnToggleEdit.addEventListener('click', () => {
  editMode = true;
  setFormMode('edit');
  formEdicaoTitle.textContent = `Editar Pessoa — ${formEdicao.pessoa_id.value}`;
});

// fechar formulário
btnCloseForm.addEventListener('click', () => {
  formEdicaoContainer.style.display = 'none';
});

// cancelar edição: volta para modo view com dados originais (recarrega a lista)
btnCancelarEdicao.addEventListener('click', async () => {
  formEdicaoContainer.style.display = 'none';
});

// excluir (chama DELETE)
btnExcluir.addEventListener('click', async () => {
  const id = formEdicao.pessoa_id.value;
  if (!id) return showAlert('ID inválido', 'error', 3000);
  if (!confirm('Tem certeza que deseja excluir esta pessoa?')) return;

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
      const e = await res.json().catch(()=>null);
      throw new Error(e?.error || e?.mensagem || 'Erro ao excluir pessoa');
    }

    const result = await res.json();
    showAlert(result.mensagem || '✅ Pessoa excluída.', 'success', 4000);
    formEdicaoContainer.style.display = 'none';
    await buscarPessoas();
  } catch (err) {
    showAlert(`❌ ${err.message}`, 'error', 4000);
  }
});

// salvar (PUT)
formEdicao.addEventListener('submit', async (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(e.target).entries());

  // remove mask characters from cpf/cep/phone before sending
  data.cpf_cnpj = onlyDigits(data.cpf_cnpj || '');
  data.cep = onlyDigits(data.cep || '');
  data.ddd = onlyDigits(data.ddd || '');
  data.fone = onlyDigits(data.fone || '');

  const token = localStorage.getItem('token');
  const empresaId = localStorage.getItem('empresaId');

  try {
    const res = await fetch(`${API_BASE}/${data.pessoa_id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'x-empresa-id': empresaId
      },
      body: JSON.stringify(data)
    });

    if (!res.ok) {
      const e = await res.json().catch(()=>null);
      throw new Error(e?.error || e?.mensagem || 'Erro ao atualizar pessoa');
    }

    const result = await res.json();
    showAlert(result.mensagem || '✅ Pessoa atualizada com sucesso!', 'success', 4000);
    formEdicaoContainer.style.display = 'none';
    await buscarPessoas();
  } catch (err) {
    showAlert(`❌ ${err.message}`, 'error', 4000);
  }
});

// ---------- BUSCA DE ENDEREÇO (modal) ----------
btnBuscarEndereco.addEventListener('click', () => {
  // abre modal
  modalEndereco.style.display = 'flex';
  resultadoEnderecos.innerHTML = '';
  // clear modal inputs
  document.getElementById('busca-cep').value = formEdicao.cep.value || '';
  document.getElementById('busca-logradouro').value = formEdicao.logradouro.value || '';
  document.getElementById('busca-bairro').value = formEdicao.bairro.value || '';
  document.getElementById('busca-cidade').value = formEdicao.nome_cidade.value || '';
  document.getElementById('busca-logradouro').focus();
});

btnFecharModalEndereco.addEventListener('click', () => {
  modalEndereco.style.display = 'none';
});

btnPesquisarEndereco.addEventListener('click', async () => {
  const cep = document.getElementById('busca-cep').value.trim();
  const logradouro = document.getElementById('busca-logradouro').value.trim();
  const bairro = document.getElementById('busca-bairro').value.trim();
  const cidade = document.getElementById('busca-cidade').value.trim();

  // build params
  const params = new URLSearchParams();
  if(cep) params.set('cep', cep);
  if(logradouro) params.set('logradouro', logradouro);
  if(bairro) params.set('bairro', bairro);
  if(cidade) params.set('cidade', cidade);

  const token = localStorage.getItem('token');
  const empresaId = localStorage.getItem('empresaId');

  try {
    const res = await fetch(`${API_BASE}/enderecos/buscar?${params.toString()}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'x-empresa-id': empresaId
      }
    });

    if (!res.ok) {
      const e = await res.json().catch(()=>null);
      throw new Error(e?.erro || e?.error || 'Erro ao buscar endereços');
    }

    const lista = await res.json();
    renderizarEnderecos(lista);
  } catch (err) {
    showAlert(`❌ ${err.message}`, 'error', 4000);
    resultadoEnderecos.innerHTML = '';
  }
});

function renderizarEnderecos(lista) {
  resultadoEnderecos.innerHTML = '';
  if (!lista || !lista.length) {
    resultadoEnderecos.innerHTML = `<div class="cp-no-results">Nenhum endereço encontrado.</div>`;
    return;
  }

  lista.forEach(item => {
    const div = document.createElement('div');
    div.className = 'cp-endereco-item';
    // Mostra principais campos e coloca data attributes para preencher o formulário
    div.innerHTML = `
      <div class="linha">
        <strong>${item.nome_do_logradouro || item.logradouro || ''}</strong>
        <small>${item.cep ? 'CEP: '+item.cep : ''} ${item.bairro ? ' • '+item.bairro : ''}</small>
      </div>
      <div class="linha">
        <span>${item.nome_cidade || ''} / ${item.codigo_uf || ''}</span>
        <span>${item.nome_pais || ''}</span>
        <button class="btn-selecionar-endereco">Selecionar</button>
      </div>
    `;

    // store the object for selection
    div.dataset.item = JSON.stringify(item);

    resultadoEnderecos.appendChild(div);

    div.querySelector('.btn-selecionar-endereco').addEventListener('click', () => {
      const obj = JSON.parse(div.dataset.item);
      preencherEnderecoNoFormulario(obj);
      modalEndereco.style.display = 'none';
    });
  });
}

function preencherEnderecoNoFormulario(item) {
  formEdicao.cod_logradouro.value = item.cod_logradouro || '';
  formEdicao.logradouro.value = item.nome_do_logradouro || item.nome_do_logradouro || '';
  formEdicao.cep.value = item.cep || '';
  formEdicao.bairro.value = item.bairro || item.distrito || '';
  formEdicao.numero.value = '';
  formEdicao.complemento.value = '';
  formEdicao.cod_cidade.value = item.cod_cidade || '';
  formEdicao.nome_cidade.value = item.nome_cidade || '';
  formEdicao.codigo_uf.value = item.codigo_uf || '';
  formEdicao.id_pais.value = item.cod_pais || item.id_pais || '';
  formEdicao.nome_pais.value = item.nome_pais || '';
}

// ---------- inicialização ----------
(function init(){
  buscarPessoas();
  attachMasks();

  // click outside modal to close (UX) — trata modal de endereço e modal de edição
  window.addEventListener('click', (ev) => {
    if (ev.target === modalEndereco) modalEndereco.style.display = 'none';
    if (ev.target === formEdicaoContainer) {
      formEdicaoContainer.style.display = 'none';
      editMode = false;
      if (formEdicao) formEdicao.reset();
    }
  });

  // fechar com ESC
  window.addEventListener('keydown', (ev) => {
    if (ev.key === 'Escape') {
      if (modalEndereco && modalEndereco.style.display !== 'none') modalEndereco.style.display = 'none';
      if (formEdicaoContainer && formEdicaoContainer.style.display !== 'none') {
        formEdicaoContainer.style.display = 'none';
        editMode = false;
        if (formEdicao) formEdicao.reset();
      }
    }
  });

})();

function adjustModalSizing() {
  const modal = document.getElementById('form-edicao-container');
  const content = modal?.querySelector('.modal-content');
  if (!modal || !content) return;

  // força o maxHeight conforme viewport (CSS já tem, só garante via JS em casos extremos)
  const maxH = Math.max(window.innerHeight - 80, 200);
  content.style.maxHeight = `${maxH}px`;

  // se o conteúdo excede 90% da altura da viewport, alinhar ao topo para melhor usabilidade
  const contentScroll = content.scrollHeight;
  if (contentScroll > window.innerHeight * 0.9) {
    modal.classList.add('align-top');
  } else {
    modal.classList.remove('align-top');
  }
}

// chamar adjustModalSizing sempre que abrir o modal ou quando redimensionar a janela
window.addEventListener('resize', () => requestAnimationFrame(adjustModalSizing));


