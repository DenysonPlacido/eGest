

// Utilitário para gerar IDs seguros a partir de nomes
export function slugify(text) {
  return text
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, '_')
    .replace(/[^\w\-]/g, '')
    .replace(/\_+/g, '_');
}

// Renderiza os menus dinâmicos no DOM
export function renderizarMenus(menus) {
  const menuContainer = document.getElementById('menu-container');
  const ul = document.createElement('ul');
  ul.classList.add('menu');
  ul.id = 'menu-dinamico';

  menus.forEach(menu => {
    const menuId = slugify(menu.nome);
    const li = document.createElement('li');

    const submenuHTML = menu.submenus ? gerarSubmenu(menu.submenus) : '';
    const acoesHTML = menu.acoes?.length
      ? menu.acoes.map(acao => `
          <li>
            <a href="${acao.caminho}">
              <i class="fas ${acao.icone || 'fa-angle-right'}"></i> ${acao.nome}
            </a>
          </li>
        `).join('')
      : '';

    li.innerHTML = `
      <a href="#" class="menu-item" data-target="${menuId}">
        <i class="fas ${menu.icone}"></i> ${menu.nome}
        <span class="arrow-icon"><i class="fas fa-chevron-down"></i></span>
      </a>
      <ul class="submenu" id="${menuId}">
        ${submenuHTML}
        ${acoesHTML}
      </ul>
    `;

    ul.appendChild(li);
  });

  const antigo = menuContainer.querySelector('#menu-dinamico');
  if (antigo) {
    antigo.replaceWith(ul);
  } else {
    menuContainer.appendChild(ul);
  }

  aplicarEventosMenu();
}

export function aplicarEventosMenu() {
  const menu = document.querySelector('.menu');
  if (!menu) return;

  menu.addEventListener('click', function (e) {
    const item = e.target.closest('.menu-item');
    if (!item) return;

    e.preventDefault();

    const targetId = item.dataset.target;
    const submenu = document.getElementById(targetId);

    // Verifica se o item tem submenu
    const temSubmenu = submenu && submenu.classList.contains('submenu');

    // Fecha submenus irmãos no mesmo nível
    const parentLi = item.closest('li');
    const parentUl = parentLi?.parentElement;
    const siblingSubmenus = parentUl?.querySelectorAll(':scope > li > .submenu');
    siblingSubmenus?.forEach(sub => {
      if (sub !== submenu) sub.classList.remove('open');
    });

    // Alterna submenu atual
    if (temSubmenu) {
      submenu.classList.toggle('open');

      // Abre todos os pais (nível 3+)
      let parent = submenu.closest('.submenu');
      while (parent) {
        parent.classList.add('open');
        parent = parent.closest('.submenu');
      }

      // Ícones de seta
      document.querySelectorAll('.arrow-icon').forEach(icon => icon.classList.remove('rotate'));
      const arrow = item.querySelector('.arrow-icon');
      if (arrow) arrow.classList.toggle('rotate');
    }

    // Ativa item clicado
    document.querySelectorAll('.menu-item').forEach(i => i.classList.remove('active'));
    item.classList.add('active');

    // ✅ Só carrega conteúdo se não houver submenu (ou seja, é uma ação final)
    if (!temSubmenu) {
      loadContent(targetId);
    }
  });
}

// Simula carregamento de conteúdo no painel principal
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

// Gera submenus recursivamente para múltiplos níveis
function gerarSubmenu(submenus) {
  return submenus.map(sub => {
    const subId = slugify(sub.nome);
    const temSubmenus = sub.submenus?.length > 0;
    const temAcoes = sub.acoes?.length > 0;

    const subSubmenuHTML = temSubmenus ? gerarSubmenu(sub.submenus) : '';
    const acoesHTML = temAcoes
      ? sub.acoes.map(acao => `<li><a href="${acao.caminho}">${acao.nome}</a></li>`).join('')
      : '';

    return `
      <li>
        <a href="#" class="menu-item" data-target="${subId}">
          <i class="fas ${sub.icone || 'fa-angle-right'}"></i> ${sub.nome}
          <span class="arrow-icon"><i class="fas fa-chevron-down"></i></span>
        </a>
        <ul class="submenu" id="${subId}">
          ${subSubmenuHTML}
          ${acoesHTML}
        </ul>
      </li>
    `;
  }).join('');
}