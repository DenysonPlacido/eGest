import { aplicarEventosMenu, renderizarMenus } from './scriptMenuAdmin.js';

document.addEventListener('DOMContentLoaded', () => {
  fetch('header.html')
    .then(res => res.text())
    .then(html => {
      document.getElementById('header-container').innerHTML = html;
      initLogout();
      initMenuToggle();
      import('./session.js');
    });

  fetch('menu.html')
    .then(res => res.text())
    .then(html => {
      document.getElementById('menu-container').innerHTML = html;
      carregarMenuDinamico();
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