import { showAlert } from './alerts.js';

const API_BASE = 'https://e-gest-back-end.vercel.app';

let paginaAtual = 1;
const limitePorPagina = 10;
let resultados = [];

const formBusca = document.getElementById('form-busca');
const listaContainer = document.getElementById('cp-pessoas-lista');
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
  if (!resultados.length) {
    return showAlert('⚠️ Nenhum dado para exportar', 'warning', 4000);
  }

  const linhas = resultados.map(p =>
    `${p.pessoa_id};${p.nome};${p.cpf_cnpj};${p.email};${p.numero};${p.complemento}`
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

  const filtros = {
    acao: 'SELECT',
    nome: nome || null,
    pessoa_id: pessoa_id || null,
    limit: limitePorPagina,
    offset: (paginaAtual - 1) * limitePorPagina
  };

  try {
    const res = await fetch(`${API_BASE}/api/pessoas/gerenciar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(filtros)
    });

    if (!res.ok) throw new Error('Erro ao buscar pessoas');

    resultados = await res.json();
    renderizarResultados(resultados);
    paginaLabel.textContent = `Página ${paginaAtual}`;
  } catch (err) {
    showAlert(`❌ ${err.message}`, 'error', 4000);
    resultados = [];
    listaContainer.innerHTML = '';
  }
}

function renderizarResultados(lista) {
  listaContainer.innerHTML = '';

  if (!lista.length) {
    return showAlert('Nenhum resultado encontrado.', 'warning', 4000);
  }

  lista.forEach(pessoa => {
    const form = document.createElement('form');
    form.className = 'cp-form-pessoa';

    form.innerHTML = `
      <input type="hidden" name="pessoa_id" value="${pessoa.pessoa_id}" />
      <input type="text" name="nome" value="${pessoa.nome}" placeholder="Nome" disabled />
      <input type="text" name="cpf_cnpj" value="${pessoa.cpf_cnpj}" placeholder="CPF/CNPJ" disabled />
      <input type="email" name="email" value="${pessoa.email}" placeholder="E-mail" disabled />
      <input type="text" name="complemento" value="${pessoa.complemento || ''}" placeholder="Complemento" disabled />
      <input type="text" name="numero" value="${pessoa.numero || ''}" placeholder="Número" disabled />

      <div class="cp-btn-group">
        <button type="button" class="btn-editar">Editar</button>
        <button type="submit" disabled>Salvar</button>
        <button type="button" class="btn-excluir">Excluir</button>
      </div>
    `;

    form.querySelector('.btn-editar').addEventListener('click', () => {
      form.querySelectorAll('input:not([type="hidden"]):not([name="cpf_cnpj"])').forEach(input => {
        input.disabled = false;
      });
      form.querySelector('button[type="submit"]').disabled = false;
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(form).entries());
      data.acao = 'UPDATE';

      try {
        const res = await fetch(`${API_BASE}/api/pessoas/gerenciar`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });

        if (!res.ok) throw new Error('Erro ao atualizar pessoa');

        const result = await res.json();
        showAlert(result.mensagem || '✅ Pessoa atualizada com sucesso!', 'success', 4000);
      } catch (err) {
        showAlert(`❌ ${err.message}`, 'error', 4000);
      }
    });

    form.querySelector('.btn-excluir').addEventListener('click', async () => {
      const id = form.pessoa_id.value;
      if (!confirm('Tem certeza que deseja excluir esta pessoa?')) return;

      try {
        const res = await fetch(`${API_BASE}/api/pessoas/gerenciar`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ acao: 'DELETE', pessoa_id: id })
        });

        if (!res.ok) throw new Error('Erro ao excluir pessoa');

        const result = await res.json();
        showAlert(result.mensagem || '✅ Pessoa excluída.', 'success', 4000);
        form.remove();
      } catch (err) {
        showAlert(`❌ ${err.message}`, 'error', 4000);
      }
    });

    listaContainer.appendChild(form);
  });
}
