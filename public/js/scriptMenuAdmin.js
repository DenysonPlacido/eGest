// Utilitário para gerar IDs seguros a partir de nomes
export function slugify(text, prefix = '') {
  const base = text
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, '_')
    .replace(/[^\w\-]/g, '')
    .replace(/\_+/g, '_');
  return prefix + base;
}

// Renderiza os menus dinâmicos no DOM
export function renderizarMenus(menus) {
  const menuContainer = document.getElementById('menu-container');
  const ul = document.createElement('ul');
  ul.classList.add('menu');
  ul.id = 'menu-dinamico';

  menus.forEach(menu => {
    const menuId = slugify(menu.nome, 'menu_');
    const li = document.createElement('li');

    const submenuHTML = menu.submenus ? gerarSubmenu(menu.submenus, menuId) : '';
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

// Aplica eventos de clique para expandir/contrair submenus
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

    console.log('🧭 Clique em:', item.textContent.trim());
    console.log('📦 targetId:', targetId);
    console.log('📦 submenu encontrado?', !!submenu);
    console.log('📦 temSubmenu:', temSubmenu, '| temFilhos:', temFilhos);

    // Proteção contra submenu que aponta para si mesmo
    if (submenu === item.parentElement) {
      console.warn('⚠️ submenu aponta para o próprio item. Ignorando.');
      return;
    }

    // Alterna submenu se existir
    if (temSubmenu) {
      submenu.classList.toggle('open');

      // Fecha submenus irmãos
      const parentLi = item.closest('li');
      const parentUl = parentLi?.parentElement;
      const siblingSubmenus = parentUl?.querySelectorAll(':scope > li > .submenu');
      siblingSubmenus?.forEach(sub => {
        if (sub !== submenu) sub.classList.remove('open');
      });

      let parent = submenu.closest('.submenu');
      const visited = new Set();

      while (parent && !visited.has(parent)) {
        visited.add(parent);
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

    // ✅ Só carrega conteúdo se NÃO tiver submenu ou filhos
    if (!temSubmenu || !temFilhos) {
      console.log('🚀 Chamando loadContent para:', targetId);
      loadContent(targetId);
    } else {
      console.log('📂 Item tem submenu. Não carregando conteúdo.');
    }
  });
}

// Simula carregamento de conteúdo no painel principal
function loadContent(target) {
  const content = document.getElementById('main-content');
  if (!content) {
    console.warn('⚠️ Elemento #main-content não encontrado');
    return;
  }

  console.log('🚀 Carregando conteúdo para:', target);

  // Mapeia os targets para arquivos HTML reais
  const pages = {
    dashboard: 'adminHome.html',
    acao_cadastra_pessoa: 'cadastroPessoa.html',
    acao_novo: 'cadastroPessoa.html',
    acao_consulta_pessoa: 'consultaPessoa.html',
    acao_consulta: 'consultaPessoa.html'
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
      })
      .catch(err => {
        console.error('❌ Erro ao carregar página:', err);
        content.innerHTML = `<div class="error-box">Erro ao carregar conteúdo.</div>`;
      });
  } else {
    content.innerHTML = `<div class="welcome-box"><h1>Bem-vindo ao eGest!</h1></div>`;
  }
}

// Gera submenus recursivamente para múltiplos níveis
function gerarSubmenu(submenus, parentPrefix = '') {
  return submenus.map(sub => {
    const subId = slugify(sub.nome, parentPrefix + '_sub_');

    const temSubmenus = sub.submenus?.length > 0;
    const temAcoes = sub.acoes?.length > 0;

    const subSubmenuHTML = temSubmenus ? gerarSubmenu(sub.submenus, subId) : '';
    const acoesHTML = temAcoes
      ? sub.acoes.map(acao => `
          <li>
            <a href="#" class="menu-item" data-target="${slugify(acao.nome, 'acao_')}">
              <i class="fas ${acao.icone || 'fa-angle-right'}"></i> ${acao.nome}
            </a>
          </li>
        `).join('')
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