// /workspaces/eGest/public/js/main.js

import { renderizarMenus } from './scriptMenuAdmin.js';

document.addEventListener('DOMContentLoaded', () => {
  // Carrega o header
  fetch('header.html')
    .then(res => res.text())
    .then(html => {
      const headerEl = document.getElementById('header-container');
      if (headerEl) {
        headerEl.innerHTML = html;
        initLogout();
        initMenuToggle();
        import('./session.js')
          .catch(err => console.error('Erro ao carregar session.js:', err));
      }
    });

  // Carrega o menu
  fetch('menu.html')
    .then(res => res.text())
    .then(html => {
      const menuEl = document.getElementById('menu-container');
      if (menuEl) {
        menuEl.innerHTML = html;
        carregarMenuDinamico();
      }
    });
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
    .then(res => res.json())
    .then(menus => renderizarMenus(menus))
    .catch(err => {
      console.error('Erro ao carregar menus:', err);
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
  }
}

function initMenuToggle() {
  const toggleBtn = document.getElementById('menu-toggle');
  const sidebar = document.getElementById('menu-container');
  if (toggleBtn && sidebar) {
    toggleBtn.addEventListener('click', () => {
      sidebar.classList.toggle('open');
    });
  }
}