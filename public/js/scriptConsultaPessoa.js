// /workspaces/eGest/public/js/scriptConsultaPessoa.js
let todasPessoas = [];

(async () => {
  const container = document.getElementById('cp-pessoas-lista');
  const filtroInput = document.getElementById('filtro-nome');
  const btnExportar = document.getElementById('btn-exportar');

  if (!container) return;

  const res = await fetch('/api/pessoas/gerenciar', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ acao: 'SELECT' })
  });

  todasPessoas = await res.json();
  renderizarPessoas(todasPessoas);

  filtroInput.addEventListener('input', () => {
    const termo = filtroInput.value.toLowerCase();
    const filtradas = todasPessoas.filter(p =>
      p.nome.toLowerCase().includes(termo)
    );
    renderizarPessoas(filtradas);
  });

  btnExportar.addEventListener('click', () => {
    const linhas = todasPessoas.map(p =>
      `${p.pessoa_id};${p.nome};${p.cpf_cnpj};${p.email};${p.numero};${p.complemento}`
    );
    const csv = ['ID;Nome;CPF/CNPJ;Email;Número;Complemento', ...linhas].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'pessoas.csv';
    link.click();
  });
})();

function renderizarPessoas(lista) {
  const container = document.getElementById('cp-pessoas-lista');
  container.innerHTML = '';

  lista.forEach(pessoa => {
    const form = document.createElement('form');
    form.className = 'cp-form-pessoa';

    form.innerHTML = `
      <input type="hidden" name="pessoa_id" value="${pessoa.pessoa_id}" />
      <input type="text" name="nome" value="${pessoa.nome}" placeholder="Nome" disabled />
      <input type="text" name="cpf_cnpj" value="${pessoa.cpf_cnpj}" placeholder="CPF/CNPJ" disabled />
      <input type="email" name="email" value="${pessoa.email}" placeholder="E-mail" disabled />
      <input type="text" name="complemento" value="${pessoa.complemento || ''}" placeholder="Complemento" disabled />
      <input type="text" name="numero" value="${pessoa.numero || ''}" placeholder="Número" disabled />

      <div class="cp-btn-group">
        <button type="button" class="btn-editar">Editar</button>
        <button type="submit" disabled>Salvar</button>
        <button type="button" class="btn-excluir">Excluir</button>
      </div>
    `;

    form.querySelector('.btn-editar').addEventListener('click', () => {
      form.querySelectorAll('input:not([type="hidden"]):not([name="cpf_cnpj"])').forEach(input => {
        input.disabled = false;
      });
      form.querySelector('button[type="submit"]').disabled = false;
    });

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
}

function mostrarMensagem(msg, tipo = 'sucesso') {
  const box = document.createElement('div');
  box.className = `cp-msg-box ${tipo}`;
  box.textContent = msg;
  document.body.appendChild(box);
  setTimeout(() => box.remove(), 4000);
}