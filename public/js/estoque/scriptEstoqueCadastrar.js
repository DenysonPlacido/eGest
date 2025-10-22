const form = document.getElementById('form-cadastrar-estoque');
const msg = document.getElementById('msg-cadastro');

form.addEventListener('submit', async e => {
  e.preventDefault();
  const dados = {
    localizacao: document.getElementById('localizacao').value,
    responsavel_id: document.getElementById('responsavel').value
  };

  try {
    const res = await fetch('/estoque', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(dados)
    });
    const data = await res.json();
    msg.innerText = data.mensagem || JSON.stringify(data);
    form.reset();
  } catch (err) {
    console.error(err);
    msg.innerText = 'Erro ao cadastrar estoque';
  }
});
