import('./session.js');

export function aplicarEventosMenu() {
  const menu = document.querySelector('.menu');
  if (!menu) return;

  menu.addEventListener('click', function (e) {
    const item = e.target.closest('.menu-item');
    if (!item) return;

    e.preventDefault();

    const targetId = item.dataset.target;
    const submenu = document.getElementById(targetId);
    if (!submenu) return;

    const parentUl = item.closest('ul');
    const siblingSubmenus = parentUl?.querySelectorAll('.submenu');
    siblingSubmenus?.forEach(sub => {
      if (sub !== submenu) sub.classList.remove('open');
    });

    submenu.classList.toggle('open');

    let parent = submenu.closest('.submenu');
    while (parent) {
      parent.classList.add('open');
      parent = parent.closest('.submenu');
    }

    document.querySelectorAll('.arrow-icon').forEach(icon => icon.classList.remove('rotate'));
    const arrow = item.querySelector('.arrow-icon');
    if (arrow) arrow.classList.toggle('rotate');

    document.querySelectorAll('.menu-item').forEach(i => i.classList.remove('active'));
    item.classList.add('active');

    // Carrega conteúdo
    loadContent(targetId);
  });
}

fetch('header.html')
  .then(res => res.text())
  .then(html => {
    document.getElementById('header-container').innerHTML = html;
    initLogout();
    initMenuToggle();
    import('./session.js');
  });
