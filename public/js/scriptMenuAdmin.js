export function aplicarEventosMenu() {
  const menuItems = document.querySelectorAll('.menu-item');

  menuItems.forEach(item => {
    item.addEventListener('click', function (e) {
      e.preventDefault();

      const targetId = this.dataset.target;
      const submenu = document.getElementById(targetId);
      if (!submenu) return;

      const isOpen = submenu.style.maxHeight && submenu.style.maxHeight !== "0px";

      // Fecha submenus irmãos do mesmo nível
      const parentLi = this.closest('li');
      const siblingSubmenus = parentLi?.parentElement?.querySelectorAll('.submenu');
      siblingSubmenus?.forEach(sub => {
        if (sub !== submenu) {
          sub.style.maxHeight = null;
        }
      });

      // Alterna apenas o submenu clicado
      submenu.style.maxHeight = isOpen ? null : submenu.scrollHeight + "px";

      // Ajusta apenas os pais até o topo imediato
      let parentSubmenu = submenu.closest('.submenu');
      while (parentSubmenu) {
        parentSubmenu.style.maxHeight = parentSubmenu.scrollHeight + "px";
        parentSubmenu = parentSubmenu.parentElement.closest('.submenu');
      }

      // Alterna classe 'active' só no item clicado
      document.querySelectorAll('.menu-item').forEach(i => i.classList.remove('active'));
      this.classList.add('active');
    });
  });
}
