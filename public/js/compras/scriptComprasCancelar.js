const formCancelar = document.getElementById('form-cancelar-compra');
const msgCancelar = document.getElementById('msg-cancelar');

formCancelar.addEventListener('submit', async e => {
  e.preventDefault();

  const dados = {
    compra_id: parseInt(document.getElementById('compra_id_cancelar').value),
    observacao: document.getElementById('observacao_cancelar').value
  };

  try {
    const res = await fetch('/compras/cancelar', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(dados)
    });

    const data = await res.json();
    msgCancelar.innerText = data.mensagem || 'Compra cancelada com sucesso';
    formCancelar.reset();
  } catch (err) {
    console.error(err);
    msgCancelar.innerText = 'Erro ao cancelar compra';
  }
});
