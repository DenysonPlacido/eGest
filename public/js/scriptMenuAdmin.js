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

            // Fecha irmãos do mesmo nível
            const parentLi = this.closest('li');
            const siblingSubmenus = parentLi?.parentElement?.querySelectorAll('.submenu');
            siblingSubmenus?.forEach(sub => {
                if (sub !== submenu) sub.style.maxHeight = null;
            });

            // Abre ou fecha apenas o submenu clicado
            submenu.style.maxHeight = isOpen ? null : submenu.scrollHeight + "px";

            // Atualiza altura de todos os pais para incluir o submenu clicado
            let parent = submenu.closest('.submenu');
            while (parent) {
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

            // Atualiza classe 'active'
            document.querySelectorAll('.menu-item').forEach(i => i.classList.remove('active'));
            this.classList.add('active');
        });
    });
}
