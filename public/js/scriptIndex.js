// /workspaces/eGest/public/js/scriptIndex.js


import { showAlert } from './alerts.js';

async function login() {
  const empresa_id = document.getElementById("empresa").value.trim();
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!empresa_id || !username || !password) {
    showAlert("⚠️ Por favor, preencha todos os campos.", "warning");
    return;
  }

  try {
    const response = await fetch("https://e-gest-back-end.vercel.app/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ empresa_id, username, senha: password })
    });

    const data = await response.json();
    console.log('🔐 Dados recebidos do login:', data);

    if (!response.ok || !data.token) {
      showAlert(data.message || "❌ Credenciais inválidas!", "error");
      return;
    }

    // Salvar dados no localStorage
    localStorage.setItem("token", data.token);
    localStorage.setItem("usuarioNome", data.usuario.nome);
    localStorage.setItem("usuarioPerfil", data.usuario.perfil);
    localStorage.setItem("usuarioId", data.usuario.id);
    localStorage.setItem("empresaId", data.usuario.empresa_id);

    if (data.usuario.empresa_nome) {
      localStorage.setItem("selectedEmpName", data.usuario.empresa_nome);
    }

    // Redireciona para a home
    window.location.href = "adminHome.html";

  } catch (err) {
    console.error('Erro ao conectar com o servidor:', err);
    showAlert("❌ Erro ao conectar com o servidor!", "error");
  }
}

// Ativa o botão de login
document.getElementById("btn-login").addEventListener("click", (e) => {
  e.preventDefault();
  login();
});
