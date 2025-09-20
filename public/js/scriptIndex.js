// /workspaces/eGest/public/js/scriptIndex.js
async function login() {
  const empresa_id = document.getElementById("empresa").value.trim();
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!empresa_id || !username || !password) {
    alert("Por favor, preencha todos os campos.");
    return;
  }

  try {
    const response = await fetch("https://e-gest-back-end.vercel.app/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-empresa-id": empresa_id
      },
      body: JSON.stringify({ username, senha: password })
    });

    const data = await response.json();
    console.log('🔐 Dados recebidos do login:', data);

    if (!response.ok || !data.token) {
      alert(data.message || "Credenciais inválidas!");
      return;
    }

    // ✅ Salvando dados no localStorage
    localStorage.setItem("token", data.token);
    localStorage.setItem("usuarioNome", data.usuario.nome);
    localStorage.setItem("usuarioPerfil", data.usuario.tipo_usuario);
    localStorage.setItem("usuarioId", data.usuario.id);
    localStorage.setItem("empresaId", empresa_id); // ← ESSENCIAL!

    // Redireciona para a página principal
    window.location.href = "adminHome.html";

  } catch (err) {
    console.error('Erro ao conectar com o servidor:', err);
    alert("Erro ao conectar com o servidor!");
  }
}