// /workspaces/eGest/public/js/scriptCadastroUsuario.js
import { showAlert } from './alerts.js';

const API_USUARIOS = 'https://e-gest-back-end.vercel.app/api/usuarios';
const API_PESSOAS = 'https://e-gest-back-end.vercel.app/api/pessoas';

document.addEventListener('DOMContentLoaded', async () => {
  await carregarPessoas();

  const form = document.getElementById('cu-form-usuario');
  form.addEventListener('submit', salvarUsuario);
});

async function carregarPessoas() {
  try {
    const token = localStorage.getItem('token');
    const empresaId = localStorage.getItem('empresaId');

        const query = new URLSearchParams({
        cpf_cnpj: cpf_cnpj || '',
        limit: 1,
        offset:0
    }).toString();    

    const res = await fetch(`${API_PESSOAS}?${query}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'x-empresa-id': empresaId
      }
    });

    if (!res.ok) throw new Error('Erro ao buscar pessoas');

    const pessoas = await res.json();
    const selectPessoa = document.getElementById('cpf_cnpj');

    pessoas.forEach(p => {
      const option = document.createElement('option');
      option.value = p.cpf_cnpj;
      option.textContent = `${p.nome} - ${p.cpf_cnpj}`;
      selectPessoa.appendChild(option);
    });

  } catch (err) {
    console.error(err);
    showAlert(`❌ ${err.message}`, 'error', 4000);
  }
}

async function salvarUsuario(e) {
  e.preventDefault();

  const form = e.target;
  const data = {
    pessoa_id: form.pessoa_id.value,
    login: form.login.value,
    senha: form.senha.value,
    status_usuario: form.status_usuario.value,
    tipo_usuario: 1
  };

  if (form.senha.value !== form.confirma_senha.value) {
    return showAlert('⚠️ Senhas não conferem!', 'warning', 4000);
  }

  try {
    const token = localStorage.getItem('token');
    const empresaId = localStorage.getItem('empresaId');

    const res = await fetch(API_USUARIOS, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'x-empresa-id': empresaId
      },
      body: JSON.stringify(data)
    });

    if (!res.ok) {
      const erro = await res.json();
      throw new Error(erro.error || 'Erro ao criar usuário');
    }

    const result = await res.json();
    showAlert(result.mensagem || '✅ Usuário criado com sucesso!', 'success', 4000);
    form.reset();

  } catch (err) {
    console.error(err);
    showAlert(`❌ ${err.message}`, 'error', 4000);
  }
}
