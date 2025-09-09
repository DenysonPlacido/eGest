// /workspaces/eGest/public/js/scriptMenuAdmin.js

export function slugify(text) {
  return text
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, '_')
    .replace(/[^\w\-]/g, '')
    .replace(/\_+/g, '_');
}

export function renderizarMenus(menus) {
  const menuContainer = document.getElementById('menu-container');
  const submenuHTML = menu.submenus ? gerarSubmenu(menu.submenus) : '';
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
            <span class="arrow-icon"><i class="fas fa-chevron-down"></i></span>
          </a>
          <ul class="submenu" id="${subId}">
            ${sub.acoes.map(acao => `
              <li><a href="${acao.caminho}">${acao.nome}</a></li>
            `).join('')}
          </ul>
        </li>
      `;
    }).join('');



    
    export function renderizarMenus(menus) {
  const menuContainer = document.getElementById('menu-container');
  const ul = document.createElement('ul');
  ul.classList.add('menu');

  menus.forEach(menu => {
    const menuId = slugify(menu.nome);
    const li = document.createElement('li');

    const submenuHTML = menu.submenus ? gerarSubmenu(menu.submenus) : '';

    let acoesHTML = '';
    if (menu.acoes && menu.acoes.length > 0) {
      acoesHTML = menu.acoes.map(acao => `
        <li>
          <a href="${acao.caminho}">
            <i class="fas ${acao.icone || 'fa-angle-right'}"></i> ${acao.nome}
          </a>
        </li>
      `).join('');
    }

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

  menuContainer.querySelector('#menu-dinamico').replaceWith(ul);
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
    if (!submenu) return;

    // Fecha submenus irmãos no mesmo nível
    const parentLi = item.closest('li');
    const parentUl = parentLi?.parentElement;
    const siblingSubmenus = parentUl?.querySelectorAll(':scope > li > .submenu');
    siblingSubmenus?.forEach(sub => {
      if (sub !== submenu) sub.classList.remove('open');
    });

    // Alterna submenu atual
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

    // Ativa item clicado
    document.querySelectorAll('.menu-item').forEach(i => i.classList.remove('active'));
    item.classList.add('active');

    loadContent(targetId);
  });
}

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


function gerarSubmenu(submenus) {
  return submenus.map(sub => {
    const subId = slugify(sub.nome);
    const temSubmenus = sub.submenus && sub.submenus.length > 0;
    const temAcoes = sub.acoes && sub.acoes.length > 0;

    let subSubmenuHTML = '';
    if (temSubmenus) {
      subSubmenuHTML = gerarSubmenu(sub.submenus);
    }

    let acoesHTML = '';
    if (temAcoes) {
      acoesHTML = sub.acoes.map(acao => `
        <li><a href="${acao.caminho}">${acao.nome}</a></li>
      `).join('');
    }

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