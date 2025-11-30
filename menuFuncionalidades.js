document.addEventListener("DOMContentLoaded", () => {
    funcionalidadesSite();
});

//DUDAAAAAAAAAAAAAAAAAA 
function funcionalidadesSite() {
    const opcoes = document.querySelectorAll(".opcoesTopo .opcao");
    const conteudo = document.querySelectorAll(".mainContent .conteudo");

    opcoes.forEach((opcao) => {
        opcao.addEventListener("click", () => {
            // Remove ativo de tudo
            opcoes.forEach(o => o.classList.remove("ativo"));
            conteudo.forEach(c => c.classList.remove("ativo"));

            // Marca a opção clicada
            opcao.classList.add("ativo");

            // Decide qual conteúdo ativar
            if (opcao.textContent.includes("PÁGINA INICIAL")) {
                document.getElementById("inicioF").classList.add("ativo");
            } else if (opcao.textContent.includes("BUSCA")) {
                document.getElementById("buscaF").classList.add("ativo");
            } else if (opcao.textContent.includes("CALENDÁRIO")) {
                document.getElementById("calendarioF").classList.add("ativo");
            } else if (opcao.textContent.includes("TAREFAS")) {
                document.getElementById("tarefasF").classList.add("ativo");
            } else if (opcao.textContent.includes("CATEGORIAS")) {
                document.getElementById("categoriasF").classList.add("ativo");
            } else if (opcao.textContent.includes("IMPORTANTE")) {
                document.getElementById("importanteF").classList.add("ativo");
            }
        });
    });
}


