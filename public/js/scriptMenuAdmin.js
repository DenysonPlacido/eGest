
//workspaces/eGest/public/js/scriptMenuAdmin.js
import { showAlert } from './alerts.js';

export function gerarTargetHierarquico(caminho) {
  return 'menu_' + caminho.map(p =>
    p.toLowerCase()
     .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
     .replace(/\s+/g, '_')
     .replace(/[^\w\-]/g, '')
     .replace(/\_+/g, '_')
  ).join('_');
}

export function slugify(text, prefix = '') {
  const base = text
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, '_')
    .replace(/[^\w\-]/g, '')
    .replace(/\_+/g, '_');
  return prefix + base;
}

export function renderizarMenus(menus) {
  const menuContainer = document.getElementById('menu-container');
  const ul = document.createElement('ul');
  ul.classList.add('menu');
  ul.id = 'menu-dinamico';

  menus.forEach(menu => {
    const menuId = slugify(menu.nome, 'menu_');
    const li = document.createElement('li');

    const submenuHTML = menu.submenus ? gerarSubmenu(menu.submenus, [menu.nome]) : '';
    const acoesHTML = menu.acoes?.length
      ? menu.acoes.map(acao => `
          <li>
            <a href="#" class="menu-item" data-target="${slugify(acao.nome, 'acao_')}">
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

    const temSubmenu = submenu && submenu.classList.contains('submenu');
    const temFilhos = submenu && submenu.querySelectorAll('li').length > 0;

    // Proteção contra submenu que aponta para si mesmo
    if (submenu === item.parentElement) return;

    if (temSubmenu) {
      submenu.classList.toggle('open');
      const parentLi = item.closest('li');
      const parentUl = parentLi?.parentElement;
      const siblingSubmenus = parentUl?.querySelectorAll(':scope > li > .submenu');
      siblingSubmenus?.forEach(sub => { if (sub !== submenu) sub.classList.remove('open'); });

      let parent = submenu.closest('.submenu');
      const visited = new Set();
      while (parent && !visited.has(parent)) {
        visited.add(parent);
        parent.classList.add('open');
        parent = parent.closest('.submenu');
      }

      document.querySelectorAll('.arrow-icon').forEach(icon => icon.classList.remove('rotate'));
      const arrow = item.querySelector('.arrow-icon');
      if (arrow) arrow.classList.toggle('rotate');
    }

    document.querySelectorAll('.menu-item').forEach(i => i.classList.remove('active'));
    item.classList.add('active');

    if (!temSubmenu || !temFilhos) {
      loadContent(targetId);
    }
  });
}

function loadContent(target) {
  const content = document.getElementById('main-content');
  if (!content) {
    showAlert('⚠️ Elemento #main-content não encontrado', 'warning', 4000);
    return;
  }

  const pages = {
    dashboard: 'adminHome.html',
    menu_cadastro_do_sistema_pessoas_acao_novo: 'cadastroPessoa.html',
    menu_cadastro_do_sistema_pessoas_acao_consulta: 'consultaPessoa.html'
  };

  const page = pages[target];

  if (page) {
    fetch(page)
      .then(res => {
        if (!res.ok) throw new Error(`Erro ao carregar ${page}`);
        return res.text();
      })
      .then(html => {
        content.innerHTML = html;

        // Carrega scripts externos
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;
        const scripts = tempDiv.querySelectorAll('script[src]');
        scripts.forEach(script => {
          const newScript = document.createElement('script');
          newScript.src = script.src;
          newScript.type = script.type || 'text/javascript';
          document.body.appendChild(newScript);
        });
      })
      .catch(err => {
        console.error(err);
        showAlert(`❌ Erro ao carregar página: ${err.message}`, 'error', 5000);
        content.innerHTML = `<div class="error-box">Erro ao carregar conteúdo.</div>`;
      });
  } else {
    content.innerHTML = `<div class="welcome-box"><h1>Bem-vindo ao eGest!</h1></div>`;
  }
}

function gerarSubmenu(submenus, caminhoPai = []) {
  return submenus.map(sub => {
    const caminhoAtual = [...caminhoPai, sub.nome];
    const subId = gerarTargetHierarquico(caminhoAtual);

    const temSubmenus = sub.submenus?.length > 0;
    const temAcoes = sub.acoes?.length > 0;

    const subSubmenuHTML = temSubmenus ? gerarSubmenu(sub.submenus, caminhoAtual) : '';
    const acoesHTML = temAcoes
      ? sub.acoes.map(acao => {
          const caminhoAcao = [...caminhoAtual, 'acao', acao.nome];
          const acaoId = gerarTargetHierarquico(caminhoAcao);
          return `
            <li>
              <a href="#" class="menu-item" data-target="${acaoId}">
                <i class="fas ${acao.icone || 'fa-angle-right'}"></i> ${acao.nome}
              </a>
            </li>
          `;
        }).join('')
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
