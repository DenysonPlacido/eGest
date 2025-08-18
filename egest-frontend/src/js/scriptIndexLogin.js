// Função chamada quando o botão "Selecionar" é clicado
document.getElementById('select-btn').addEventListener('click', function() {
    const selectedCondominium = document.getElementById('condominium-select').value;

    alert(`Condomínio selecionado: ${selectedCondominium}`);
    
    // Chama a função para selecionar o condomínio
    selectCondominium();
});



// Função para lidar com a seleção do condomínio
function selectCondominium() {
    var selectedCondo = document.getElementById("condominium-select").value;
    
    if (selectedCondo) {
        // Salva o condomínio selecionado no armazenamento local do navegador
        localStorage.setItem("selectedCondo", selectedCondo);

        // Redireciona o usuário para a página de login
        window.location.href = "login.html";
    } else {
        // Exibe um alerta caso nenhum condomínio tenha sido selecionado
        alert("Por favor, selecione um condomínio.");
    }
}



// // Função para exibir o nome do condomínio selecionado na página de login
// document.addEventListener("DOMContentLoaded", function() {
//     var selectedCondo = localStorage.getItem("selectedCondo");
//     if (selectedCondo) {
//         // Exibe o nome do condomínio selecionado na página de login
//         document.getElementById("condominium-name").innerText = "Condomínio: " + selectedCondo;
//     } else {
//         // Redireciona para a página de seleção se não houver condomínio salvo
//         window.location.href = "index.html";
//     }
// });


// //  1º
// // Função para validar e processar o login
// function login() {
//     var username = document.getElementById("username").value;
//     var password = document.getElementById("password").value;
    

//     if (username && password) {
//         // Aqui seria feita a validação de login real com o backend
        
//         alert("Login realizado com sucesso!");
//     } else {
//         // Exibe um alerta se os campos de usuário ou senha estiverem vazios
//         alert("Por favor, preencha todos os campos.");
//     }
// }

// 2º
// // Função para validar e processar o login
// function login() {
//     var username = document.getElementById("username").value;
//     var password = document.getElementById("password").value;
    
//     if (username && password) {
//         // Aqui seria feita a validação de login real com o backend
//         // Como estamos apenas simulando, vamos direto para o redirecionamento
        
//         alert("Login realizado com sucesso!");
        
//         // Redireciona para a página de admin após login bem-sucedido
//         window.location.href = "admin_dashboard.html";
//     } else {
//         // Exibe um alerta se os campos de usuário ou senha estiverem vazios
//         alert("Por favor, preencha todos os campos.");
//     }
// }

// // Função para validar e processar o login
// function login() {
//     var username = document.getElementById("username").value;
//     var password = document.getElementById("password").value;

//     if (username && password) {
//         // Aqui seria feita a validação de login real com o backend
//         alert("Login realizado com sucesso!");

//         // Redireciona para a página admin_dashboard.html após o login
//         window.location.href = "admin_dashboard.html";
//     } else {
//         // Exibe um alerta se os campos de usuário ou senha estiverem vazios
//         alert("Por favor, preencha todos os campos.");
//     }
// }

//para quando estiver pronto o servidor com BD
function login() {
  var cpf = document.getElementById("username").value;
  var senha = document.getElementById("password").value;

  if (cpf && senha) {
      // Fazer requisição à API
      fetch('http://127.0.0.1:5500/login', { // Ajustado para o endpoint correto
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ cpf, senha ,TIPO_USUARIO}),
      })
      .then(response => {
          if (!response.ok) {
              // Manuseio de status de erro
              return response.json().then(data => {
                  throw new Error(data.message || 'Erro ao realizar login.');
              });
          }
          return response.json();
      })
      .then(data => {
          // Verifique se o usuário foi autenticado com sucesso
          if (data.user) {
              alert("Login realizado com sucesso!");
              // Redirecionar conforme o tipo de usuário
              if (data.user.TIPO_USUARIO === 1) {
                  window.location.href = "http://127.0.0.1:5500/CondoSoft_v1.4/wwwroot/user_dashboard.html";
              } else if (data.user.TIPO_USUARIO === 2) {
                  window.location.href = "http://127.0.0.1:5500/CondoSoft_v1.4/wwwroot/admin_dashboard.html";
              }
          } else {
              alert('Erro: Usuário não encontrado.');
          }
      })
      .catch(error => {
          console.error('Erro:', error);
          alert(error.message || 'Erro ao realizar login.');
      });
  } else {
      alert("Por favor, preencha todos os campos.");
  }
}

  

