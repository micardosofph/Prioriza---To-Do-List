document.addEventListener("DOMContentLoaded", () => {
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