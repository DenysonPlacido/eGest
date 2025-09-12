// /workspaces/eGest/public/js/scriptConsultaPessoa.js

document.addEventListener('DOMContentLoaded', async () => {
  const container = document.getElementById('cp-pessoas-lista');

  const res = await fetch('/api/pessoas/gerenciar', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ acao: 'SELECT' })
  });

  const pessoas = await res.json();

  pessoas.forEach(pessoa => {
    const form = document.createElement('form');
    form.className = 'cp-form-pessoa';
    form.innerHTML = `
      <input type="hidden" name="pessoa_id" value="${pessoa.pessoa_id}" />
      <input type="text" name="nome" value="${pessoa.nome}" placeholder="Nome" />
      <input type="text" name="cpf_cnpj" value="${pessoa.cpf_cnpj}" placeholder="CPF/CNPJ" readonly />
      <input type="email" name="email" value="${pessoa.email}" placeholder="E-mail" />
      <input type="text" name="complemento" value="${pessoa.complemento || ''}" placeholder="Complemento" />
      <input type="text" name="numero" value="${pessoa.numero || ''}" placeholder="Número" />

      <div class="cp-btn-group">
        <button type="submit">Salvar</button>
        <button type="button" class="btn-excluir">Excluir</button>
      </div>
    `;

    // Atualizar pessoa
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(form).entries());
      data.acao = 'UPDATE';

      const res = await fetch('/api/pessoas/gerenciar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const result = await res.json();
      mostrarMensagem(result.mensagem || '✅ Pessoa atualizada com sucesso!');
    });

    // Excluir pessoa
    form.querySelector('.btn-excluir').addEventListener('click', async () => {
      const id = form.pessoa_id.value;
      if (!confirm('Tem certeza que deseja excluir esta pessoa?')) return;

      const res = await fetch('/api/pessoas/gerenciar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ acao: 'DELETE', pessoa_id: id })
      });

      const result = await res.json();
      mostrarMensagem(result.mensagem || '✅ Pessoa excluída.');
      form.remove();
    });

    container.appendChild(form);
  });
});

function mostrarMensagem(msg, tipo = 'sucesso') {
  const box = document.createElement('div');
  box.className = `cp-msg-box ${tipo}`;
  box.textContent = msg;
  document.body.appendChild(box);
  setTimeout(() => box.remove(), 4000);
}