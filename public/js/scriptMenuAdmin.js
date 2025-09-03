export function aplicarEventosMenu() {
  const menuItems = document.querySelectorAll('.menu-item');

  menuItems.forEach(item => {
    item.addEventListener('click', function (e) {
      e.preventDefault();

      const targetId = this.dataset.target;
      const submenu = document.getElementById(targetId);
      if (!submenu) return;

      const isOpen = submenu.style.maxHeight && submenu.style.maxHeight !== "0px";

      // Fecha irmãos do mesmo nível
      const parentLi = this.closest('li');
      const siblingSubmenus = parentLi?.parentElement?.querySelectorAll('.submenu');
      siblingSubmenus?.forEach(sub => {
        if (sub !== submenu) sub.style.maxHeight = null;
      });

      // Alterna apenas o submenu clicado
      submenu.style.maxHeight = isOpen ? null : submenu.scrollHeight + "px";

      // Atualiza todos os pais para incluir altura do submenu clicado
      let parent = submenu.parentElement.closest('.submenu');
      while (parent) {
        parent.style.maxHeight = parent.scrollHeight + submenu.scrollHeight + "px";
        parent = parent.parentElement.closest('.submenu');
      }

      // Atualiza classe 'active'
      document.querySelectorAll('.menu-item').forEach(i => i.classList.remove('active'));
      this.classList.add('active');
    });
  });
}
