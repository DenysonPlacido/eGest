// Carrega o header
fetch('header.html')
  .then(res => res.text())
  .then(html => {
    document.body.insertAdjacentHTML('afterbegin', html);
    initLogout();
  });

// Carrega o menu
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
      item.addEventListener('click', function () {
        const targetId = this.dataset.target;
        const submenu = document.getElementById(targetId);
        if (!submenu) return;

        const isOpen = submenu.style.maxHeight && submenu.style.maxHeight !== "0px";
        const siblings = this.closest('li')?.parentElement?.querySelectorAll('.submenu');
        siblings?.forEach(sib => {
          if (sib !== submenu) sib.style.maxHeight = null;
        });
        submenu.style.maxHeight = isOpen ? null : submenu.scrollHeight + "px";
      });
    });
  });

// Função para trocar conteúdo
function loadContent(target) {
  const content = document.getElementById('main-content');
  switch (target) {
    case 'dashboard':
      content.innerHTML = `<div class="welcome-box"><h1>Dashboard</h1><p>Resumo do sistema.</p></div>`;
      break;
    default:
      content.innerHTML = `<div class="welcome-box"><h1>Bem-vindo ao eGest!</h1></div>`;
  }
}

// Botão sair
function initLogout() {
  const btnSair = document.getElementById('btn-sair');
  if (btnSair) {
    btnSair.addEventListener('click', () => {
      localStorage.clear();
      window.location.href = 'index.html';
    });
  }
}
