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
        sub.classList.remove('open');
      });

      // Abre ou fecha o submenu clicado
      submenu.classList.toggle('open');

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