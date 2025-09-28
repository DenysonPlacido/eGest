// /workspaces/eGest/public/js/scriptConsultaPessoa.js
import { showAlert } from './alerts.js';

document.addEventListener('DOMContentLoaded', () => {

  const API_BASE = 'https://e-gest-back-end.vercel.app/api/pessoas';
  let paginaAtual = 1;
  const limitePorPagina = 10;
  let resultados = [];
  let totalRegistros = 0;

  // Elementos
  const formBusca = document.getElementById('form-busca');
  const btnExportar = document.getElementById('btn-exportar');
  const btnAnterior = document.getElementById('btn-anterior');
  const btnProximo = document.getElementById('btn-proximo');
  const paginaLabel = document.getElementById('pagina-atual');
  const tabelaBody = document.querySelector('#tabela-pessoas tbody');
  const formEdicaoContainer = document.getElementById('form-edicao-container');
  const formEdicao = document.getElementById('form-edicao');
  const btnCancelarEdicao = document.getElementById('btn-cancelar-edicao');

  // 🔍 Buscar
  if (formBusca) {
    formBusca.addEventListener('submit', async (e) => {
      e.preventDefault();
      paginaAtual = 1;
      await buscarPessoas();
    });
  }

  // ⏪ Paginação
  if (btnAnterior) {
    btnAnterior.addEventListener('click', async () => {
      if (paginaAtual > 1) {
        paginaAtual--;
        await buscarPessoas();
      }
    });
  }

  if (btnProximo) {
    btnProximo.addEventListener('click', async () => {
      if (paginaAtual * limitePorPagina < totalRegistros) {
        paginaAtual++;
        await buscarPessoas();
      }
    });
  }

  // 📤 Exportar
  if (btnExportar) {
    btnExportar.addEventListener('click', () => {
      if (!resultados.length) return showAlert('⚠️ Nenhum dado para exportar', 'warning', 4000);

      const linhas = resultados.map(p =>
        `${p.pessoa_id};${p.nome};${p.cpf_cnpj};${p.email || ''};${p.numero || ''};${p.complemento || ''}`
      );
      const csv = ['ID;Nome;CPF/CNPJ;Email;Número;Complemento', ...linhas].join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'pessoas_filtradas.csv';
      link.click();
    });
  }

  // ❌ Cancelar edição
  if (btnCancelarEdicao) {
    btnCancelarEdicao.addEventListener('click', () => {
      if (formEdicaoContainer) formEdicaoContainer.style.display = 'none';
    });
  }

  // 💾 Salvar edição
  if (formEdicao) {
    formEdicao.addEventListener('submit', async (e) => {
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
        if (formEdicaoContainer) formEdicaoContainer.style.display = 'none';
        await buscarPessoas();
      } catch (err) {
        showAlert(`❌ ${err.message}`, 'error', 4000);
      }
    });
  }

  // 🔎 Buscar na API
  async function buscarPessoas() {
    const nomeInput = document.getElementById('busca-nome');
    const idInput = document.getElementById('busca-id');
    const nome = nomeInput ? nomeInput.value.trim() : '';
    const pessoa_id = idInput ? idInput.value.trim() : '';

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

      const data = await res.json();
      resultados = data.rows || data;
      totalRegistros = data.total || resultados.length;

      renderizarResultados(resultados);
      if (paginaLabel) paginaLabel.textContent = `Página ${paginaAtual} de ${Math.ceil(totalRegistros / limitePorPagina)}`;
    } catch (err) {
      showAlert(`❌ ${err.message}`, 'error', 4000);
      if (tabelaBody) tabelaBody.innerHTML = '';
    }
  }

  // 🖼️ Renderizar tabela
  function renderizarResultados(lista) {
    if (!tabelaBody) return;
    tabelaBody.innerHTML = '';

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
        <td>
          <span class="status ${pessoa.ativo ? 'ativo' : 'inativo'}">
            ${pessoa.ativo ? 'Ativo' : 'Inativo'}
          </span>
        </td>
        <td class="acoes">
          <button class="btn-visualizar" data-id="${pessoa.pessoa_id}">👁️</button>
          <button class="btn-editar" data-id="${pessoa.pessoa_id}">✏️</button>
          <button class="btn-excluir" data-id="${pessoa.pessoa_id}">🗑️</button>
        </td>
      `;
      tabelaBody.appendChild(tr);
    });
  }

  // Delegação de eventos da tabela
  if (tabelaBody) {
    tabelaBody.addEventListener('click', (e) => {
      const tr = e.target.closest('tr');
      if (!tr) return;
      const id = e.target.dataset.id;
      const pessoa = resultados.find(p => p.pessoa_id == id);
      if (!pessoa) return;

      if (e.target.classList.contains('btn-visualizar')) abrirFormularioEdicao(pessoa, true);
      if (e.target.classList.contains('btn-editar')) abrirFormularioEdicao(pessoa, false);
      if (e.target.classList.contains('btn-excluir')) excluirPessoa(id);
    });
  }

  // ✍️ Abrir formulário de edição/visualização
  function abrirFormularioEdicao(pessoa, somenteVisualizar = false) {
    if (!formEdicao || !formEdicaoContainer) return;

    formEdicaoContainer.style.display = 'block';
    formEdicao.pessoa_id.value = pessoa.pessoa_id;
    formEdicao.nome.value = pessoa.nome;
    formEdicao.cpf_cnpj.value = pessoa.cpf_cnpj;
    formEdicao.email.value = pessoa.email || '';
    formEdicao.numero.value = pessoa.numero || '';
    formEdicao.complemento.value = pessoa.complemento || '';

    [...formEdicao.elements].forEach(el => {
      if (el.name !== 'pessoa_id') el.disabled = somenteVisualizar;
    });
  }

  // 🗑️ Excluir pessoa
  async function excluirPessoa(id) {
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
      if (formEdicaoContainer) formEdicaoContainer.style.display = 'none';
      await buscarPessoas();
    } catch (err) {
      showAlert(`❌ ${err.message}`, 'error', 4000);
    }
  }

  // Inicializa a tabela
  buscarPessoas();
});
