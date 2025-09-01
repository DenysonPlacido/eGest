// /workspaces/eGest/public/js/main.js
// ===========================
// Carrega o header
// ===========================
fetch('header.html')
  .then(res => res.text())
  .then(html => {
    document.body.insertAdjacentHTML('afterbegin', html);
    initLogout();
  });

// ===========================
// Carrega o menu dinâmico via API
// ===========================
document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');
  if (!token) {
    alert('Sessão expirada. Faça login novamente.');
    window.location.href = 'login.html';
    return;
  }

  fetch('https://e-gest-back-end.vercel.app/api/menus', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  .then(res => res.json())
  .then(menus => renderizarMenus(menus))
  .catch(err => {
    console.error('Erro ao carregar menus:', err);
    alert("Erro ao carregar menus.");
  });
});

// ===========================
// Renderiza menus recebidos da API
// ===========================
function slugify(text) {
  return text
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, '_')
    .replace(/[^\w\-]/g, '')
    .replace(/\_+/g, '_');
}

function renderizarMenus(menus) {
  const menuContainer = document.getElementById('menu-container');
  const ul = document.createElement('ul');
  ul.classList.add('menu');

  menus.forEach(menu => {
    const menuId = slugify(menu.nome);
    const li = document.createElement('li');

    let submenuHTML = menu.submenus.map(sub => {
      const subId = slugify(sub.nome);
      return `
        <li>
          <a href="#" class="menu-item" data-target="${subId}">
            <i class="fas ${sub.icone || 'fa-angle-right'}"></i> ${sub.nome}
          </a>
          <ul class="submenu" id="${subId}">
            ${sub.acoes.map(acao => `
              <li><a href="${acao.caminho}">${acao.nome}</a></li>
            `).join('')}
          </ul>
        </li>
      `;
    }).join('');

    li.innerHTML = `
      <a href="#" class="menu-item" data-target="${menuId}">
        <i class="fas ${menu.icone}"></i> ${menu.nome}
      </a>
      <ul class="submenu" id="${menuId}">
        ${submenuHTML}
      </ul>
    `;

    ul.appendChild(li);
  });

  menuContainer.innerHTML = '';
  menuContainer.appendChild(ul);

  aplicarEventosMenu();
}

// ===========================
// Aplica eventos de clique nos menus
// ===========================
function aplicarEventosMenu() {
  document.querySelectorAll('.menu-item').forEach(item => {
    item.addEventListener('click', function (e) {
      e.preventDefault();
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

  // Troca conteúdo principal
  document.querySelectorAll('.menu-item').forEach(item => {
    item.addEventListener('click', e => {
      e.preventDefault();
      const target = item.dataset.target;
      loadContent(target);
    });
  });
}

// ===========================
// Função para trocar conteúdo
// ===========================
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

// ===========================
// Botão sair
// ===========================
function initLogout() {
  const btnSair = document.getElementById('btn-sair');
  if (btnSair) {
    btnSair.addEventListener('click', () => {
      localStorage.clear();
      window.location.href = 'index.html';
    });
  }
}