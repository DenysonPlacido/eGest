// /workspaces/eGest/public/js/scriptConsultaUsuario.js
import { showAlert } from './alerts.js';

const API_BASE = 'https://e-gest-back-end.vercel.app/api/usuarios';

let paginaAtual = 1;
const limitePorPagina = 10;
let resultados = [];

const formBusca = document.getElementById('form-busca-usuario');
const btnExportar = document.getElementById('btn-exportar-usuario');
const btnAnterior = document.getElementById('btn-anterior-usuario');
const btnProximo = document.getElementById('btn-proximo-usuario');
const paginaLabel = document.getElementById('pagina-atual-usuario');

formBusca.addEventListener('submit', async (e) => {
    e.preventDefault();
    paginaAtual = 1;
    await buscarUsuarios();
});

btnAnterior.addEventListener('click', async () => {
    if (paginaAtual > 1) {
        paginaAtual--;
        await buscarUsuarios();
    }
});

btnProximo.addEventListener('click', async () => {
    paginaAtual++;
    await buscarUsuarios();
});

btnExportar.addEventListener('click', () => {
    if (!resultados.length) return showAlert('⚠️ Nenhum dado para exportar', 'warning', 4000);

    const cabecalho = [
        'ID', 'Login', 'Nome', 'CPF/CNPJ', 'Status', 'Data Cadastro'
    ];

    const linhas = resultados.map(u =>
        [
            u.id,
            u.login,
            u.nome,
            u.cpf_cnpj,
            u.status_usuario,
            u.data_cadastro ? new Date(u.data_cadastro).toLocaleDateString() : ''
        ].join(';')
    );


    const csv = [cabecalho.join(';'), ...linhas].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'usuarios_filtrados.csv';
    link.click();
});


async function buscarUsuarios() {
    const nome = document.getElementById('busca-nome-usuario').value.trim();
    const login = document.getElementById('busca-login-usuario').value.trim();
    const cpf_cnpj = document.getElementById('busca-cpf_cnpj-usuario').value.trim();

    const query = new URLSearchParams({
        nome: nome || '',
        login: login || '',
        cpf_cnpj: cpf_cnpj || '',
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

        if (!res.ok) throw new Error('Erro ao buscar usuários');

        resultados = await res.json();
        renderizarResultados(resultados);
        paginaLabel.textContent = `Página ${paginaAtual}`;
    } catch (err) {
        showAlert(`❌ ${err.message}`, 'error', 4000);
    }
}

function renderizarResultados(lista) {
    const tbody = document.querySelector('#tabela-usuarios tbody');
    tbody.innerHTML = '';

    if (!lista.length) {
        return showAlert('Nenhum usuário encontrado.', 'warning', 4000);
    }

    lista.forEach(usuario => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
      <td>${usuario.id}</td>
      <td>${usuario.login}</td>
      <td>${usuario.nome || '—'}</td>
      <td>${usuario.cpf_cnpj || '—'}</td> 
      <td>${usuario.status_usuario || '—'}</td>
      <td>${usuario.data_cadastro ? new Date(usuario.data_cadastro).toLocaleDateString() : '—'}</td>
      <td><button class="btn-visualizar" data-id="${usuario.id}">👁️ Visualizar</button></td>
    `;
        tbody.appendChild(tr);

        tr.querySelector('.btn-visualizar').addEventListener('click', () => abrirFormularioEdicao(usuario));
    });
}

function abrirFormularioEdicao(usuario) {
    const form = document.getElementById('form-edicao-usuario');
    document.getElementById('form-edicao-usuario-container').style.display = 'block';

    form.id.value = usuario.id;
    form.login.value = usuario.login || '';
    form.nome.value = usuario.nome || '';
    form.cpf_cnpj.value = usuario.cpf_cnpj || '';
    form.status_usuario.value = usuario.status_usuario || '';
}


document.getElementById('form-edicao-usuario').addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target).entries());

    const token = localStorage.getItem('token');
    const empresaId = localStorage.getItem('empresaId');

    try {
        const res = await fetch(`${API_BASE}/${data.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'x-empresa-id': empresaId
            },
            body: JSON.stringify(data)
        });

        if (!res.ok) throw new Error('Erro ao atualizar usuário');
        const result = await res.json();
        showAlert(result.mensagem || '✅ Usuário atualizado com sucesso!', 'success', 4000);
        document.getElementById('form-edicao-usuario-container').style.display = 'none';
        await buscarUsuarios();
    } catch (err) {
        showAlert(`❌ ${err.message}`, 'error', 4000);
    }
});

document.getElementById('btn-excluir-edicao-usuario').addEventListener('click', async () => {
    const id = document.querySelector('#form-edicao-usuario [name="id"]').value;
    if (!confirm('Tem certeza que deseja excluir este usuário?')) return;

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

        if (!res.ok) throw new Error('Erro ao excluir usuário');
        const result = await res.json();
        showAlert(result.mensagem || '✅ Usuário excluído.', 'success', 4000);
        document.getElementById('form-edicao-usuario-container').style.display = 'none';
        await buscarUsuarios();
    } catch (err) {
        showAlert(`❌ ${err.message}`, 'error', 4000);
    }
});

document.getElementById('btn-cancelar-edicao-usuario').addEventListener('click', () => {
    document.getElementById('form-edicao-usuario-container').style.display = 'none';
});
