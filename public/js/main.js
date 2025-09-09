import { renderizarMenus } from './scriptMenuAdmin.js';

document.addEventListener('DOMContentLoaded', () => {
  console.log('🔄 DOM carregado. Iniciando fetch dos componentes...');

  // Carrega o header
  fetch('header.html')
    .then(res => {
      if (!res.ok) throw new Error('Erro ao buscar header.html');
      return res.text();
    })
    .then(html => {
      const headerEl = document.getElementById('header-container');
      if (headerEl) {
        headerEl.innerHTML = html;
        console.log('✅ Header carregado com sucesso');
        initLogout();
        initMenuToggle();
        import('./session.js')
          .then(() => console.log('✅ session.js carregado'))
          .catch(err => console.error('❌ Erro ao carregar session.js:', err));
      } else {
        console.error('❌ Elemento #header-container não encontrado');
      }
    })
    .catch(err => console.error('❌ Falha ao carregar header:', err));

  // Carrega o menu
  fetch('menu.html')
    .then(res => {
      if (!res.ok) throw new Error('Erro ao buscar menu.html');
      return res.text();
    })
    .then(html => {
      const menuEl = document.getElementById('menu-container');
      if (menuEl) {
        menuEl.innerHTML = html;
        console.log('✅ Menu carregado com sucesso');
        carregarMenuDinamico();
      } else {
        console.error('❌ Elemento #menu-container não encontrado');
      }
    })
    .catch(err => console.error('❌ Falha ao carregar menu:', err));
});

function carregarMenuDinamico() {
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
    .then(res => {
      if (!res.ok) throw new Error('Erro ao buscar menus da API');
      return res.json();
    })
    .then(menus => {
      console.log('✅ Menus recebidos da API:', menus);
      renderizarMenus(menus);
    })
    .catch(err => {
      console.error('❌ Erro ao carregar menus:', err);
      alert("Erro ao carregar menus.");
    });
}

function initLogout() {
  const btnSair = document.getElementById('btn-sair');
  if (btnSair) {
    btnSair.addEventListener('click', () => {
      localStorage.clear();
      window.location.href = 'index.html';
    });
  } else {
    console.warn('⚠️ Botão de logout não encontrado');
  }
}

function initMenuToggle() {
  const toggleBtn = document.getElementById('menu-toggle');
  const sidebar = document.querySelector('.sidebar');
  if (toggleBtn && sidebar) {
    toggleBtn.addEventListener('click', () => {
      sidebar.classList.toggle('open');
    });
  } else {
    console.warn('⚠️ Toggle do menu ou sidebar não encontrado');
  }
}