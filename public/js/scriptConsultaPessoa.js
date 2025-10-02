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
    'ID','Nome','CPF/CNPJ','Data Nasc.','Email',
    'DDD','Telefone','CEP','Logradouro','Bairro','Número','Complemento'
  ];
  
  const linhas = resultados.map(p =>
    [
      p.pessoa_id,
      p.nome,
      p.cpf_cnpj,
      p.data_nascimento ? new Date(p.data_nascimento).toLocaleDateString() : '',
      p.email || '',
      p.ddd || '',
      p.fone || '',
      p.cep || '',
      p.logradouro || '',
      p.bairro || '',
      p.numero || '',
      p.complemento || ''
    ].join(';')
  );

  const csv = [cabecalho.join(';'), ...linhas].join('\n');
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
      <td>${pessoa.data_nascimento ? new Date(pessoa.data_nascimento).toLocaleDateString() : '—'}</td>
      <td>${pessoa.email || '—'}</td>
      <td>${pessoa.ddd || '—'}</td>
      <td>${pessoa.fone || '—'}</td>
      <td>${pessoa.cep || '—'}</td>
      <td>${pessoa.logradouro || '—'}</td>
      <td>${pessoa.bairro || '—'}</td>
      <td>${pessoa.numero || '—'}</td>
      <td>${pessoa.complemento || '—'}</td>
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
  form.nome.value = pessoa.nome || '';
  form.cpf_cnpj.value = pessoa.cpf_cnpj || '';
  form.data_nascimento.value = pessoa.data_nascimento ? pessoa.data_nascimento.split('T')[0] : '';
  form.email.value = pessoa.email || '';
  form.ddd.value = pessoa.ddd || '';
  form.fone.value = pessoa.fone || '';
  form.cep.value = pessoa.cep || '';
  form.logradouro.value = pessoa.logradouro || '';
  form.bairro.value = pessoa.bairro || '';
  form.numero.value = pessoa.numero || '';
  form.complemento.value = pessoa.complemento || '';
}



// ✏️ Atualização de Usuario
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


document.getElementById('btn-cancelar-edicao').addEventListener('click', () => {
  document.getElementById('form-edicao-container').style.display = 'none';
});


document.get