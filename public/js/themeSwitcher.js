// /public/js/themeSwitcher.js
export function initThemeSwitcher() {
  const body = document.body;
  const themeToggle = document.getElementById("theme-toggle");
  const themeIcon = document.getElementById("theme-icon");

  // Aplica o tema salvo ou padrão (claro)
  const savedTheme = localStorage.getItem("erp-theme") || "light-theme";
  body.classList.add(savedTheme);

  // Ajusta o ícone de acordo com o tema atual
  function atualizarIconeTema() {
    if (body.classList.contains("dark-theme")) {
      themeIcon.classList.replace("fa-moon", "fa-sun");
      themeToggle.title = "Mudar para tema claro";
    } else {
      themeIcon.classList.replace("fa-sun", "fa-moon");
      themeToggle.title = "Mudar para tema escuro";
    }
  }

  atualizarIconeTema();

  // Alterna o tema ao clicar
  themeToggle.addEventListener("click", () => {
    body.classList.toggle("dark-theme");
    body.classList.toggle("light-theme");

    const novoTema = body.classList.contains("dark-theme")
      ? "dark-theme"
      : "light-theme";

    localStorage.setItem("erp-theme", novoTema);
    atualizarIconeTema();
  });
}

// Executa automaticamente se o script for incluído diretamente
document.addEventListener("DOMContentLoaded", initThemeSwitcher);

