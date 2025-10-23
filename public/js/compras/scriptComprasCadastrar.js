//public\js\compras\scriptComprasCadastrar.js


const form = document.getElementById('form-cadastrar-compra');
const msg = document.getElementById('msg-cadastro-compra');

form.addEventListener('submit', async e => {
  e.preventDefault();

  const dados = {
    fornecedor_id: parseInt(document.getElementById('fornecedor_id').value),
    observacao: document.getElementById('observacao').value
  };

  try {
    const res = await fetch('/compras', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(dados)
    });

    const data = await res.json();
    msg.innerText = data.mensagem || JSON.stringify(data);
    form.reset();
  } catch (err) {
    console.error(err);
    msg.innerText = 'Erro ao criar compra';
  }
});
