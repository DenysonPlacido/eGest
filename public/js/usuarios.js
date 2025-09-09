document.addEventListener('DOMContentLoaded', () => {
  fetch('header.html').then(res => res.text()).then(html => {
    document.getElementById('header-container').innerHTML = html;
  });
  fetch('menu.html').then(res => res.text()).then(html => {
    document.getElementById('menu-container').innerHTML = html;
  });

  const input = document.getElementById('busca-usuario');
  const tbody = document.getElementById('tabela-usuarios');

  input.addEventListener('input', async () => {
    const login = input.value;
    const res = await fetch('/api/usuarios/gerenciar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ acao: 'SELECT', login })
    });
    const usuarios = await res.json();
    tbody.innerHTML = usuarios.map(u => `
      <tr>
        <td>${u.id}</td>
        <td>${u.login}</td>
        <td>${u.status_usuario}</td>
        <td>${u.tipo_usuario}</td>
      </tr>
    `).join('');
  });
});