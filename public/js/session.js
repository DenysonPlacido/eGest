// /workspaces/eGest/public/js/session.js


// Elementos do header
const empresaEl = document.getElementById('empresa-logada');
const usuarioEl = document.getElementById('usuario-logado');
const horaEl = document.getElementById('hora-sistema');
const sessaoEl = document.getElementById('tempo-sessao');

// Mostra informações da empresa e usuário
if (empresaEl) {
  empresaEl.textContent = `Empresa: ${localStorage.getItem('selectedEmp') || 'Não logada'}`;
}
if (usuarioEl) {
  usuarioEl.textContent = `Usuário: ${localStorage.getItem('username') || 'Desconhecido'}`;
}

// Relógio do sistema (formato pt-BR)
setInterval(() => {
  if (horaEl) {
    const now = new Date();
    horaEl.textContent = now.toLocaleTimeString('pt-BR');
  }
}, 1000);

// Contador de tempo de sessão (persistente)
if (!localStorage.getItem('sessionStart')) {
  localStorage.setItem('sessionStart', Date.now());
}

setInterval(() => {
  if (sessaoEl) {
    const start = parseInt(localStorage.getItem('sessionStart'), 10);
    const diff = Math.floor((Date.now() - start) / 1000);

    const h = String(Math.floor(diff / 3600)).padStart(2, '0');
    const m = String(Math.floor((diff % 3600) / 60)).padStart(2, '0');
    const s = String(diff % 60).padStart(2, '0');

    sessaoEl.textContent = `${h}:${m}:${s}`;
  }
}, 1000);
