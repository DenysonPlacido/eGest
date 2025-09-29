//workspaces/eGest/public/js/scriptSession.js

import { showAlert } from './alerts.js';

// Configurações de tempo (em segundos)
const INTERVALO_VERIFICACAO = 1000;
const TEMPO_ALERTA_1 = 1.5 * 60;
const TEMPO_ALERTA_2 = 1 * 60;
const TEMPO_ALERTA_CRITICO = 30;
const TEMPO_PISCAR_DRAMATICO = 15;

// Mensagens de alerta
const MENSAGEM_ALERTA_1 = `⚠️ Sua sessão vai expirar em ${TEMPO_ALERTA_1 / 60} minutos!`;
const MENSAGEM_ALERTA_2 = `⚠️ Sua sessão vai expirar em ${TEMPO_ALERTA_2 / 60} minuto!`;
const MENSAGEM_ALERTA_CRITICO = `⛔ Sua sessão vai expirar em ${TEMPO_ALERTA_CRITICO} segundos!`;
const MENSAGEM_SESSAO_EXPIRADA = "⛔ Sessão expirada.";

// Elementos do header
const usuarioEl = document.getElementById('usuario-logado');
const horaEl = document.getElementById('hora-sistema');
const sessaoEl = document.getElementById('tempo-sessao');

const usuario = localStorage.getItem('usuarioNome') || 'Desconhecido';
if (usuarioEl) usuarioEl.textContent = `Bem Vindo ${usuario}`;

// Relógio do sistema (HH:MM)
setInterval(() => {
  if (horaEl) {
    const now = new Date();
    horaEl.textContent = `⏰ ${now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', hour12: false })}`;
  }
}, INTERVALO_VERIFICACAO);

// Decodificar JWT
function parseJwt(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

// Token
let token = localStorage.getItem('token');
let expTimestamp = null;
if (token) {
  const decoded = parseJwt(token);
  if (decoded && decoded.exp) expTimestamp = decoded.exp * 1000;
}

// Contagem regressiva
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
    if (tempoRestante <= TEMPO_ALERTA_CRITICO) sessaoEl.style.color = '#e74c3c';
    else if (tempoRestante <= TEMPO_ALERTA_2) sessaoEl.style.color = '#e67e22';
    else if (tempoRestante <= TEMPO_ALERTA_1) sessaoEl.style.color = '#f1c40f';
    else sessaoEl.style.color = '#000000ff';

    // piscar dramático
    if (tempoRestante <= TEMPO_PISCAR_DRAMATICO) {
      piscarLigado = !piscarLigado;
      sessaoEl.style.opacity = piscarLigado ? '1' : '0.2';
      sessaoEl.style.transform = piscarLigado ? 'scale(1.3)' : 'scale(1)';
      sessaoEl.style.transition = 'all 0.5s ease';
    } else {
      sessaoEl.style.opacity = '1';
      sessaoEl.style.transform = 'scale(1)';
    }

    // alertas
    if (!alerta2minMostrado && tempoRestante <= TEMPO_ALERTA_1 && tempoRestante > TEMPO_ALERTA_2) {
      alerta2minMostrado = true;
      showAlert(MENSAGEM_ALERTA_1, 'warning', 5000);
    }

    if (!alerta1minMostrado && tempoRestante <= TEMPO_ALERTA_2 && tempoRestante > TEMPO_ALERTA_CRITICO) {
      alerta1minMostrado = true;
      showAlert(MENSAGEM_ALERTA_2, 'warning', 5000);
    }

    if (!alertaCriticoMostrado && tempoRestante <= TEMPO_ALERTA_CRITICO) {
      alertaCriticoMostrado = true;
      showAlert(MENSAGEM_ALERTA_CRITICO, 'error', 5000);
    }

  } else {
    sessaoEl.textContent = "⏳ 00:00:00";
    sessaoEl.style.opacity = '1';
    sessaoEl.style.transform = 'scale(1)';
    showAlert(MENSAGEM_SESSAO_EXPIRADA, 'error', 5000);
    localStorage.clear();
    window.location.href = 'index.html';
  }
}, INTERVALO_VERIFICACAO);
