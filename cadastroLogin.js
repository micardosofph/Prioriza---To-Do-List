const cadastroDiv = document.getElementById('cadastro');
const loginDiv = document.getElementById('login');
const toggleLogin = document.querySelector('.toggle-login');
const toggleCadastro = document.querySelector('.toggle-cadastro');
var textoFazerLoginCadastro = document.getElementById('fazerLoginCadastro-text');
var botaoFazerLoginCadastro = document.getElementById('fazerLoginCadastro-button');

// Função para alternar telas com animação
function showCadastro() {
    loginDiv.classList.remove('active');
    cadastroDiv.classList.add('active');
    textoFazerLoginCadastro.textContent = 'Fazer login';
    botaoFazerLoginCadastro.onclick = showLogin;
    document.title = 'Prioriza - Cadastro';
}

function showLogin() {
    cadastroDiv.classList.remove('active');
    loginDiv.classList.add('active');
    textoFazerLoginCadastro.textContent = 'Cadastrar-se'
    botaoFazerLoginCadastro.onclick = showCadastro;
    document.title = 'Prioriza - Login';
}

// Eventos de clique
toggleLogin.addEventListener('click', function (e) {
    e.preventDefault(); // Impede o comportamento padrão do link
    showLogin();
});

toggleCadastro.addEventListener('click', function (e) {
    e.preventDefault();
    showCadastro();
});

// Inicia com cadastro visível
showCadastro();
modoClaroEscuro();

function modoClaroEscuro() {
    const modoClaroEscuroButton = document.getElementById("modoClaroEscuroButton");
    const root = document.documentElement;
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
        root.setAttribute("data-theme", savedTheme);
        const textoBotao = modoClaroEscuroButton.querySelector(".buttonsHeaderText");
        textoBotao.textContent = savedTheme === "dark" ? "Modo Escuro" : "Modo Claro";
    }
    modoClaroEscuroButton.addEventListener("click", () => {
        const currentTheme = root.getAttribute("data-theme");
        const newTheme = currentTheme === "dark" ? "light" : "dark";
        root.setAttribute("data-theme", newTheme);
        localStorage.setItem("theme", newTheme);
        const textoBotao = modoClaroEscuroButton.querySelector(".buttonsHeaderText");
        textoBotao.textContent = newTheme === "dark" ? "Modo Escuro" : "Modo Claro";
    });
}