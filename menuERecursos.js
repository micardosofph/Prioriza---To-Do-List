document.addEventListener("DOMContentLoaded", () => {
    funcionalidadesSite();
    modoClaroEscuro();
});

function modoClaroEscuro() {
    const modoClaroEscuroButton = document.getElementById("modoClaroEscuroButton"); // Botão no header
    const modoClaroEscuroMenuButton = document.getElementById("modoClaroEscuroMenuButton"); // <li> no menu hambúrguer
    const root = document.documentElement;
    const savedTheme = localStorage.getItem("theme");

    const updateButtonText = (button, theme) => { //atualiza o texto do botão dependendo do estado
        let textoElement;
        if (button.id === "modoClaroEscuroButton") {
            // para o header: procura o <span> com classe .buttonsHeaderText
            textoElement = button.querySelector(".buttonsHeaderText");
        } else if (button.id === "modoClaroEscuroMenuButton") {
            // para o menu hamburger: procura o <a> com classe .siteMenu-quem-somos
            textoElement = button.querySelector(".siteMenu-quem-somos");
        }
        if (textoElement) {
            textoElement.textContent = theme === "dark" ? "Modo Escuro" : "Modo Claro";
        }
    };

    // carrega o tema salvo e atualiza textos
    if (savedTheme) {
        root.setAttribute("data-theme", savedTheme);
        updateButtonText(modoClaroEscuroButton, savedTheme);
        updateButtonText(modoClaroEscuroMenuButton, savedTheme);
    }

    // alterna o tema
    const toggleTheme = () => {
        const currentTheme = root.getAttribute("data-theme");
        const newTheme = currentTheme === "dark" ? "light" : "dark";
        root.setAttribute("data-theme", newTheme);
        localStorage.setItem("theme", newTheme);
        updateButtonText(modoClaroEscuroButton, newTheme);
        updateButtonText(modoClaroEscuroMenuButton, newTheme);
    };

    // ao clicar nos botões muda o tema
    if (modoClaroEscuroButton) {
        modoClaroEscuroButton.addEventListener("click", toggleTheme);
    }
    if (modoClaroEscuroMenuButton) {
        modoClaroEscuroMenuButton.addEventListener("click", toggleTheme);
    }
}


//DUDAAAAAAAAAAAAAAAAAA 
function funcionalidadesSite() {
    const opcoes = document.querySelectorAll(".opcoesTopo .opcao");
    const conteudo = document.querySelectorAll(".mainContent .conteudo");

    opcoes.forEach((opcao, i) => {
        opcao.addEventListener("click", () => {
            // remove o ativo de todas as opções para n ter o underline
            opcoes.forEach(o => o.classList.remove("ativo"));
            conteudo.forEach(c => c.classList.remove("ativo"));

            //adiciona ativo na opção p/ aparecer o underline
            opcao.classList.add("ativo");

            //adiciona o conteudo de acordo com a opcao
            if (opcao.textContent.includes("INÍCIO")) {
                document.getElementById("inicioF").classList.add("ativo");
            } else if (opcao.textContent.includes("BUSCA")) {
                document.getElementById("buscaF").classList.add("ativo");
            } else if (opcao.textContent.includes("CALENDÁRIO")) {
                document.getElementById("calendarioF").classList.add("ativo");
            }
        });

    });
}

function toggleMenu() {//abre/fecha menu hamburger
    const menu = document.querySelector(".siteMenu");
    const overlay = document.getElementById("menuOverlay");
    const recursosOpcoes = document.querySelector(".dropdown-recursosMenuSite");
    const opcoes = document.querySelector(".submenu-recursosMenuSite");
    const botao = document.querySelector("#hamburgerButton");

    const abriu = menu.classList.toggle("ativo");

    //mostra/oculta overlay
    if (menu.classList.contains("ativo")) {
        overlay.classList.add("active"); // mostra overlay
        botao.classList.add("menu-open"); // mostra X
    } else {
        overlay.classList.remove("active"); // oculta overlay
        botao.classList.remove("menu-open"); // mostra hamburger
    }

    if (abriu) {
        document.onclick = function (e) {
            const clicouMenu = menu.contains(e.target);
            const clicouBotao = botao.contains(e.target);
            const clicouRecursos = recursosOpcoes.contains(e.target);

            // se clicar em recursos mostra as opções de baixo
            if (clicouRecursos) {
                opcoes.classList.toggle("ativo");
            } else {
                opcoes.classList.remove("ativo");
            }

            if (clicouMenu == false && clicouBotao == false) {
                menu.classList.remove("ativo");
                overlay.classList.remove("active"); //oculta overlay ao fechar
                botao.classList.remove("menu-open"); // reseta ícone
                document.onclick = null; // remove o evento
            }
        };
    }
}