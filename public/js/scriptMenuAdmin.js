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

      // Função para atualizar a altura de todos os pais
      const atualizarPais = (el) => {
        let parent = el.closest('.submenu');
        while (parent) {
          // Soma a altura de todos os filhos visíveis para o pai
          let totalHeight = 0;
          Array.from(parent.children).forEach(child => {
            if (child.classList.contains('submenu')) {
              totalHeight += child.scrollHeight;
            } else {
              totalHeight += child.offsetHeight;
            }
          });
          parent.style.maxHeight = totalHeight + "px";
          parent = parent.closest('.submenu');
        }
      };

      // Atualiza pais após abrir submenu
      atualizarPais(submenu);

      // Atualiza classe 'active'
      document.querySelectorAll('.menu-item').forEach(i => i.classList.remove('active'));
      this.classList.add('active');
    });
  });
}
