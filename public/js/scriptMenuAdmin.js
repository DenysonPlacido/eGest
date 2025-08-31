// /workspaces/eGest/public/js/scriptMenuAdmin.js

document.querySelectorAll('.menu-item').forEach(item => {
    item.addEventListener('click', function(e) {
        e.preventDefault(); // Evita que a página recarregue ao clicar no link

        const target = this.getAttribute('data-target');
        const submenu = document.getElementById(target);

        // Fecha todos os submenus
        document.querySelectorAll('.submenu').forEach(sub => {
            if (sub !== submenu) {
                // sub.style.maxHeight = null;
            }
        });

        // Remove a classe 'active' de todos os itens
        document.querySelectorAll('.menu-item').forEach(i => {
            if (i !== this) {
                i.classList.remove('active');
            }
        });

        // Alterna o submenu clicado
        if (submenu.style.maxHeight) {
            submenu.style.maxHeight = null;
            this.classList.remove('active');
        } else {
            submenu.style.maxHeight = submenu.scrollHeight + "px";
            this.classList.add('active');
        }
    });
});

document.addEventListener("DOMContentLoaded", function () {
  const menuItems = document.querySelectorAll('.menu-item');

  menuItems.forEach(item => {
    item.addEventListener('click', function (e) {
      e.preventDefault();

      const targetId = this.dataset.target;
      const submenu = document.getElementById(targetId);

      if (!submenu) return;

      const isOpen = submenu.style.maxHeight && submenu.style.maxHeight !== "0px";

      // Fecha apenas submenus irmãos no mesmo nível
      const parentLi = this.closest('li');
      const siblingSubmenus = parentLi?.parentElement?.querySelectorAll('.submenu');

      siblingSubmenus?.forEach(sub => {
        if (sub !== submenu) {
          sub.style.maxHeight = null;
        }
      });

      // Alterna submenu clicado
      submenu.style.maxHeight = isOpen ? null : submenu.scrollHeight + "px";
    });
  });
});