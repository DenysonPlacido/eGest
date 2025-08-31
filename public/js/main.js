// carrega menu dinamicamente
fetch('menu.html')
  .then(res => res.text())
  .then(html => {
    document.getElementById('menu-container').innerHTML = html;

    // adiciona evento para cada item de menu
    document.querySelectorAll('.menu-item').forEach(item => {
      item.addEventListener('click', e => {
        e.preventDefault();
        const target = item.dataset.target;
        loadContent(target);
      });
    });
  });

// função para trocar conteúdo
function loadContent(target) {
  const content = document.getElementById('main-content');

  switch(target) {
    case 'dashboard':
      content.innerHTML = `
        <div class="welcome-box">
          <h1>Dashboard</h1>
          <p>Aqui você vê um resumo das informações do sistema.</p>
        </div>`;
      break;
    case 'cadastros':
      content.innerHTML = `<div class="welcome-box"><h1>Cadastros</h1><p>Gerencie seus cadastros aqui.</p></div>`;
      break;
    case 'financeiro':
      content.innerHTML = `<div class="welcome-box"><h1>Gestão Financeira</h1><p>Veja informações financeiras.</p></div>`;
      break;
    default:
      content.innerHTML = `<div class="welcome-box"><h1>Bem-vindo ao eGest!</h1></div>`;
  }
}

// botão sair
document.getElementById('btn-sair').addEventListener('click', () => {
  // limpa session/localStorage e redireciona
  localStorage.clear();
  window.location.href = 'index.html';
});
