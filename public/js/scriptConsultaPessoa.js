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

formBusca.addEventListener('submit', async (e) => {
  e.preventDefault();
  console.log('Formulário interceptado');

  paginaAtual = 1;
  await buscarPessoas();
});

console.log('formBusca:', formBusca);

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

  const linhas = resultados.map(p =>
    `${p.pessoa_id};${p.nome};${p.cpf_cnpj};${p.email};${p.numero || ''};${p.complemento || ''}`
  );
  const csv = ['ID;Nome;CPF/CNPJ;Email;Número;Complemento', ...linhas].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'pessoas_filtradas.csv';
  link.click();
});

async function buscarPessoas() {
  const nome = document.getElementById('busca-nome').value.trim();
  const pessoa_id = document.getElementById('busca-id').value.trim();

  const query = new URLSearchParams({
    nome: nome || '',
    pessoa_id: pessoa_id || '',
    limit: limitePorPagina,
    offset: (paginaAtual - 1) * limitePorPagina
  }).toString();

  const token = localStorage.getItem('token');
  const empresaId = localStorage.getItem('empresaId');


  console.log('🔍 Buscando pessoas...');
  console.log('Query:', query);
  console.log('Token:', token);
  console.log('Empresa ID:', empresaId);


  try {
    const res = await fetch(`${API_BASE}?${query}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'x-empresa-id': empresaId
      }
    });

    if (!res.ok) throw new Error('Erro ao buscar pessoas');

    resultados = await res.json();
    renderizarResultados(resultados);
    paginaLabel.textContent = `Página ${paginaAtual}`;
  } catch (err) {
    showAlert(`❌ ${err.message}`, 'error', 4000);
    // resultados = [];
    // document.querySelector('#tabela-pessoas tbody').innerHTML = '';
  }
}

function renderizarResultados(lista) {
  const tbody = document.querySelector('#tabela-pessoas tbody');
  tbody.innerHTML = '';

  if (!lista.length) {
    return showAlert('Nenhum resultado encontrado.', 'warning', 4000);
  }

  lista.forEach(pessoa => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${pessoa.pessoa_id}</td>
      <td>${pessoa.nome}</td>
      <td>${pessoa.cpf_cnpj}</td>
      <td>${pessoa.email || '—'}</td>
      <td>${pessoa.numero ?? '—'}</td>
      <td>${pessoa.complemento ?? '—'}</td>
      <td><button class="btn-visualizar" data-id="${pessoa.pessoa_id}">👁️ Visualizar</button></td>
    `;
    tbody.appendChild(tr);

    tr.querySelector('.btn-visualizar').addEventListener('click', () => abrirFormularioEdicao(pessoa));
  });
}

function abrirFormularioEdicao(pessoa) {
  const form = document.getElementById('form-edicao');
  document.getElementById('form-edicao-container').style.display = 'block';

  form.pessoa_id.value = pessoa.pessoa_id;
  form.nome.value = pessoa.nome;
  form.cpf_cnpj.value = pessoa.cpf_cnpj;
  form.email.value = pessoa.email || '';
  form.numero.value = pessoa.numero || '';
  form.complemento.value = pessoa.complemento || '';
}

document.getElementById('form-edicao').addEventListener('submit', async (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(e.target).entries());

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

    if (!res.ok) throw new Error('Erro ao atualizar pessoa');
    const result = await res.json();
    showAlert(result.mensagem || '✅ Pessoa atualizada com sucesso!', 'success', 4000);
    document.getElementById('form-edicao-container').style.display = 'none';
    await buscarPessoas();
  } catch (err) {
    showAlert(`❌ ${err.message}`, 'error', 4000);
  }
});

document.getElementById('btn-excluir-edicao').addEventListener('click', async () => {
  const id = document.querySelector('#form-edicao [name="pessoa_id"]').value;
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

    if (!res.ok) throw new Error('Erro ao excluir pessoa');
    const result = await res.json();
    showAlert(result.mensagem || '✅ Pessoa excluída.', 'success', 4000);
    document.getElementById('form-edicao-container').style.display = 'none';
    await buscarPessoas();
  } catch (err) {
    showAlert(`❌ ${err.message}`, 'error', 4000);
  }
});

document.get