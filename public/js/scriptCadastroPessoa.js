///workspaces/eGest/public/js/scriptCadastroPessoa.js

import { showAlert } from './alerts.js';

document.addEventListener('DOMContentLoaded', () => {
  // Busca endereço via CEP
  document.querySelector('input[name="cep"]').addEventListener('blur', async (e) => {
    const cep = e.target.value.replace(/\D/g, '');
    if (cep.length !== 8) return;

    try {
      const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const endereco = await res.json();
      if (endereco.erro) throw new Error('CEP não encontrado');

      document.querySelector('input[name="complemento"]').value = endereco.complemento || '';
    } catch (err) {
      console.warn('Erro ao buscar CEP:', err);
      showAlert('⚠️ CEP inválido ou não encontrado.', 'warning', 4000);
    }
  });

  // Envio do formulário
  const form = document.getElementById('cp-form-pessoa');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    data.acao = 'INSERT';

    // Validação de CPF/CNPJ
    if (!validarCpfCnpj(data.cpf_cnpj)) {
      showAlert('⚠️ CPF ou CNPJ inválido.', 'error', 4000);
      return;
    }

    if (data.senha !== data.repetir_senha) {
      showAlert('⚠️ As senhas não coincidem.', 'error', 4000);
      return;
    }

    // Conversão de campos numéricos
    data.cod_logradouro = parseInt(data.cod_logradouro) || null;
    data.cod_bairro = parseInt(data.cod_bairro) || null;
    data.numero = parseInt(data.numero) || null;

    try {
      const res = await fetch('/api/pessoas/gerenciar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const result = await res.json();
      if (result.status === 'OK') {
        const msg = result.mensagem || '✅ Pessoa cadastrada com sucesso!';
        showAlert(msg, 'success', 5000);
        form.reset();
      } else {
        const msg = result.mensagem || '⚠️ Erro ao cadastrar pessoa.';
        showAlert(msg, 'error', 5000);
      }
    } catch (err) {
      console.error('Erro ao cadastrar pessoa:', err);
      showAlert(`❌ ${err.message || 'Erro interno ao cadastrar pessoa.'}`, 'error', 5000);
    }
  });
});

// Validação de CPF/CNPJ
function validarCpfCnpj(valor) {
  const v = valor.replace(/\D/g, '');
  if (v.length === 11) return validarCPF(v);
  if (v.length === 14) return validarCNPJ(v);
  return false;
}

function validarCPF(cpf) {
  let soma = 0, resto;
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;
  for (let i = 1; i <= 9; i++) soma += parseInt(cpf[i - 1]) * (11 - i);
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf[9])) return false;
  soma = 0;
  for (let i = 1; i <= 10; i++) soma += parseInt(cpf[i - 1]) * (12 - i);
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  return resto === parseInt(cpf[10]);
}

function validarCNPJ(cnpj) {
  let tamanho = cnpj.length - 2;
  let numeros = cnpj.substring(0, tamanho);
  let digitos = cnpj.substring(tamanho);
  let soma = 0, pos = tamanho - 7;
  for (let i = tamanho; i >= 1; i--) {
    soma += numeros.charAt(tamanho - i) * pos--;
    if (pos < 2) pos = 9;
  }
  let resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
  if (resultado !== parseInt(digitos.charAt(0))) return false;
  tamanho += 1;
  numeros = cnpj.substring(0, tamanho);
  soma = 0;
  pos = tamanho - 7;
  for (let i = tamanho; i >= 1; i--) {
    soma += numeros.charAt(tamanho - i) * pos--;
    if (pos < 2) pos = 9;
  }
  resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
  return resultado === parseInt(digitos.charAt(1));
}

// Botão de busca de endereço
document.getElementById('btn-buscar-endereco').addEventListener('click', async () => {
  const cep = document.querySelector('input[name="cep"]').value.replace(/\D/g, '');
  if (cep.length !== 8) {
    showAlert('⚠️ CEP inválido.', 'warning', 4000);
    return;
  }

  try {
    const res = await fetch(`/api/enderecos/buscar?cep=${cep}`);
    const endereco = await res.json();

    if (!endereco || !endereco.cod_logradouro || !endereco.cod_bairro) {
      throw new Error('Endereço não encontrado');
    }

    document.querySelector('input[name="logradouro"]').value = endereco.logradouro;
    document.querySelector('input[name="bairro"]').value = endereco.bairro;
    document.querySelector('input[name="cod_logradouro"]').value = endereco.cod_logradouro;
    document.querySelector('input[name="cod_bairro"]').value = endereco.cod_bairro;

    showAlert('✅ Endereço carregado com sucesso!', 'success', 5000);
  } catch (err) {
    console.error('Erro ao buscar endereço:', err);
    showAlert('❌ Endereço não encontrado.', 'error', 5000);
  }
});
