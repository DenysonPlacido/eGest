const form = document.getElementById('form-cadastrar-item');
const msg = document.getElementById('msg-cadastro-item');

form.addEventListener('submit', async e => {
  e.preventDefault();

  const dados = {
    estoque_id: parseInt(document.getElementById('estoque_id').value),
    descricao_item: document.getElementById('descricao_item').value,
    tipo_medicao: document.getElementById('tipo_medicao').value,
    peso_unitario: parseFloat(document.getElementById('peso_unitario').value),
    estoque_unidade: parseInt(document.getElementById('estoque_unidade').value),
    estoque_peso: parseFloat(document.getElementById('estoque_peso').value),
    custo_unitario: parseFloat(document.getElementById('custo_unitario').value),
    valor_venda: parseFloat(document.getElementById('valor_venda').value)
  };

  try {
    const res = await fetch(`/estoque/${dados.estoque_id}/itens`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(dados)
    });

    const data = await res.json();
    msg.innerText = data.mensagem || JSON.stringify(data);
    form.reset();
  } catch (err) {
    console.error(err);
    msg.innerText = 'Erro ao cadastrar item';
  }
});
