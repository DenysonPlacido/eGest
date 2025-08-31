// mostra informações do usuário e empresa
document.getElementById('empresa-logada').textContent = `Empresa: ${localStorage.getItem('selectedEmp') || 'Não logada'}`;
document.getElementById('usuario-logado').textContent = `Usuário: ${localStorage.getItem('username') || 'Desconhecido'}`;

// relógio do sistema
setInterval(() => {
  const now = new Date();
  document.getElementById('hora-sistema').textContent = now.toLocaleTimeString();
}, 1000);

// contador de tempo de sessão
let tempo = 0;
setInterval(() => {
  tempo++;
  const h = String(Math.floor(tempo/3600)).padStart(2,'0');
  const m = String(Math.floor((tempo%3600)/60)).padStart(2,'0');
  const s = String(tempo%60).padStart(2,'0');
  document.getElementById('tempo-sessao').textContent = `${h}:${m}:${s}`;
}, 1000);
