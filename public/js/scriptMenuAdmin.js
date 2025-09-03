// /workspaces/eGest/public/js/scriptMenuAdmin.js
export function aplicarEventosMenu() {
  const menuItems = document.querySelectorAll('.menu-item');

  menuItems.forEach(item => {
    item.addEventListener('click', function (e) {
      e.preventDefault();

      const targetId = this.dataset.target;
      const submenu = document.getElementById(targetId);
      if (!submenu) return;

      const isOpen = submenu.style.maxHeight && submenu.style.maxHeight !== "0px";

      
      // Fecha submenus irmãos
      const parentLi = this.closest('li');
      const siblingSubmenus = parentLi?.parentElement?.querySelectorAll('.submenu');
      siblingSubmenus?.forEach(sub => {
        if (sub !== submenu) sub.style.maxHeight = null;
      });

      // Alterna submenu clicado
      submenu.style.maxHeight = isOpen ? null : submenu.scrollHeight + "px";


      // Aguarda o navegador recalcular o layout e ajusta os pais
      setTimeout(() => {
        let parentSubmenu = submenu.closest('.submenu');
        while (parentSubmenu) {
          parentSubmenu.style.maxHeight = parentSubmenu.scrollHeight + "px";
          parentSubmenu = parentSubmenu.closest('.submenu');
        }
      }, 300); // mesmo tempo da transição no CSS (0.3s)

      

      // Alterna classe 'active'
      document.querySelectorAll('.menu-item').forEach(i => i.classList.remove('active'));
      this.classList.add('active');
    });
  });
}