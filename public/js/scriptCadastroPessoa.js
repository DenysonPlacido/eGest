// /workspaces/eGest/public/js/session.js

// ===========================
// Configurações de tempo (em segundos)
// ===========================
const INTERVALO_VERIFICACAO = 1000;       // 1 segundo
const TEMPO_ALERTA_1 = 1.5 * 60;        // alerta 2 minutos
const TEMPO_ALERTA_2 = 1 * 60;        // alerta 1 minuto
const TEMPO_ALERTA_CRITICO = 30;         // alerta crítico 30 segundos
const TEMPO_PISCAR_DRAMATICO = 15;       // últimos 15 segundos piscar

// ===========================
// Mensagens de alerta
// ===========================
const MENSAGEM_ALERTA_2MIN = `⚠️ Sua sessão vai expirar em ${TEMPO_ALERTA_1 / 60} minutos!`;
const MENSAGEM_ALERTA_1MIN = `⚠️ Sua sessão vai expirar em ${TEMPO_ALERTA_2 / 60} minuto!`;
const MENSAGEM_ALERTA_CRITICO = `⛔ Sua sessão vai expirar em ${TEMPO_ALERTA_CRITICO} segundos!`;
const MENSAGEM_SESSAO_EXPIRADA = "⛔ Sessão expirada.";

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
// Função de alerta customizado
// ===========================
function mostrarMensagem(msg, tipo = 'info') {
  const div = document.createElement('div');
  div.textContent = msg;
  div.style.position = 'fixed';
  div.style.top = '20px';
  div.style.right = '20px';
  div.style.padding = '10px 20px';
  div.style.borderRadius = '5px';
  div.style.zIndex = 9999;
  div.style.color = '#fff';
  div.style.fontWeight = 'bold';
  div.style.opacity = '0.95';

  if (tipo === 'info') div.style.backgroundColor = '#3498db';
  if (tipo === 'alerta') div.style.backgroundColor = '#f1c40f';
  if (tipo === 'alerta2') div.style.backgroundColor = '#e67e22';
  if (tipo === 'critico') div.style.backgroundColor = '#e74c3c';

  document.body.appendChild(div);
  setTimeout(() => div.remove(), 5000);
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
// Contagem regressiva com alertas e piscar dramático
// ===========================
let alerta2minMostrado = false;
let alerta1minMostrado = false;
let alertaCriticoMostrado = false;
let piscarLigado = false;

setInterval(() => {
  if (!expTimestamp || !sessaoEl) return;

  const agora = Date.now();
  const tempoRestante = Math.floor((expTimestamp - agora) / 1000);

  if (tempoRestante > 0) {
    const h = String(Math.floor(tempoRestante / 3600)).padStart(2, '0');
    const m = String(Math.floor((tempoRestante % 3600) / 60)).padStart(2, '0');
    const s = String(tempoRestante % 60).padStart(2, '0');
    sessaoEl.textContent = `⏳ ${h}:${m}:${s}`;

    // cores escalonadas
    if (tempoRestante <= TEMPO_ALERTA_CRITICO) {
      sessaoEl.style.color = '#e74c3c';
    } else if (tempoRestante <= TEMPO_ALERTA_2) {
      sessaoEl.style.color = '#e67e22';
    } else if (tempoRestante <= TEMPO_ALERTA_1) {
      sessaoEl.style.color = '#f1c40f';
    } else {
      sessaoEl.style.color = '#2c3e50';
    }

    // piscar dramático últimos TEMPO_PISCAR_DRAMATICO
    if (tempoRestante <= TEMPO_PISCAR_DRAMATICO) {
      piscarLigado = !piscarLigado;
      sessaoEl.style.opacity = piscarLigado ? '1' : '0.2';
      sessaoEl.style.transform = piscarLigado ? 'scale(1.3)' : 'scale(1)';
      sessaoEl.style.transition = 'all 0.5s ease';
    } else {
      sessaoEl.style.opacity = '1';
      sessaoEl.style.transform = 'scale(1)';
    }

    // alertas escalonados usando variáveis
    if (!alerta2minMostrado && tempoRestante <= TEMPO_ALERTA_1 && tempoRestante > TEMPO_ALERTA_2) {
      alerta2minMostrado = true;
      mostrarMensagem(MENSAGEM_ALERTA_2MIN, 'alerta');
    }

    if (!alerta1minMostrado && tempoRestante <= TEMPO_ALERTA_2 && tempoRestante > TEMPO_ALERTA_CRITICO) {
      alerta1minMostrado = true;
      mostrarMensagem(MENSAGEM_ALERTA_1MIN, 'alerta2');
    }

    if (!alertaCriticoMostrado && tempoRestante <= TEMPO_ALERTA_CRITICO) {
      alertaCriticoMostrado = true;
      mostrarMensagem(MENSAGEM_ALERTA_CRITICO, 'critico');
    }

  } else {
    sessaoEl.textContent = "⏳ 00:00:00";
    sessaoEl.style.opacity = '1';
    sessaoEl.style.transform = 'scale(1)';
    mostrarMensagem(MENSAGEM_SESSAO_EXPIRADA, 'critico');
    localStorage.clear();
    window.location.href = 'index.html';
  }
}, INTERVALO_VERIFICACAO);
