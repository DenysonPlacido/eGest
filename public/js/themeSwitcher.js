// /public/js/themeSwitcher.js
export function initThemeSwitcher() {
  const themeButtons = document.querySelectorAll(".theme-btn");
  const body = document.body;

  // Aplica o tema salvo ou padrão
  const savedTheme = localStorage.getItem("erp-theme");
  if (savedTheme) body.classList.add(savedTheme);
  else body.classList.add("white-theme");

  themeButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const theme = btn.dataset.theme;
      body.classList.remove("white-theme", "black-theme", "moderne-theme");
      body.classList.add(theme);
      localStorage.setItem("erp-theme", theme);
    });
  });
}
