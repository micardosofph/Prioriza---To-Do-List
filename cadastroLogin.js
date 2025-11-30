const cadastroDiv = document.getElementById('cadastro');
const loginDiv = document.getElementById('login');
const toggleLogin = document.querySelector('.toggle-login');
const toggleCadastro = document.querySelector('.toggle-cadastro');
const textoFazerLoginCadastro = document.getElementById('fazerLoginCadastro-text');
const botaoFazerLoginCadastro = document.getElementById('fazerLoginCadastro-button');
const textoFazerLoginCadastroMobile = document.getElementById('fazerLoginCadastro-text-mobile');
const botaoFazerLoginCadastroMobile = document.getElementById('fazerLoginCadastro-button-mobile');

// DUDAAAAAAAAAAAAAAAAAAAAAAAAAA
if (window.location.hash === '#cadastro') {
    showCadastro();
} else {
    showLogin();
}

// Função para alternar telas com animação
function showCadastro() {
    loginDiv.classList.remove('active');
    cadastroDiv.classList.add('active');
    textoFazerLoginCadastro.textContent = 'Fazer login';
    botaoFazerLoginCadastro.onclick = showLogin;
    textoFazerLoginCadastroMobile.textContent = 'Fazer login';
    botaoFazerLoginCadastroMobile.onclick = showLogin;
    document.title = 'Cadastro';

    //DUDAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
    document.body.classList.add('cadastro');   // adiciona classe
    document.body.classList.remove('login');  // remove outra
}

function showLogin() {
    cadastroDiv.classList.remove('active');
    loginDiv.classList.add('active');
    textoFazerLoginCadastro.textContent = 'Cadastrar-se'
    botaoFazerLoginCadastro.onclick = showCadastro;
    textoFazerLoginCadastroMobile.textContent = 'Cadastrar-se'
    botaoFazerLoginCadastroMobile.onclick = showCadastro;
    document.title = 'Login';

    //DUDAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
    document.body.classList.add('login');
    document.body.classList.remove('cadastro');
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