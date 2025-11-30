function toggleMenu() {//abre/fecha menu hamburger
    const menu = document.querySelector(".siteMenu");
    const overlay = document.getElementById("menuOverlay");
    const recursosOpcoes = document.querySelector(".dropdown-recursosMenuSite");
    const opcoes = document.querySelector(".submenu-recursosMenuSite");
    const botao = document.querySelector("#hamburgerButton");
    const iconeSeta = document.querySelector(".arrowIcon");

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
                iconeSeta.classList.toggle("ativo");

            } else {
                opcoes.classList.remove("ativo");
                iconeSeta.classList.remove("ativo");
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