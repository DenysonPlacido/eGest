// /workspaces/eGest/public/js/scriptMenuAdmin.js

export function aplicarEventosMenu() {
  const menuItems = document.querySelectorAll('.menu-item');

  menuItems.forEach(item => {
    item.addEventListener('click', function (e) {
      e.preventDefault();

      const targetId = this.dataset.target;
      const submenu = document.getElementById(targetId);
      if (!submenu) return;

      const isOpen = submenu.classList.contains('open');

      // Fecha todos os submenus visíveis no mesmo nível
      const parentUl = this.closest('ul');
      const siblingSubmenus = parentUl?.querySelectorAll('.submenu');
      siblingSubmenus?.forEach(sub => {
        if (sub !== submenu) sub.classList.remove('open');
      });

      // Abre ou fecha o submenu clicado
      submenu.classList.toggle('open');

      // Garante que todos os pais do submenu fiquem abertos
      let parent = submenu.closest('.submenu');
      while (parent) {
        parent.classList.add('open');
        parent = parent.closest('.submenu');
      }

      // Atualiza ícones de seta (se houver)
      document.querySelectorAll('.arrow-icon').forEach(icon => icon.classList.remove('rotate'));
      const arrow = this.querySelector('.arrow-icon');
      if (arrow) arrow.classList.toggle('rotate');

      // Atualiza classe 'active'
      document.querySelectorAll('.menu-item').forEach(i => i.classList.remove('active'));
      this.classList.add('active');
    });
  });
}