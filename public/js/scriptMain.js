// /workspaces/eGest/public/js/scriptMain.js

import { renderizarMenus } from './scriptMenuAdmin.js';
import { showAlert } from './alerts.js';

document.addEventListener('DOMContentLoaded', () => {
  console.log('🔄 DOM carregado. Iniciando fetch dos componentes...');
  carregarHeader();
  carregarMenu();
});

// ===========================
// Carrega o header.html
// ===========================
function carregarHeader() {
  fetch('header.html')
    .then(res => {
      if (!res.ok) throw new Error('Erro ao buscar header.html');
      return res.text();
    })
    .then(html => {
      const headerEl = document.getElementById('header-container');
      if (!headerEl) throw new Error('Elemento #header-container não encontrado');

      headerEl.innerHTML = html;
      console.log('✅ Header carregado com sucesso');

      // Executa após o HTML ser inserido
      requestAnimationFrame(async () => {
        const toggleBtn = document.getElementById('menu-toggle');
        const sidebar = document.querySelector('.sidebar');

        if (toggleBtn && sidebar) initMenuToggle();
        initLogout();

        // Importa themeSwitcher.js e executa a função
        try {
          const themeModule = await import('./themeSwitcher.js');
          themeModule.initThemeSwitcher();
          console.log('✅ themeSwitcher.js inicializado');
        } catch (err) {
          console.error('❌ Erro ao carregar themeSwitcher.js:', err);
        }

        // Importa scriptSession.js
        try {
          await import('./scriptSession.js');
          console.log('✅ scriptSession.js carregado');
        } catch (err) {
          console.error('❌ Erro ao carregar scriptSession.js:', err);
        }
      });
    })
    .catch(err => console.error('❌ Falha ao carregar header:', err));
}
// ===========================
// Carrega o menu.html
// ===========================
function carregarMenu() {
  fetch('menu.html')
    .then(res => {
      if (!res.ok) throw new Error('Erro ao buscar menu.html');
      return res.text();
    })
    .then(html => {
      const menuEl = document.getElementById('menu-container');
      if (!menuEl) throw new Error('Elemento #menu-container não encontrado');

      menuEl.innerHTML = html;
      console.log('✅ Menu carregado com sucesso');

      carregarMenuDinamico();
    })
    .catch(err => console.error('❌ Falha ao carregar menu:', err));
}

// ===========================
// Carrega menus dinâmicos da API
// ===========================
function carregarMenuDinamico() {
  const token = localStorage.getItem('token');
  const empresaId = localStorage.getItem('empresaId');

  if (!token || !empresaId) {
    showAlert('⚠️ Sessão expirada ou empresa não informada. Faça login novamente.', 'warning');
    window.location.href = 'index.html';
    return;
  }

  console.log("🔐 Token:", token);
  console.log("🏢 Empresa ID:", empresaId);
  console.log("📡 Enviando requisição para /menus...");

  fetch('https://e-gest-back-end.vercel.app/api/menus', {
    headers: {
      Authorization: `Bearer ${token}`,
      'x-empresa-id': empresaId
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
      showAlert('❌ Erro ao carregar menus. Faça login novamente.', 'error');
      window.location.href = 'index.html';
    });
}

// ===========================
// Botão de logout
// ===========================
function initLogout() {
  const btnSair = document.getElementById('btn-sair');
  if (!btnSair) {
    console.warn('⚠️ Botão de logout não encontrado');
    return;
  }

  btnSair.addEventListener('click', () => {
    localStorage.clear();
    window.location.href = 'index.html';
  });
}

// ===========================
// Toggle do menu lateral
// ===========================
function initMenuToggle() {
  const toggleBtn = document.getElementById('menu-toggle');
  const sidebar = document.querySelector('.sidebar');

  if (!toggleBtn || !sidebar) {
    console.warn('⚠️ Toggle do menu ou sidebar não encontrado');
    return;
  }

  toggleBtn.addEventListener('click', () => {
    sidebar.classList.toggle('open');
  });
}
