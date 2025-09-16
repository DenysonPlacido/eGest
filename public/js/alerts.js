// alerts.js - Sistema avançado de alertas

let alertContainer = document.getElementById("alert-container");
if (!alertContainer) {
    alertContainer = document.createElement("div");
    alertContainer.id = "alert-container";
    alertContainer.style.position = "fixed";


    //canto superior direito da tela
    //alertContainer.style.top = "20px";
    //alertContainer.style.right = "20px";


    //centro da tela, sobrepostos
    alertContainer.style.top = "50%";
    alertContainer.style.left = "50%";
    alertContainer.style.transform = "translate(-50%, -50%)";
    alertContainer.style.right = "auto";


    //Isso deixa os alertas aparecendo embaixo no centro, igual notificação de celular.
    // alertContainer.style.bottom = "20px";
    // alertContainer.style.left = "50%";
    // alertContainer.style.transform = "translateX(-50%)";
    // alertContainer.style.top = "auto";
    // alertContainer.style.right = "auto";




    alertContainer.style.zIndex = "9999";
    alertContainer.style.display = "flex";
    alertContainer.style.flexDirection = "column";
    alertContainer.style.gap = "12px";
    document.body.appendChild(alertContainer);
}

/**
 * Mostra alerta com barra de tempo
 * @param {string} message - Texto do alerta
 * @param {"success"|"info"|"warning"|"error"} type - Severidade
 * @param {number} duration - Tempo de exibição em ms
 */
export function showAlert(message, type = "info", duration = 5000) {
    const alert = document.createElement("div");
    alert.classList.add("custom-alert", `alert-${type}`);
    alert.innerHTML = `
    <div class="alert-message">${message}</div>
    <div class="alert-progress"></div>
  `;

    // estilos básicos
    alert.style.position = "relative";
    alert.style.padding = "14px 20px";
    alert.style.borderRadius = "8px";
    alert.style.color = "#fff";
    alert.style.fontFamily = "sans-serif";
    alert.style.fontSize = "14px";
    alert.style.boxShadow = "0 3px 8px rgba(0,0,0,0.2)";
    alert.style.cursor = "default";
    alert.style.overflow = "hidden";
    alert.style.opacity = "0";
    alert.style.transition = "opacity 0.3s ease";

    // cores por tipo
    const colors = {
        success: "#2ecc71", // verde
        info: "#3498db",    // azul
        warning: "#e67e22", // laranja
        error: "#e74c3c"    // vermelho
    };
    alert.style.background = colors[type] || colors.info;

    // barra de progresso
    const progress = alert.querySelector(".alert-progress");
    progress.style.position = "absolute";
    progress.style.bottom = "0";
    progress.style.left = "0";
    progress.style.height = "4px";
    progress.style.background = "rgba(255,255,255,0.7)";
    progress.style.width = "100%";
    progress.style.transition = `width linear ${duration}ms`;

    alertContainer.appendChild(alert);

    // anima aparecer
    requestAnimationFrame(() => {
        alert.style.opacity = "1";
        progress.style.width = "0%"; // inicia contagem
    });

    // controle de tempo
    let timeoutId;
    let startTime = Date.now();
    let remaining = duration;

    function removeAlert() {
        alert.style.opacity = "0";
        setTimeout(() => alert.remove(), 300);
    }

    function startTimer() {
        timeoutId = setTimeout(removeAlert, remaining);
        progress.style.transition = `width linear ${remaining}ms`;
        progress.style.width = "0%";
        startTime = Date.now();
    }

    function pauseTimer() {
        clearTimeout(timeoutId);
        remaining -= Date.now() - startTime;
        progress.style.transition = "none";
        const percent = (remaining / duration) * 100;
        progress.style.width = percent + "%";
    }

    // eventos hover (pause/resume)
    alert.addEventListener("mouseenter", pauseTimer);
    alert.addEventListener("mouseleave", startTimer);

    // iniciar
    startTimer();
}
