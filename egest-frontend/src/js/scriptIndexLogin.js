// /workspaces/eGest/egest-frontend/src/js/scriptIndexLogin.js

// ===========================
// Seleção da empresa
// ===========================
document.getElementById('select-btn').addEventListener('click', selectedEmpresa);

function selectedEmpresa() {
    const select = document.getElementById("condominium-select");
    const selectedEmp = select.value;

    if (selectedEmp) {
        // Salva a empresa selecionada no localStorage
        localStorage.setItem("selectedEmp", selectedEmp);
        // Redireciona para a tela de login
        window.location.href = "login.html";
    } else {
        alert("Por favor, selecione uma Empresa.");
    }
}

// ===========================
// Carregar empresas do backend
// ===========================
async function carregarEmpresas() {
    try {
        const response = await fetch("https://e-gest-back-end.vercel.app/api/empresas");
        const empresas = await response.json();

        const select = document.getElementById("condominium-select");
        select.innerHTML = ''; // limpa opções

        empresas.forEach(emp => {
            const option = document.createElement("option");
            option.value = emp.empresa_id; // usar empresa_id do backend
            option.textContent = emp.nome;
            select.appendChild(option);
        });

    } catch (err) {
        console.error('Erro ao carregar empresas:', err);
        alert("Erro ao carregar empresas.");
    }
}

// Executa ao carregar a página
window.addEventListener('DOMContentLoaded', carregarEmpresas);

// ===========================
// Função de login
// ===========================
async function login() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const empresa_id = localStorage.getItem("selectedEmp");

    if (!username || !password) {
        alert("Por favor, preencha todos os campos.");
        return;
    }

    try {
        const response = await fetch("https://e-gest-back-end.vercel.app/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ empresa_id, username, senha: password })
        });

        const data = await response.json();

        if (data.status === 1) {
            alert("Login realizado com sucesso!");
            window.location.href = "admin_dashboard.html";
        } else {
            alert("Credenciais inválidas!");
        }

    } catch (err) {
        console.error('Erro ao conectar com o servidor:', err);
        alert("Erro ao conectar com o servidor!");
    }
}
