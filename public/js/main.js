// /public/js/main.js

// carrega menu dinamicamente
fetch('menu.html')
  .then(res => res.text())
  .then(html => {
    document.getElementById('menu-container').innerHTML = html;

    // evento para trocar conteúdo principal
    document.querySelectorAll('.menu-item').forEach(item => {
      item.addEventListener('click', e => {
        e.preventDefault();
        const target = item.dataset.target;
        loadContent(target);
      });
    });

    // evento para abrir/fechar submenus
    document.querySelectorAll('.menu-item').forEach(item => {
      item.addEventListener('click', function (e) {
        const targetId = this.dataset.target;
        const submenu = document.getElementById(targetId);
        if (!submenu) return;

        const isOpen = submenu.style.maxHeight && submenu.style.maxHeight !== "0px";

        // fecha submenus irmãos no mesmo nível
        const siblings = this.closest('li')?.parentElement?.querySelectorAll('.submenu');
        siblings?.forEach(sib => {
          if (sib !== submenu) sib.style.maxHeight = null;
        });

        // alterna submenu clicado
        submenu.style.maxHeight = isOpen ? null : submenu.scrollHeight + "px";
      });
    });
  });

// função para trocar conteúdo
function loadContent(target) {
  const content = document.getElementById('main-content');

  switch (target) {
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
  localStorage.clear();
  window.location.href = 'index.html';
});
