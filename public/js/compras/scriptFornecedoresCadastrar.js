const formFornecedor = document.getElementById('form-cadastrar-fornecedor');
const msgFornecedor = document.getElementById('msg-cadastro-fornecedor');

formFornecedor.addEventListener('submit', async e => {
  e.preventDefault();

  const dados = {
    empresa_id: parseInt(document.getElementById('empresa_id').value),
    nome_contato: document.getElementById('nome_contato').value,
    telefone: document.getElementById('telefone').value,
    email: document.getElementById('email').value
  };

  try {
    const res = await fetch('/compras/fornecedores', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(dados)
    });

    const data = await res.json();
    msgFornecedor.innerText = data.mensagem || 'Fornecedor cadastrado com sucesso';
    formFornecedor.reset();
  } catch (err) {
    console.error(err);
    msgFornecedor.innerText = 'Erro ao cadastrar fornecedor';
  }
});
