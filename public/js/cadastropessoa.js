


document.addEventListener('DOMContentLoaded', () => {
  // Carrega header e menu
  fetch('header.html').then(res => res.text()).then(html => {
    document.getElementById('header-container').innerHTML = html;
  });
  fetch('menu.html').then(res => res.text()).then(html => {
    document.getElementById('menu-container').innerHTML = html;
  });

  // Envio do formulário
  const form = document.getElementById('form-pessoa');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    data.acao = 'INSERT';

    try {
      const res = await fetch('/api/pessoas/gerenciar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const result = await res.json();
      if (result.status === 'OK') {
        alert('✅ Pessoa cadastrada com sucesso!');
        form.reset();
      } else {
        alert('⚠️ Erro ao cadastrar pessoa.');
      }
    } catch (err) {
      console.error('Erro ao cadastrar pessoa:', err);
      alert('❌ Erro interno ao cadastrar pessoa.');
    }
  });
});


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



if (!validarCpfCnpj(data.cpf_cnpj)) {
  alert('⚠️ CPF ou CNPJ inválido.');
  return;
}



document.querySelector('input[name="cep"]').addEventListener('blur', async (e) => {
  const cep = e.target.value.replace(/\D/g, '');
  if (cep.length !== 8) return;

  try {
    const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    const endereco = await res.json();
    if (endereco.erro) throw new Error('CEP não encontrado');

    document.querySelector('input[name="complemento"]').value = endereco.complemento || '';
    // Se quiser preencher outros campos, adapte aqui
  } catch (err) {
    console.warn('Erro ao buscar CEP:', err);
    alert('⚠️ CEP inválido ou não encontrado.');
  }
});


function mostrarMensagem(msg, tipo = 'sucesso') {
  const box = document.createElement('div');
  box.className = `msg-box ${tipo}`;
  box.textContent = msg;
  document.body.appendChild(box);
  setTimeout(() => box.remove(), 4000);
}



mostrarMensagem('Pessoa cadastrada com sucesso!');