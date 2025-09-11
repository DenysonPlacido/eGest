// /workspaces/eGest/public/js/session.js
// ===========================
// Configurações
// ===========================
const TEMPO_MAXIMO_SESSAO = 60 * 60; // 1 hora em segundos
const TEMPO_ALERTA = 5 * 60;         // alerta 5 minutos antes
const INTERVALO_VERIFICACAO = 1000;  // 1 segundo

// ===========================
// Elementos do header
// ===========================
const empresaEl = document.getElementById('empresa-logada');
const usuarioEl = document.getElementById('usuario-logado');
const horaEl = document.getElementById('hora-sistema');
const sessaoEl = document.getElementById('tempo-sessao');

// ===========================
// Exibe dados da empresa e usuário
// ===========================
const empresaNome = localStorage.getItem('selectedEmpName') || 'Não logada';
const usuario = localStorage.getItem('usuarioNome') || 'Desconhecido';

if (empresaEl) empresaEl.textContent = `Empresa: ${empresaNome}`;
if (usuarioEl) usuarioEl.textContent = `Usuário: ${usuario}`;

// ===========================
// Relógio do sistema
// ===========================
setInterval(() => {
  if (horaEl) {
    const now = new Date();
    horaEl.textContent = now.toLocaleTimeString('pt-BR', { hour12: false });
  }
}, INTERVALO_VERIFICACAO);

// ===========================
// Controle de sessão com inatividade
// ===========================
let sessionStart = parseInt(localStorage.getItem('sessionStart'), 10);
if (isNaN(sessionStart)) {
  sessionStart = Date.now();
  localStorage.setItem('sessionStart', sessionStart);
}

let lastActivity = Date.now();
let alertaMostrado = false;

function renovarSessao() {
  lastActivity = Date.now();
  alertaMostrado = false;
}

['mousemove', 'keydown', 'click', 'scroll'].forEach(evt => {
  document.addEventListener(evt, renovarSessao);
});

setInterval(() => {
  const agora = Date.now();
  const tempoSessao = Math.floor((agora - sessionStart) / 1000);
  const tempoInativo = Math.floor((agora - lastActivity) / 1000);

  if (sessaoEl) {
    const h = String(Math.floor(tempoSessao / 3600)).padStart(2, '0');
    const m = String(Math.floor((tempoSessao % 3600) / 60)).padStart(2, '0');
    const s = String(tempoSessao % 60).padStart(2, '0');
    sessaoEl.textContent = `${h}:${m}:${s}`;
  }

  if (!alertaMostrado && tempoInativo >= TEMPO_MAXIMO_SESSAO - TEMPO_ALERTA) {
    alertaMostrado = true;
    alert("Você está inativo há um tempo. A sessão será encerrada em breve.");
  }

  if (tempoInativo >= TEMPO_MAXIMO_SESSAO) {
    alert("Sessão encerrada por inatividade.");
    localStorage.clear();
    window.location.href = 'index.html';
  }
}, INTERVALO_VERIFICACAO);