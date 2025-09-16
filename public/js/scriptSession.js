// /workspaces/eGest/public/js/session.js

// ===========================
// Configurações
// ===========================
const TEMPO_ALERTA = 2 * 60;         // alerta 5 minutos antes
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

// if (empresaEl) empresaEl.textContent = `Empresa: ${empresaNome}`;
if (usuarioEl) usuarioEl.textContent = `Bem Vindo ${usuario}`;

// ===========================
// Relógio do sistema (HH:MM)
// ===========================
setInterval(() => {
  if (horaEl) {
    const now = new Date();
    horaEl.textContent = `⏰ ${now.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    })}`;
  }
}, INTERVALO_VERIFICACAO);

// ===========================
// Função para decodificar JWT sem lib
// ===========================
function parseJwt(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

// ===========================
// Função para atualizar o token (opcional se fizer refresh)
// ===========================
function atualizarToken(novoToken) {
  localStorage.setItem('token', novoToken);
  const decoded = parseJwt(novoToken);
  if (decoded && decoded.exp) {
    expTimestamp = decoded.exp * 1000; // atualiza timestamp de expiração
  }
}

// ===========================
// Pega token do localStorage
// ===========================
let token = localStorage.getItem('token');
let expTimestamp = null;

if (token) {
  const decoded = parseJwt(token);
  if (decoded && decoded.exp) {
    expTimestamp = decoded.exp * 1000; // exp em ms
  }
}

// ===========================
// Contagem regressiva do token com alerta
// ===========================
let alertaMostrado = false;

setInterval(() => {
  if (!expTimestamp || !sessaoEl) return;

  const agora = Date.now();
  const tempoRestante = Math.floor((expTimestamp - agora) / 1000);

  if (tempoRestante > 0) {
    const h = String(Math.floor(tempoRestante / 3600)).padStart(2, '0');
    const m = String(Math.floor((tempoRestante % 3600) / 60)).padStart(2, '0');
    const s = String(tempoRestante % 60).padStart(2, '0');
    sessaoEl.textContent = `⏳ ${h}:${m}:${s}`;

    // alerta 5 minutos antes
    if (!alertaMostrado && tempoRestante <= TEMPO_ALERTA) {
      alertaMostrado = true;
      alert("⚠️ Sua sessão vai expirar em 5 minutos!");
    }
  } else {
    sessaoEl.textContent = "⏳ 00:00:00";
    alert("⛔ Sessão expirada.");
    localStorage.clear();
    window.location.href = 'index.html';
  }
}, INTERVALO_VERIFICACAO);
