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
      alert('Pessoa cadastrada com sucesso!');
      form.reset();
    } catch (err) {
      console.error('Erro ao cadastrar pessoa:', err);
      alert('Erro ao cadastrar pessoa');
    }
  });
});