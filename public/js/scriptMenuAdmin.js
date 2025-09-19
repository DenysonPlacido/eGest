// /workspaces/eGest/public/js/scriptMenuAdmin.js
import { showAlert } from './alerts.js';

// Gera um ID seguro para HTML a partir de um caminho de menu
export function gerarTargetHierarquico(caminho) {
  return 'menu_' + caminho.map(p =>
    p.toLowerCase()
     .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
     .replace(/\s+/g, '_')
     .replace(/[^\w\-]/g, '')
     .replace(/\_+/g, '_')
  ).join('_');
}

// Slugify simples para nomes únicos
export function slugify(text, prefix = '') {
  const base = text
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, '_')
    .replace(/[^\w\-]/g, '')
    .replace(/\_+/g, '_');
  return prefix + base;
}

// Renderiza toda a estrutura de menus
export function renderizarMenus(menus) {
  const menuContainer = document.getElementById('menu-container');
  if (!menuContainer) return;

  const ul = document.createElement('ul');
  ul.classList.add('menu');
  ul.id = 'menu-dinamico';

  menus.forEach(menu => {
    const menuId = gerarTargetHierarquico([menu.nome]);
    const li = document.createElement('li');

    const submenuHTML = menu.submenus ? gerarSubmenu(menu.submenus, [menu.nome]) : '';
    const acoesHTML = menu.acoes?.length ? gerarAcoes(menu.acoes, [menu.nome]) : '';

    li.innerHTML = `
      <a href="#" class="menu-item" data-target="${menuId}">
        <i class="fas ${menu.icone || 'fa-angle-right'}"></i> ${menu.nome}
        ${submenuHTML || acoesHTML ? '<span class="arrow-icon"><i class="fas fa-chevron-down"></i></span>' : ''}
      </a>
      <ul class="submenu" id="${menuId}">
        ${submenuHTML}
        ${acoesHTML}
      </ul>
    `;

    ul.appendChild(li);
  });

  const antigo = menuContainer.querySelector('#menu-dinamico');
  if (antigo) antigo.replaceWith(ul);
  else menuContainer.appendChild(ul);

  aplicarEventosMenu();
}

// Gera submenus recursivamente
function gerarSubmenu(submenus, caminhoPai = []) {
  return submenus.map(sub => {
    const caminhoAtual = [...caminhoPai, sub.nome];
    const subId = gerarTargetHierarquico(caminhoAtual);

    const subSubmenuHTML = sub.submenus ? gerarSubmenu(sub.submenus, caminhoAtual) : '';
    const acoesHTML = sub.acoes?.length ? gerarAcoes(sub.acoes, caminhoAtual) : '';

    return `
      <li>
        <a href="#" class="menu-item" data-target="${subId}">
          <i class="fas ${sub.icone || 'fa-angle-right'}"></i> ${sub.nome}
          ${subSubmenuHTML || acoesHTML ? '<span class="arrow-icon"><i class="fas fa-chevron-down"></i></span>' : ''}
        </a>
        <ul class="submenu" id="${subId}">
          ${subSubmenuHTML}
          ${acoesHTML}
        </ul>
      </li>
    `;
  }).join('');
}

// Gera ações dentro de menus/submenus
function gerarAcoes(acoes, caminhoPai = []) {
  return acoes.map(acao => {
    const acaoId = gerarTargetHierarquico([...caminhoPai, 'acao', acao.nome]);
    return `
      <li>
        <a href="#" class="menu-item" data-target="${acaoId}">
          <i class="fas ${acao.icone || 'fa-angle-right'}"></i> ${acao.nome}
        </a>
      </li>
    `;
  }).join('');
}

// Aplica eventos de clique para abrir/fechar menus e carregar conteúdo
export function aplicarEventosMenu() {
  const menu = document.querySelector('.menu');
  if (!menu) return;

  menu.addEventListener('click', e => {
    const item = e.target.closest('.menu-item');
    if (!item) return;

    e.preventDefault();
    const targetId = item.dataset.target;
    const submenu = document.getElementById(targetId);

    if (submenu && submenu.classList.contains('submenu')) {
      submenu.classList.toggle('open');

      // Fecha outros submenus no mesmo nível
      const parentUl = item.closest('ul');
      parentUl?.querySelectorAll(':scope > li > .submenu.open')
        .forEach(s => { if (s !== submenu) s.classList.remove('open'); });

      // Rotaciona ícone da seta
      const arrow = item.querySelector('.arrow-icon');
      if (arrow) arrow.classList.toggle('rotate');
    }

    // Marcar item ativo
    document.querySelectorAll('.menu-item').forEach(i => i.classList.remove('active'));
    item.classList.add('active');

    // Carregar conteúdo se não houver submenu ou submenu vazio
    if (!submenu || !submenu.querySelectorAll('li').length) loadContent(targetId);
  });
}

// Carrega conteúdo HTML no main-content
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
  if (!page) {
    content.innerHTML = `<div class="welcome-box"><h1>Bem-vindo ao eGest!</h1></div>`;
    return;
  }

  fetch(page)
    .then(res => { if (!res.ok) throw new Error(`Erro ao carregar ${page}`); return res.text(); })
    .then(html => {
      content.innerHTML = html;

      // Carrega scripts externos
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = html;
      tempDiv.querySelectorAll('script[src]').forEach(script => {
        const newScript = document.createElement('script');
        newScript.src = script.src;
        document.body.appendChild(newScript);
      });
    })
    .catch(err => {
      console.error(err);
      showAlert(`❌ Erro ao carregar página: ${err.message}`, 'error', 5000);
      content.innerHTML = `<div class="error-box">Erro ao carregar conteúdo.</div>`;
    });
}
