const form = document.getElementById('form-movimentar');
const msg = document.getElementById('msg-movimento');

form.addEventListener('submit', async e => {
  e.preventDefault();

  const dados = {
    item_id: parseInt(document.getElementById('item_id').value),
    tipo_movimento: document.getElementById('tipo_movimento').value,
    quantidade_unidade: parseInt(document.getElementById('quantidade_unidade').value),
    quantidade_peso: parseFloat(document.getElementById('quantidade_peso').value)
  };

  try {
    const res = await fetch('/estoque/movimentar', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(dados)
    });

    const data = await res.json();
    msg.innerText = data.mensagem || JSON.stringify(data);
    form.reset();
  } catch (err) {
    console.error(err);
    msg.innerText = 'Erro ao registrar movimentação';
  }
});
