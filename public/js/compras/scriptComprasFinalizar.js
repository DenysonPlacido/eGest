const formFinalizar = document.getElementById('form-finalizar-compra');
const msgFinalizar = document.getElementById('msg-finalizar');

formFinalizar.addEventListener('submit', async e => {
  e.preventDefault();

  const dados = {
    compra_id: parseInt(document.getElementById('compra_id').value),
    observacao: document.getElementById('observacao_finalizar').value
  };

  try {
    const res = await fetch('/compras/finalizar', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(dados)
    });

    const data = await res.json();
    msgFinalizar.innerText = data.mensagem || 'Compra finalizada com sucesso';
    formFinalizar.reset();
  } catch (err) {
    console.error(err);
    msgFinalizar.innerText = 'Erro ao finalizar compra';
  }
});
