// /public/js/themeSwitcher.js
export function initThemeSwitcher() {
  const themeButtons = document.querySelectorAll(".theme-btn");
  const body = document.body;

  // Aplica o tema salvo ou padrão
  const savedTheme = localStorage.getItem("erp-theme");
  if (savedTheme) body.classList.add(savedTheme);
  else body.classList.add("light-theme");

  themeButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const theme = btn.dataset.theme;
      body.classList.remove("light-theme", "dark-theme", "modern-theme");
      body.classList.add(theme);
      localStorage.setItem("erp-theme", theme);
    });
  });
}
