// JavaScript para o morador_dashboard.html

// Função para mostrar/ocultar o menu dropdown
document.querySelectorAll('.dropdown-btn').forEach(button => {
    button.addEventListener('click', function() {
        const dropdown = this.nextElementSibling;
        const isVisible = dropdown.style.display === 'block';
        document.querySelectorAll('.dropdown-container').forEach(container => {
            container.style.display = 'none';
        });
        dropdown.style.display = isVisible ? 'none' : 'block';
    });
});

// Função de logout
function logout() {
    // Aqui você pode implementar o processo de logout real
    alert('Você foi desconectado.');
}
