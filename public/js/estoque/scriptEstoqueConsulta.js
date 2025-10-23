
import { showAlert } from './alerts.js';


const API_BASE = 'https://e-gest-back-end.vercel.app/estoque';

const tabela = document.querySelector('#tabela-estoques tbody');
const formBusca = document.getElementById('form-busca');

formBusca.addEventListener('submit', e => {
  e.preventDefault();
  const filtro = {};
  const id = document.getElementById('busca-id').value.trim();
  const localizacao = document.getElementById('busca-localizacao').value.trim();
  if (id) filtro.id = id;
  if (localizacao) filtro.localizacao = localizacao;
  carregarEstoques(filtro);
});

async function carregarEstoques(filtro = {}) {
  const token = localStorage.getItem('token');
  const empresaId = localStorage.getItem('empresaId');

  try {
    const query = new URLSearchParams(filtro).toString();
    const res = await fetch(`${API_BASE}?${query}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'x-empresa-id': empresaId
      }
    });

    if (!res.ok) throw new Error('Erro ao buscar estoques');

    const dados = await res.json();
    tabela.innerHTML = '';

    if (!dados.length) {
      tabela.innerHTML = `<tr><td colspan="6">Nenhum estoque encontrado.</td></tr>`;
      return;
    }

    dados.forEach(e => {
      tabela.innerHTML += `<tr>
        <td>${e.estoque_id}</td>
        <td>${e.localizacao}</td>
        <td>${e.responsavel_nome || '-'}</td>
        <td>${new Date(e.data_inclusao).toLocaleString()}</td>
        <td>${e.ativo ? 'Sim' : 'Não'}</td>
        <td><button class="btn-ver" data-id="${e.estoque_id}">👁️</button></td>
      </tr>`;
    });
  } catch (err) {
    console.error('❌ Erro ao carregar estoques:', err);
    alert(`Erro: ${err.message}`);
  }
}

carregarEstoques();