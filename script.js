document.addEventListener("DOMContentLoaded", () => { //carrega funções ao terminar de carregar a página
    modoClaroEscuro();
    telaAgendadas();

    const botaoInicio = document.querySelector('.buttonsMenuOptions');
    mudarSecao(botaoInicio, 'tarefas');  //carrega a seção inicial(todas as tarefas)

    atualizaListaCategorias("#categorias-list"); //sidebar
    atualizaListaCategorias(".categorias-list"); //popup

    // define o minimo para os inputs de data como hoje
    const hoje = new Date().toISOString().split('T')[0];  // formato "aaaa-mm-dd"
    document.getElementById("agendar").setAttribute("min", hoje); //mínimo da data de uma tarefa é a data de hoje
    document.getElementById("agendarEditar").setAttribute("min", hoje); //mínimo da data de uma tarefa é a data de hoje
});





/* ==================================
   RELACIONADAS A TAREFA
===================================== */
function adicionaTarefa() {
    //pega todos os inputs e valores de cada input para adicionar a tarefa
    const inputTitulo = document.getElementById("tarefa");
    const inputTituloValue = inputTitulo.value.trim();
    const inputDescricao = document.getElementById("descricao");
    const inputDescricaoValue = inputDescricao.value.trim();
    const categoriaSelecionada = document.getElementById("categoriaSelecionada").value || "Sem categoria";
    const importante = document.querySelector(".tarefa-importante").classList.contains('ativo');
    const dataAgendada = document.getElementById("agendar").value;

    if (inputTituloValue === '') { //se título vazio para a função e dá alerta
        alert("O título da tarefa não pode estar vazio!");
        return;
    }

    const tarefa = { //objeto da tarefa com todas as informações importantes
        titulo: inputTituloValue,
        descricao: inputDescricaoValue,
        concluida: false,
        importante: importante,
        categoria: categoriaSelecionada,
        data: dataAgendada,
        id: Date.now()
    };

    //adiciona a tarefa no array guardado no localstorage com todas as tarefas salvas
    let tarefas = JSON.parse(localStorage.getItem("tarefas")) || [];
    tarefas.push(tarefa);
    localStorage.setItem("tarefas", JSON.stringify(tarefas));

    // renderiza na seção ativa (inicio)
    const listaAtiva = document.getElementById("lista-tarefasTodas");
    renderizarTarefa(tarefa, listaAtiva);

    //fecha o popup de adicionar tarefas e carrega a tela agendadas caso o usuário esteja no calendário 
    abrePopUpAdicionar();
    telaAgendadas();

    // recarrega tarefas na seção atual pra remover o texto nenhuma tarefa
    const secaoAtual = document.querySelector('.tarefas').style.opacity === '1' ? 'tarefas' :
        document.querySelector('.importantes').style.opacity === '1' ? 'importantes' :
            document.querySelector('.agendadas').style.opacity === '1' ? 'agendadas' : 'concluidas';
    carregarTarefasPorSecao(secaoAtual);

}



function renderizarTarefa(tarefa, lista) { //função usada para "construir" cada categoria com divs, checkboxs, labels, inputs
    const novaTarefa = document.createElement("li");
    novaTarefa.className = "tarefa";
    novaTarefa.dataset.id = tarefa.id;

    // buscar a cor da categoria salva
    let corCategoria = "#000000"; // cor padrão se não encontrar
    const categorias = JSON.parse(localStorage.getItem("categorias")) || [];
    const categoriaEncontrada = categorias.find(cat => cat.nome === tarefa.categoria);
    if (categoriaEncontrada) {
        corCategoria = categoriaEncontrada.cor;
    }

    // cria checkbox
    const checkBox = document.createElement("input");
    checkBox.type = "checkbox";
    checkBox.className = "checkBoxTarefa";
    checkBox.checked = tarefa.concluida;

    // cria título da tarefa
    const tituloTarefa = document.createElement("label");
    tituloTarefa.textContent = tarefa.titulo;
    tituloTarefa.className = "topTaskTitle";

    // deixa a tarefa riscada caso ela já esteja concluida
    if (tarefa.concluida) {
        tituloTarefa.style.textDecoration = "line-through";
        novaTarefa.style.opacity = "0.5";
    }

    // cria divs para as duas metades
    const containerMetades = document.createElement("div");
    containerMetades.className = "container-metades";

    // div da esquerda: categoria, importante e data
    const divEsquerda = document.createElement("div");
    divEsquerda.className = "metade-esquerda";

    // adiciona categoria
    const categoriaDiv = document.createElement("div");
    categoriaDiv.className = "categoria";
    // aplicar a cor da categoria na div na div
    const r = parseInt(corCategoria.slice(1, 3), 16);
    const g = parseInt(corCategoria.slice(3, 5), 16);
    const b = parseInt(corCategoria.slice(5, 7), 16);
    categoriaDiv.style.backgroundColor = `rgba(${r}, ${g}, ${b}, 0.35)`; // fundo meio transparente
    categoriaDiv.style.borderColor = corCategoria; // Borda sólida
    // cria hashtag da div com a cor da categoria e coloca cada elemento dentro do seu respectivo lugar
    const hashtagSvg = criarHashtagSVG(corCategoria);
    categoriaDiv.appendChild(hashtagSvg);
    const categoriaTexto = document.createElement("p");
    categoriaTexto.textContent = tarefa.categoria;
    categoriaTexto.className = "categoria-tarefa";
    categoriaDiv.appendChild(categoriaTexto);
    divEsquerda.appendChild(categoriaDiv);

    // adiciona div importante se a tarefa for importante
    if (tarefa.importante) {
        const importanteDiv = document.createElement("div");
        importanteDiv.className = "categoria-importante";
        const imagemImportante = document.createElement("img");
        imagemImportante.src = "images/exclamationImportant.png"
        const textoImportante = document.createElement("p");
        textoImportante.textContent = "Importante";
        textoImportante.className = "tarefa-importanteTexto";
        importanteDiv.appendChild(imagemImportante);
        importanteDiv.appendChild(textoImportante);
        divEsquerda.appendChild(importanteDiv);
    }

    // adiciona div data se a tarefa tiver data marcada
    if (tarefa.data && tarefa.data.trim() !== '') {
        const dataDiv = document.createElement("div");
        dataDiv.className = "categoria-data";
        const imagemData = document.createElement("img");
        imagemData.src = "images/date.png";
        imagemData.classList.add('categoria-data-imagem');
        const dataTexto = document.createElement("p");
        // formata data de "aaaa-mm-dd" para "dd/mm/aaaa"
        const [ano, mes, dia] = tarefa.data.split('-');
        dataTexto.textContent = `${dia}/${mes}/${ano}`;
        dataTexto.className = "tarefa-dataTexto";
        dataDiv.appendChild(imagemData);
        dataDiv.appendChild(dataTexto);
        divEsquerda.appendChild(dataDiv);
    }

    // div da esquerda: descrição
    const divDireita = document.createElement("div");
    divDireita.className = "metade-direita";
    const descricaoTarefa = document.createElement("p");
    descricaoTarefa.textContent = tarefa.descricao;
    descricaoTarefa.classList = "descricao-tarefa";
    divDireita.appendChild(descricaoTarefa);
    containerMetades.appendChild(divEsquerda);
    containerMetades.appendChild(divDireita);

    // cria os botões de editar e remover tarefa
    const editarBtn = document.createElement("div");
    editarBtn.classList.add('icon-images', 'big-icon-images');
    editarBtn.onclick = () => editaTarefa(tarefa.id);
    const editarImg = document.createElement("img");
    editarImg.src = "images/editTaskImage.svg";
    editarBtn.appendChild(editarImg);

    const removerBtn = document.createElement("div");
    removerBtn.classList.add('icon-images', 'big-icon-images');
    const removerImg = document.createElement("img");
    removerImg.src = "images/deleteTaskImage.svg";
    removerBtn.appendChild(removerImg);

    // cria a div topTask
    const topTask = document.createElement("div");
    topTask.className = "topTask";
    topTask.appendChild(checkBox);
    topTask.appendChild(tituloTarefa);
    const topTaskButtons = document.createElement("div");
    topTaskButtons.className = "topTask-buttons";
    topTaskButtons.appendChild(editarBtn);
    topTaskButtons.appendChild(removerBtn);
    topTask.appendChild(topTaskButtons);

    // monta a tarefa
    novaTarefa.appendChild(topTask);
    novaTarefa.appendChild(containerMetades);

    // quando houver mudança no checkbox ele altera o estado da tarefa e o visual dela
    checkBox.addEventListener("change", () => {
        tituloTarefa.style.textDecoration = checkBox.checked ? "line-through" : "none";
        novaTarefa.style.opacity = checkBox.checked ? "0.5" : "1";
        atualizarTarefa(tarefa.id, { concluida: checkBox.checked });
    });

    //cria um input que troca o titulo da tarefa para mudar o titulo ao dar double click no titulp
    tituloTarefa.addEventListener("dblclick", () => {
        const inputEdicao = document.createElement("input");
        inputEdicao.classList.add('tarefa-edicaoInput')
        inputEdicao.type = "text";
        inputEdicao.value = tituloTarefa.textContent;
        tituloTarefa.replaceWith(inputEdicao);
        inputEdicao.focus();
        inputEdicao.addEventListener("keydown", (e) => {
            if (e.key === "Enter") salvarEdicao(inputEdicao, tarefa.id);
        });
        inputEdicao.addEventListener("blur", () => salvarEdicao(inputEdicao, tarefa.id));
    });

    removerBtn.addEventListener("click", () => removeTarefa(tarefa.id));

    // adiciona nova tarefa na lista de tarefas
    lista.appendChild(novaTarefa);
}

function atualizarTarefa(id, updates) { //função para atualizar tarefa chamada ao clicar no chechbox de concluido ou ao editar uma tarefa
    let tarefas = JSON.parse(localStorage.getItem("tarefas")) || [];
    const tarefa = tarefas.find(t => t.id === id); //pega o id que foi passado como parametro e busca a tarefa com esse id no localstorage
    if (tarefa) { //se tarefa existe
        Object.assign(tarefa, updates); //modifica um objeto diretamente, cpassando como parâmetro a tarefa a editar/atualizar e as mudanças
        localStorage.setItem("tarefas", JSON.stringify(tarefas)); //
    }
}

function removeTarefa(id) { //remove a tarefa da lista e do local storage e mostra o aviso de tarefa excluida
    let tarefas = JSON.parse(localStorage.getItem("tarefas")) || [];
    tarefas = tarefas.filter(t => t.id !== id); //cria um novo array com todas as tarefas menos a excluida e atualiza a lista
    localStorage.setItem("tarefas", JSON.stringify(tarefas));
    document.querySelector(`[data-id="${id}"]`).remove();

    // recarrega tarefas na seção atual pra remover o texto nenhuma tarefa
    const secaoAtual = document.querySelector('.tarefas').style.opacity === '1' ? 'tarefas' :
        document.querySelector('.importantes').style.opacity === '1' ? 'importantes' :
            document.querySelector('.agendadas').style.opacity === '1' ? 'agendadas' : 'concluidas';
    carregarTarefasPorSecao(secaoAtual);
    barraTarefaExcluida(); //aviso tarefa excluida
}

function salvarEdicao(inputEdicao, id) { //função chamada ao salvar a edição de uma tarefa pelo doubleclick no titulo da tarefa (mesma logica da linha 208)
    const novoLabel = document.createElement("label");
    novoLabel.textContent = inputEdicao.value;
    novoLabel.className = "topTaskTitle";
    novoLabel.addEventListener("dblclick", () => {
        const inputEdicao = document.createElement("input");
        inputEdicao.type = "text";
        inputEdicao.value = novoLabel.textContent;
        novoLabel.replaceWith(inputEdicao);
        inputEdicao.focus();
        inputEdicao.addEventListener("keydown", (e) => {
            if (e.key === "Enter") salvarEdicao(inputEdicao, id);
        });
        inputEdicao.addEventListener("blur", () => salvarEdicao(inputEdicao, id));
    });
    inputEdicao.replaceWith(novoLabel);
    atualizarTarefa(id, { titulo: novoLabel.textContent });
}

function toggleImportante(button) { //alterna o botão importante no popup adicionar/editar tarefa entre ativado e desativado
    button.classList.toggle('ativo');
}










/* ==================================
   RELACIONADAS A POPUPS
===================================== */
function abrePopUpAdicionar() { //reseta os inputs internos e abre/fecha popup de adicionar tarefas e
    const wrapper = document.querySelector('.wrapper-categorias');
    const existente = wrapper.querySelector('.categoria-selecionada');
    if (existente) existente.remove(); //se há uma categoria selecionada antes no popup remove ela e deixa ele normal
    const botao = wrapper.querySelector('.buttonCategorias');
    if (botao) botao.style.display = 'flex';

    // reseta os inputs
    const tituloTarefa = document.getElementById('tarefa');
    const descricaoTarefa = document.getElementById('descricao');
    tituloTarefa.value = '';
    descricaoTarefa.value = '';
    // reseta o botão importante para inativo
    const buttonImportante = document.querySelector('.tarefa-importante');
    buttonImportante.classList.remove('ativo');
    const path = buttonImportante.querySelector('svg path');
    if (path) path.setAttribute('fill', 'black');
    // reseta o campo de data para vazio
    const campoData = document.getElementById('agendar');
    campoData.value = '';

    const popUpAdicionar = document.getElementById("popUpAdicionarTarefa");
    popUpAdicionar.classList.toggle("show");
    const categorias = document.querySelector(".categorias");
    categorias.classList.remove("show");
}


function abrePopUpBuscar() { //reseta os inputs e resultados da pesquisa anterios e abre/fecha o popup de buscar tarefa
    document.getElementById("search-input").focus();
    document.getElementById("search-input").value = '';
    document.getElementById("resultadosBusca").innerHTML = '';

    const popUpBuscar = document.getElementById("popUpBuscar");
    popUpBuscar.classList.toggle("show");
    const botaoBuscar = document.getElementById("botaoBuscar");
    botaoBuscar.classList.toggle("ativo");
}

function abrePopUpCategorias() { //abre popup com lista de categorias, dentro do popup ADICIONAR tarefa
    const categorias = document.querySelector(".categorias");
    const listaCategoria = document.querySelector('.lista-categoria');
    const novaCategoria = document.querySelector('.nova-categoria');
    const inputNome = document.getElementById('nomeNovaCategoria');

    // se o popup categorias ja está aberto(possui show), fecha
    if (categorias.classList.contains("show")) {

        // reseta as animações
        listaCategoria.classList.remove('slide-left', 'show');
        novaCategoria.classList.remove('show', 'slide-right');

        categorias.classList.add('close-down');

        setTimeout(() => {
            categorias.classList.remove("show", "close-down");
            inputNome.value = '';
        }, 300);

        return;
    }

    // abre o popup normalmente(não vai ter show no popup)
    categorias.classList.add("show");
    listaCategoria.classList.add("show");
    atualizaListaCategorias(".categorias-list");
}

function trocaPopUpCategorias() { //troca entre o popup de lista de categorias e o para criar categria nova, no popup de ADICIONAR tarefa
    const listaCategoria = document.querySelector('.lista-categoria');
    const novaCategoria = document.querySelector('.nova-categoria');

    listaCategoria.classList.remove('slide-left');
    novaCategoria.classList.remove('slide-right');

    if (novaCategoria.classList.contains('show')) {
        // voltar à lista
        novaCategoria.classList.remove('close', 'show');
        novaCategoria.classList.add('slide-right');
        document.querySelector('.lista-categoria').classList.remove('slide-left');
    } else {
        // ir para nova categoria
        listaCategoria.classList.add('slide-left');
        listaCategoria.classList.remove('show');
        novaCategoria.classList.add('show');
    }
}

function initHamburgerMenu() { //botão hamburger da to do list, chamado ao clicar no botão hamburger, via html, por aquele onclick
    const hamburgerButton = document.getElementById("hamburgerButton");
    const sideBar = document.getElementById("sideBar");

    // abre o menu(sidebar)
    sideBar.classList.toggle("ativo");
    hamburgerButton.classList.toggle("ativo");

    if (sideBar.classList.contains("ativo")) {
        sideBar.addEventListener("click", (e) => { //se o sidebar está ativo(só possivel estar ativo/não ativo em celulares) e você clica fora, ele fecha o sidebar
            if (e.target === sideBar) {
                fecharMenu();
            }
        });
    }

    // fecha o menu(sidebar)
    function fecharMenu() {
        sideBar.classList.remove("ativo");
        hamburgerButton.classList.remove("ativo");
    }

    // fecha o sidebar ao clicar em uma seção
    const menuItems = sideBar.querySelectorAll('.buttonsMenuOptions');
    menuItems.forEach(item => {
        item.addEventListener('click', fecharMenu);
    });
}










/* ==================================
   RELACIONADA A MODO CLARO/ESCURO
===================================== */
function modoClaroEscuro() { //chamado sempre ao abrir a página pra alternar entre o modo entre claro e escuro
    //pega todos os elementos importantes do html, botão, ícones e a pagina html pra mudar entre modo claro/escurp
    const modoClaroEscuroButton = document.getElementById("modoClaroEscuroButton");
    const root = document.documentElement;
    const sunIcon = document.getElementById("sun-icon");
    const moonIcon = document.getElementById("moon-icon");

    // verifica se tem algum tema salvo no localStorage e aplica ele
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) { // se tem algum tema ja salvo
        root.setAttribute("data-theme", savedTheme);
        // mostra o ícone certo com base no tema salvo
        if (savedTheme === "dark") { //escuro: lua
            sunIcon.style.display = "none";
            moonIcon.style.display = "block";
        } else { //claro: sol
            sunIcon.style.display = "block";
            moonIcon.style.display = "none";
        }
    } else {
        //se não tem nenhum tema salvo(primeira vez no site), ativa modo claro com sol visível
        root.setAttribute("data-theme", "light");
        sunIcon.style.display = "block";
        moonIcon.style.display = "none";
    }

    // evento de clique para alternar o tema e os ícones
    modoClaroEscuroButton.addEventListener("click", () => {
        const currentTheme = root.getAttribute("data-theme"); //tema atual
        const newTheme = currentTheme === "dark" ? "light" : "dark"; //tema novo, se antes de clicar era claro, novo tema escuro, e vice versa

        // aplica novo tema
        root.setAttribute("data-theme", newTheme);
        localStorage.setItem("theme", newTheme);

        // alterna a visibilidade dos ícones igual la em cima (linha 412)
        if (newTheme === "dark") {
            sunIcon.style.display = "none";
            moonIcon.style.display = "block";
        } else {
            sunIcon.style.display = "block";
            moonIcon.style.display = "none";
        }
    });
}










/* ==================================
   RELACIONADAS A CATEGORIAS
===================================== */
function criarCategoria() { //cria uma categoria nova, no popup ADICIONAR tarefa
    //pega inputs e valores para criar uma nova categoria
    const nomeInput = document.getElementById('nomeNovaCategoria');
    const corInput = document.getElementById('corNovaCategoria');
    const nome = nomeInput.value.trim();
    const cor = corInput.value;

    //se nome tá vazio dá alerta e retorna
    if (nome === '') {
        alert('Nome da categoria não pode estar vazio!');
        return;
    }

    //adiciona nova categoria no javascript
    let categorias = JSON.parse(localStorage.getItem('categorias')) || [];
    categorias.push({ nome: nome, cor: cor });
    localStorage.setItem('categorias', JSON.stringify(categorias));

    //atualiza as listas de categorias(sidebar e popup) e faz um debugzinho
    console.log("Chamando atualizaListaCategorias após criar categoria");
    atualizaListaCategorias(".categorias-list");
    atualizaListaCategorias("#categorias-list");

    //faz animação para voltar a lista de categorias
    const novaCategoria = document.querySelector('.nova-categoria');
    const listaCategoria = document.querySelector('.lista-categoria');
    novaCategoria.classList.add('close');
    setTimeout(() => {
        novaCategoria.classList.remove('close', 'show');
        novaCategoria.classList.add('slide-right');
        listaCategoria.classList.remove('slide-left');
        listaCategoria.classList.add('show');
    }, 300);

    //reseta inputs ao terminar de criar categoria
    nomeInput.value = '';
    corInput.value = '#000000';
}

function atualizaListaCategorias(seletorUl) { //renderiza a lista de categorias, chamada ao trocar de popup categoria ou ao abrir o popup categoria
    console.log(`Tentando atualizar ${seletorUl}`);
    const ul = document.querySelector(seletorUl);

    //pega todas as categorias do localstorage, debug e limpa a lista antes de renderizar atualizado
    let categorias = JSON.parse(localStorage.getItem("categorias")) || [];
    console.log(`Atualizando ${seletorUl} com ${categorias.length} categorias`);
    ul.innerHTML = "";

    if (categorias.length === 0) { //se não tem categoria mostra texto sem categoria
        const li = document.createElement("li");
        ul.innerHTML = '<li class= "mensagemSemCategorias">Nenhuma categoria</li>';
        ul.appendChild(li);
    } else { //se não, carrega as tarefas
        categorias.forEach(cat => {
            const divBolinhaNome = document.createElement("div");
            divBolinhaNome.classList.add("categoria-ladoEsquerdo");

            //item da categoria
            const li = document.createElement("li");
            li.classList.add("categoria-item");

            //circulo com a cor da categoria
            const circle = document.createElement("span");
            circle.className = "categoria-circulo";
            circle.style.backgroundColor = cat.cor;

            //nome da categoria
            const span = document.createElement("span");
            span.textContent = cat.nome;
            span.className = "categoria-nome";

            //cria lixeira e adiciona que ao click ele remove a categoria e mostra o aviso de categoria excluída 
            const divLixeiraHitbox = document.createElement("div");
            const lixeira = criarLixeiraSVG();
            divLixeiraHitbox.appendChild(lixeira);
            divLixeiraHitbox.classList.add("categoria-lixeiraWrapper");
            divLixeiraHitbox.addEventListener("click", (e) => {
                e.stopPropagation();
                removerCategoria(cat.nome);
                barraCategoriaExcluida()
            });

            //monta a categoria
            divBolinhaNome.appendChild(circle);
            divBolinhaNome.appendChild(span);
            li.appendChild(divBolinhaNome);
            li.appendChild(divLixeiraHitbox);

            // ao clicar na tarefa ele marca ela como selecionada
            if (seletorUl.includes(".categorias-list")) {
                li.addEventListener("click", () => {
                    if (seletorUl === ".categorias-list") { // se for o popup de ADICIONAR tarefa
                        document.getElementById("categoriaSelecionada").value = cat.nome;
                        atualizarVisualCategoria(cat);
                        abrePopUpCategorias();
                    } else if (seletorUl === ".editarTarefa-popup .categorias-list") { //se for o popup de EDITAR tarefa
                        document.getElementById("categoriaSelecionadaEditar").value = cat.nome;
                        atualizarVisualCategoriaEditar(cat, '.editarTarefa-popup .wrapper-categorias', 'categoriaSelecionadaEditar');
                        abrePopUpCategoriasEditar();
                    }
                });
            }
            ul.appendChild(li);
        });
    }
}


function removerCategoria(nome) { //recebe o nome da categoria, busca ela nas categorias do localstorage, remove ela usando um filtro que filtra por todas as cetegorias menos a excluida e atualiza as listas de categorias
    let categorias = JSON.parse(localStorage.getItem('categorias')) || [];
    categorias = categorias.filter(cat => cat.nome !== nome);
    localStorage.setItem('categorias', JSON.stringify(categorias));
    atualizaListaCategorias(".categorias-list");
    atualizaListaCategorias("#categorias-list");
}

function criarHashtagSVG(cor) { //chamada ao renderizar uma tarefa, pega a cor da categoria da tarefa e cria um svg da hashtag de categoria #
    const svgNS = "http://www.w3.org/2000/svg";
    const tamanho = 20;
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("width", tamanho);
    svg.setAttribute("height", tamanho);
    svg.setAttribute("viewBox", "0 0 18 18");
    svg.setAttribute("fill", "none");
    const path = document.createElementNS(svgNS, "path");
    path.setAttribute("d", "M2.33301 6.5H15.6663M2.33301 11.5H15.6663M7.33301 1.5L5.66634 16.5M12.333 1.5L10.6663 16.5");
    path.setAttribute("stroke", cor);
    path.setAttribute("stroke-width", "2");
    path.setAttribute("stroke-linecap", "round");
    path.setAttribute("stroke-linejoin", "round");
    svg.appendChild(path);
    return svg;
}

function criarLixeiraSVG() { //chamada ao renderizar uma categoria, cria um svg da lixeira na categoria
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    const tamanho = 24;
    svg.setAttribute("width", tamanho);
    svg.setAttribute("height", tamanho);
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("fill", "none");
    svg.classList.add("categoria-lixeira");
    svg.style.cursor = "pointer";
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", "M3 6H5M5 6H21M5 6V20C5 20.5304 5.21071 21.0391 5.58579 21.4142C5.96086 21.7893 6.46957 22 7 22H17C17.5304 22 18.0391 21.7893 18.4142 21.4142C18.7893 21.0391 19 20.5304 19 20V6M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M10 11V17M14 11V17");
    path.setAttribute("stroke-width", "2");
    path.setAttribute("stroke-linecap", "round");
    path.setAttribute("stroke-linejoin", "round");
    svg.appendChild(path);
    return svg;
}

function atualizarVisualCategoria(categoria) { //cria a resposta visual ao selecionar uma categoria ao CRIAR uma tarefa
    const wrapper = document.querySelector('.wrapper-categorias');
    // remove qualquer visual anterior se exitir
    const existente = wrapper.querySelector('.categoria-selecionada');
    if (existente) existente.remove();

    // cria o container
    const divSelecionada = document.createElement('div');
    divSelecionada.className = 'categoria-selecionada';
    // define as cores pelo css
    const r = parseInt(categoria.cor.slice(1, 3), 16);
    const g = parseInt(categoria.cor.slice(3, 5), 16);
    const b = parseInt(categoria.cor.slice(5, 7), 16);
    divSelecionada.style.setProperty('--r', r);
    divSelecionada.style.setProperty('--g', g);
    divSelecionada.style.setProperty('--b', b);
    divSelecionada.style.setProperty('--cor-borda', categoria.cor);

    //cria a hashtag da categoria selecionada com a cor da categoria
    const hashtagSvg = criarHashtagSVG(categoria.cor);
    divSelecionada.appendChild(hashtagSvg);

    //cria o texto da categoria com o título dela
    const texto = document.createElement('span');
    texto.textContent = categoria.nome;
    texto.classList.add('categoria-tarefa', 'categoria-tarefa-popUpAddEditar');
    divSelecionada.appendChild(texto);

    // adiciona ao wrapper que envolve tudo de categoria
    const botao = wrapper.querySelector('.buttonCategorias');
    botao.style.display = 'none'; // esconde o botão de "defina uma categoria"
    wrapper.appendChild(divSelecionada);
    divSelecionada.addEventListener('click', () => {
        abrePopUpCategorias(); // ao clicar nessa categoria selecionada, faz o que o botão "defina uma categoria" faria, abre o popup de categorias
    });
}










/* ==================================
   NAVEGAÇÃO ENTRE SEÇÕES
===================================== */
function mudarSecao(botaoClicado, secao) {
    const secoes = ['tarefas', 'importantes', 'agendadas', 'concluidas'];
    const buttons = document.querySelectorAll('.buttonsMenuOptions');

    // esconde todas as seções(troca a opacidade de todas as seções para 0)
    secoes.forEach(s => {
        const elemento = document.querySelector(`.${s}`); //s = seção, passada no parametro da função ao ser chamada
        elemento.style.opacity = '0';
        elemento.style.pointerEvents = 'none';
    });

    // remove a classe 'ativo' de todos os botões e adiciona ao clicado
    buttons.forEach(btn => btn.classList.remove('ativo'));
    botaoClicado.classList.add('ativo');

    // mostra a seção clicada
    const secaoAtiva = document.querySelector(`.${secao}`);
    secaoAtiva.style.opacity = '1';
    secaoAtiva.style.pointerEvents = 'auto';

    // marrega tarefas da seção clicada
    carregarTarefasPorSecao(secao);
}

function carregarTarefasPorSecao(secao) {
    const tarefas = JSON.parse(localStorage.getItem("tarefas")) || []; //pega todas as tarefas do localstorage, se não tiver, fala que é um array vazio
    let tarefasFiltradas = []; //cria um array que vai armazenar as tarefas da seção clicada

    //se seção importantes, filtra as importantes, se seção agendadas, abre o calendário, se seção concluídas, filtra concluídas, se não, filtra todas as tarefas(seção início)
    if (secao === 'importantes') {
        tarefasFiltradas = tarefas.filter(t => t.importante);
    } else if (secao === 'agendadas') {
        telaAgendadas(); //abre o calendario
    } else if (secao === 'concluidas') {
        tarefasFiltradas = tarefas.filter(t => t.concluida);
    } else {
        tarefasFiltradas = tarefas; //todas as tarefas
    }


    if (secao === 'agendadas') { //se seção agendadas, não mostra debug normal, porque não tem uma lista com tarefas agendadas
        console.log("Abrindo calendário")
    }
    else {
        // debug, mostra seção carregada, quantidade de tarefas no local storage e tarefas filtradas
        console.log(`Carregando seção: ${secao}, tarefas no localStorage:`, tarefas.length);
        console.log(`Tarefas filtradas:`, tarefasFiltradas.length);
    }

    // seleciona a lista(<ul>) fixa da seção
    const listaId = secao === 'tarefas' ? 'lista-tarefasTodas' : `lista-tarefas${secao.charAt(0).toUpperCase() + secao.slice(1)}`;
    const lista = document.getElementById(listaId);

    // limpa o conteúdo da lista da seção pra renderizar as tarefas mais novas e atualizadas
    lista.innerHTML = '';

    // renderiza as tarefas ou mensagem dentro da <ul>(caso não tenha tarefas filtradas)
    if (tarefasFiltradas.length === 0) { //se nao tiver tarefas filtradas, cria uma mensagem avisando
        const liMensagem = document.createElement("li");
        const singular = secao === 'importantes' ? ' importante.' : secao === 'agendadas' ? ' agendada.' : secao === 'concluidas' ? ' concluida.' : '.'; //dependendo da seção, mensagem diferente
        liMensagem.textContent = `Nenhuma tarefa${singular}`;
        liMensagem.className = "mensagemSemTarefas";
        lista.appendChild(liMensagem);
    } else {
        tarefasFiltradas.forEach(t => renderizarTarefa(t, lista));
    }
}

function telaAgendadas() {
    //pega todas os elementos importantes do html, setas, container dos dias e container do mes e ano
    const mesAno = document.getElementById('calendario-mesAno');
    const diasContainer = document.getElementById('calendario-dias');
    const btnAnterior = document.getElementById('calendario-mesAnterior');
    const btnProximo = document.getElementById('calendario-mesProximo');

    const meses = [ //todas as possibilidades de meses
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];

    let dataatual = new Date();

    function formatarData(data) { //converte o Date do javascript para um formato que o localstorage consegue salvar (AAAA-MM-DDTHH:mm:ss.sssZ para AAAA-MM-DD)
        const ano = data.getFullYear();
        const mes = String(data.getMonth() + 1).padStart(2, '0');
        const dia = String(data.getDate()).padStart(2, '0');
        return `${ano}-${mes}-${dia}`;
    }

    function temTarefasNaData(dataStr) {  //vreifica se há pelo menos uma data na data dada pelo parâmetro e retorna true ou false
        const tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];
        return tarefas.some(tarefa => tarefa.data === dataStr); //percorre o array e vê qual tarefa tem data igual a da data do parâmetro
    }

    function obterTarefasNaData(dataStr) {//faz um filter do array com todas as tarefas e filtra/retorna só as tarefas que batem com a data do parâmetro
        const tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];
        return tarefas.filter(tarefa => tarefa.data === dataStr);
    }

    function mostrarPopup(dataStr) {
        const popup = document.getElementById('popup-calendario');
        const titulo = document.getElementById('popup-titulo');
        const lista = document.getElementById('tarefas-popup');

        //mostra a data no popup no formato dd-mm-aaaa
        const [ano, mes, dia] = dataStr.split('-');
        const dataDisplay = `${dia}-${mes}-${ano}`;
        titulo.textContent = `Tarefas de ${dataDisplay}`;
        lista.innerHTML = ''; //esvazia a lista de tarefas no dia para mostrar a do dia clicado e remover qualquer coisa da lista do popup clicado anteriormente

        const tarefas = obterTarefasNaData(dataStr); //pega data do dia do quadrado clicado na página e pega as tarefas daquele dia
        if (tarefas.length === 0) { //se nãotem tarefas no dia ele mostra que não tem tarefa no dia
            lista.innerHTML = '<li>Nenhuma tarefa para este dia.</li>';
        } else {
            tarefas.forEach(tarefa => { //caso contrário, lista as tarefas do dia caso  haja
                const li = document.createElement('li');
                li.innerHTML = `
                    <p class="tarefa-popup-titulo">${tarefa.titulo}</p>
                    <p class="tarefa-popup-descricao">${tarefa.descricao || 'Sem descrição'}</p>
                    <p class="tarefa-popup-categoria">Categoria: ${tarefa.categoria || 'Sem categoria'}</p>
                `;
                lista.appendChild(li);
            });
        }

        popup.classList.add('show'); //mostra popup visualmente
    }

    function fecharPopup() { //fecha o popup deixando invisível
        document.getElementById('popup-calendario').classList.remove('show');
    }

    document.getElementById('fecha-popup').addEventListener('click', fecharPopup); //ao clicar no x do popup fecha ele

    function carregarcalendario(data) { //calcula os dias do mês, adiciona dias vazios, com tarefa(bolinha dentro do quadrado), dias do próximo mês e adiciiona clicks para abrir o popup
        const ano = data.getFullYear();
        const mes = data.getMonth();

        mesAno.textContent = `${meses[mes].toUpperCase()} ${ano}`;// mostra a mensagem do mês + ano (ex: NOVEMBRO 2025)

        diasContainer.innerHTML = ''; //esvazia os dias de quando a função foi chamada anteriormente para carregar de novo os dias atualizados

        const primeiroDiaMes = new Date(ano, mes, 1); //pega o primeiro dia do mes 
        const diaSemanaInicio = primeiroDiaMes.getDay(); //em que dia da semana começa o mês

        const ultimoDiaMes = new Date(ano, mes + 1, 0).getDate(); //último dia do mes
        const ultimoDiaMesAnterior = new Date(ano, mes, 0).getDate(); //último dia do mes anterior

        for (let i = diaSemanaInicio - 1; i >= 0; i--) { //para cada dia de mÊs anterior cria uma div de classe vazio
            const diaVazio = document.createElement('div');
            diaVazio.classList.add('dia', 'vazio');
            diaVazio.textContent = ultimoDiaMesAnterior - i;
            diasContainer.appendChild(diaVazio);
        }

        for (let dia = 1; dia <= ultimoDiaMes; dia++) { //para cada dia do mês atual, dia 1  até o último dia do mês atual ele vai criar dias
            //dia padrão
            const diaElemento = document.createElement('div');
            diaElemento.classList.add('dia');
            diaElemento.textContent = dia;

            //se a data do dia que está sendo criado agora pelo for bater com a data de hoje, cria um dia com estilização diferente, classe hoje
            const hoje = new Date();
            if (
                dia === hoje.getDate() &&
                mes === hoje.getMonth() &&
                ano === hoje.getFullYear()
            ) {
                diaElemento.classList.add('hoje');
            }

            //verifica se tem dia na data criada pelo for, se sim, cria uma bolinha sinalizando que há uma tarefa para aquele dia
            const dataDia = new Date(ano, mes, dia);
            const dataStr = formatarData(dataDia);
            if (temTarefasNaData(dataStr)) {
                const bolinha = document.createElement('div');
                bolinha.classList.add('bolinha');
                diaElemento.appendChild(bolinha);
            }

            //ao clicar em qualqurr dia, abre o popup passando como parâmetro a data do dia clicado
            diaElemento.addEventListener('click', () => mostrarPopup(dataStr));

            diasContainer.appendChild(diaElemento);
        }

        //calcula quantos dias ja foram mostrados até agora(dias de mês anterior e do mês atual) e depois completa os espaços faltantes pra não ficar espaços vazios na última seman e ficar bonitinho mostrando os primeiros dias do mês seguinte até acabar o espaço do mês atual
        const totalDiasExibidos = diaSemanaInicio + ultimoDiaMes;
        const diasFaltantes = totalDiasExibidos > 35 ? 42 - totalDiasExibidos : 35 - totalDiasExibidos;

        for (let i = 1; i <= diasFaltantes; i++) { //para cada dia que faltar para formar o formato bonitinho do calendário com sempre 35 ou 42 (multiplos de 7, uma semana) dias sendoi mostrado, pq não pode ficar espaços vazios na semana
            const diaProximo = document.createElement('div');
            diaProximo.classList.add('dia', 'proximo-mes');
            diaProximo.textContent = i;
            diasContainer.appendChild(diaProximo);
        }
    }

    carregarcalendario(dataatual); //intuitivo, carrega o calendário passando como parâmetro a data de hoje no formato estranho

    btnAnterior.addEventListener('click', () => { // ao clicar no botão de mes anterior diminui um do mês e carrega o calendário novamente
        dataatual.setMonth(dataatual.getMonth() - 1);
        carregarcalendario(dataatual);
    });

    btnProximo.addEventListener('click', () => {// ao clicar no botão de mês posterior aumenta um do mês e carrega o calendário novamente
        dataatual.setMonth(dataatual.getMonth() + 1);
        carregarcalendario(dataatual);
    });
};










/* ==================================
   RELACIONADAS A CATEGORIA LATERAL
===================================== */
function abrirPopupCategoriaLateral() { //abre popup categoria da sidebar, como só tem o de criar categoria, abre com focus no input de titulo da nova categoria
    const popup = document.getElementById('popup-adicionar-categoria-lateral');
    popup.classList.add('show');
    document.getElementById('nomeNovaCategoriaLateral').focus();
}

function fecharPopupCategoriaLateral() { //reseta os inputs e fecha o popup adicionar categoria da sidebar
    document.getElementById('nomeNovaCategoriaLateral').value = '';
    document.getElementById('corNovaCategoriaLateral').value = '#000000';
    // reseta inputs
    const popup = document.getElementById('popup-adicionar-categoria-lateral');
    popup.classList.remove('show');
}

function criarCategoriaLateral() { //mesma lógica de criar categoria no popup, mas com elementos html da sidebar, e sem o popup de lista de categorias, a lista já está no sidebar
    const nome = document.getElementById('nomeNovaCategoriaLateral').value.trim();
    const cor = document.getElementById('corNovaCategoriaLateral').value;

    if (nome === '') {
        alert('Nome da categoria não pode estar vazio!');
        return;
    }

    let categorias = JSON.parse(localStorage.getItem('categorias')) || [];
    categorias.push({ nome, cor });
    localStorage.setItem('categorias', JSON.stringify(categorias));
    console.log("Chamando atualizaListaCategorias após criar categoria lateral");
    atualizaListaCategorias(".categorias-list");
    atualizaListaCategorias("#categorias-list");
    fecharPopupCategoriaLateral();
}










/* ==================================
   RELACIONADAS A EDICAO DE TAREFAS
===================================== */
function editaTarefa(id) { //é chamada ao clicar no botão de editar uma tarefa na lista de tarefas ou na busca, completa os inputs com as informações da tarefa selecionada pra editar(titulo, descricao, categoria, importante ou não e data)
    abrePopUpEditar();

    const tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];
    const tarefaAtual = tarefas.find(t => String(t.id) === String(id));

    // preenche os campos mais fáceis de preencher, titulo, descrição e data
    document.getElementById("tarefaIdEditar").value = id;
    document.getElementById("tarefaEditar").value = tarefaAtual.titulo;
    document.getElementById("descricaoEditar").value = tarefaAtual.descricao;
    document.getElementById("agendarEditar").value = tarefaAtual.data;

    // completa categoria se tiver alguma categoria
    document.getElementById("categoriaSelecionadaEditar").value = tarefaAtual.categoria;
    const categorias = JSON.parse(localStorage.getItem("categorias")) || [];
    const categoriaEncontrada = categorias.find(cat => cat.nome === tarefaAtual.categoria);
    if (categoriaEncontrada && tarefaAtual.categoria !== "Sem categoria" && tarefaAtual.categoria.trim() !== "") {
        atualizarVisualCategoriaEditar(categoriaEncontrada, '.editarTarefa-popup .wrapper-categorias', 'categoriaSelecionadaEditar');
    } // se não tiver, não faz essa mudança no visual e deixa como no adicionar tarefa, "defina uma categoria"

    // adiciona ou remove a classe ativo ao botão de importante dependendo do estado da tarefa
    const btnImportante = document.getElementById("tarefa-importanteEditar");
    if (tarefaAtual.importante) {
        btnImportante.classList.add('ativo');
    } else {
        btnImportante.classList.remove('ativo');
    }
}

function salvarAEdicao() { //chamada ao clicar no botão salvar do popup editar tarefa
    //pega todos os valores dos inputs apenas do popup editar tarefa 
    const id = document.getElementById("tarefaIdEditar").value;
    const titulo = document.getElementById("tarefaEditar").value.trim();
    const descricao = document.getElementById("descricaoEditar").value.trim();
    const categoria = document.getElementById("categoriaSelecionadaEditar").value || "Sem categoria";
    const importante = document.getElementById("tarefa-importanteEditar").classList.contains('ativo');
    const dataAgendada = document.getElementById("agendarEditar").value;

    //se titulo vazio, alerta e retorna, não salva edições
    if (titulo === '') {
        alert("O campo de título está vazio!");
        return;
    }

    //pega todas as tarefas e o id da tarefa editada
    const tarefas = JSON.parse(localStorage.getItem("tarefas")) || [];
    const tarefaIndex = tarefas.findIndex(t => String(t.id) === String(id));

    // atualiza a tarefa com as edições
    tarefas[tarefaIndex] = { ...tarefas[tarefaIndex], titulo, descricao, categoria, importante, data: dataAgendada };
    localStorage.setItem("tarefas", JSON.stringify(tarefas));

    //alerta que a tarefa foi editada com sucesso
    alert("Tarefa editada com sucesso!");
    abrePopUpEditar();//fecha popup

    // recarrega tarefas na seção atual
    const secaoAtual = document.querySelector('.tarefas').style.opacity === '1' ? 'tarefas' :
        document.querySelector('.importantes').style.opacity === '1' ? 'importantes' :
            document.querySelector('.agendadas').style.opacity === '1' ? 'agendadas' : 'concluidas';
    carregarTarefasPorSecao(secaoAtual);
}


function atualizarVisualCategoriaEditar(categoria, wrapperSelector, hiddenInputId) {
    const wrapper = document.querySelector(wrapperSelector);  // passa o seletor como parâmetro

    // remove visual anterior
    const existente = wrapper.querySelector('.categoria-selecionada');
    if (existente) existente.remove();

    // atualiza o campo oculto com a categoria selecionada
    const hiddenInput = document.getElementById(hiddenInputId);
    if (hiddenInput) {
        hiddenInput.value = categoria.nome;
    }

    const divSelecionada = document.createElement('div');
    divSelecionada.className = 'categoria-selecionada';
    // define cores via variaveis css
    const r = parseInt(categoria.cor.slice(1, 3), 16);
    const g = parseInt(categoria.cor.slice(3, 5), 16);
    const b = parseInt(categoria.cor.slice(5, 7), 16);
    divSelecionada.style.setProperty('--r', r);
    divSelecionada.style.setProperty('--g', g);
    divSelecionada.style.setProperty('--b', b);
    divSelecionada.style.setProperty('--cor-borda', categoria.cor);

    //cria a hashtag da categoria selecionad com a cor
    const hashtagSvg = criarHashtagSVG(categoria.cor);
    divSelecionada.appendChild(hashtagSvg);

    //cria o texto do título da categoria selecionada
    const texto = document.createElement('span');
    texto.textContent = categoria.nome;
    texto.classList.add('categoria-tarefa', 'categoria-tarefa-popUpAddEditar');
    divSelecionada.appendChild(texto);

    // adiciona ao wrapper container da tarefa
    const botao = wrapper.querySelector('.buttonCategorias');
    if (botao) botao.style.display = 'none';  // esconde o botão dedfina uma categoria
    wrapper.appendChild(divSelecionada);

    //abre o popup no popup de editar tarefas
    divSelecionada.addEventListener('click', () => {
        abrePopUpCategoriasEditar();
    });
}

function criarCategoriaEditar() { //cria uma categoria nova, mas no popup EDITAR tarefa mesma lógica do popup adicionar tarefa, linha 458
    const nomeInput = document.getElementById('nomeNovaCategoriaEditar');
    const corInput = document.getElementById('corNovaCategoriaEditar');
    const nome = nomeInput.value.trim();
    const cor = corInput.value;
    if (nome === '') {
        alert('Nome da categoria não pode estar vazio!');
        return;
    }
    let categorias = JSON.parse(localStorage.getItem('categorias')) || [];
    categorias.push({ nome: nome, cor: cor });
    localStorage.setItem('categorias', JSON.stringify(categorias));
    console.log("Chamando atualizaListaCategorias após criar categoria editar");
    atualizaListaCategorias(".categorias-list");
    atualizaListaCategorias("#categorias-list");
    const novaCategoria = document.querySelector('.editarTarefa-popup .nova-categoria');
    novaCategoria.classList.add('close');
    setTimeout(() => {
        novaCategoria.classList.remove('close', 'show');
        novaCategoria.classList.add('slide-right');
        document.querySelector('.editarTarefa-popup .lista-categoria').classList.remove('slide-left');
    }, 300);
    nomeInput.value = '';
    corInput.value = '#000000';
}

function abrePopUpCategoriasEditar() { //abre popup com lista de categorias, dentro do popup EDITAR tarefa, mesma lógica mas com seletores do popup editar tarefa
    const categorias = document.querySelector('.editarTarefa-popup .categorias');
    const listaCategoria = document.querySelector('.editarTarefa-popup .lista-categoria');
    const novaCategoria = document.querySelector('.editarTarefa-popup .nova-categoria');
    const inputNome = document.getElementById('nomeNovaCategoriaEditar');

    if (categorias.classList.contains("show")) {
        listaCategoria.classList.remove('slide-left', 'show');
        novaCategoria.classList.remove('show', 'slide-right');

        categorias.classList.add('close-down');

        setTimeout(() => {
            categorias.classList.remove("show", "close-down");
            inputNome.value = '';
        }, 300);

        return;
    }

    categorias.classList.add("show");
    listaCategoria.classList.add("show");
    atualizaListaCategorias(".editarTarefa-popup .categorias-list");  // especifica a lista do popup de editar, porque o do popup de adicionar é atualizado ao abrir
}

function trocaPopUpCategoriasEditar() { //troca entre o popup de lista de categorias e o para criar categria nova, no popup de EDITAR tarefa, mesma lógica do de trocar popup no adicionar tarefa, mas com seletores do editar, linha 339
    const listaCategoria = document.querySelector('.editarTarefa-popup .lista-categoria');
    const novaCategoria = document.querySelector('.editarTarefa-popup .nova-categoria');

    listaCategoria.classList.remove('slide-left');
    novaCategoria.classList.remove('slide-right');

    if (novaCategoria.classList.contains('show')) {
        // voltar à lista
        novaCategoria.classList.remove('close', 'show');
        novaCategoria.classList.add('slide-right');
        document.querySelector('.lista-categoria').classList.remove('slide-left');
    } else {
        // ir para nova categoria
        listaCategoria.classList.add('slide-left');
        listaCategoria.classList.remove('show');
        novaCategoria.classList.add('show');
    }
}

function abrePopUpEditar() { //abre o popup de editar tarefa, semelhante ao de adicionar tarefa
    const wrapper = document.querySelector('.editarTarefa-popup .wrapper-categorias');
    const existente = wrapper.querySelector('.categoria-selecionada');
    if (existente) existente.remove();
    const botao = wrapper.querySelector('.buttonCategorias');
    if (botao) botao.style.display = 'flex';
    const popUpEditar = document.getElementById("popUpEditarTarefa");
    popUpEditar.classList.toggle("show");
    const categorias = document.querySelector(".categorias");
    categorias.classList.remove("show");
}










/* ==================================
   RELACIONADAS A PESQUISA DE TAREFAS
===================================== */
function pesquisarTarefas() {
    const texto = document.getElementById("search-input").value.trim().toLowerCase(); // tira espaços desnecessários e pega palavras maiúsculas e minúsculas
    const resultadosDiv = document.getElementById("resultadosBusca"); // pega a div que vai mostrar os resultados
    resultadosDiv.innerHTML = ""; // limpa resultados

    if (texto === "") return; // se for vazio retorna e nao mostra nada

    const tarefas = JSON.parse(localStorage.getItem("tarefas")) || []; // pega a lista de tarefas do localstorage

    const filtradas = tarefas.filter(t =>
        t.titulo.toLowerCase().includes(texto)// filtra para pegar apenas os titulos das tarefas e transforma em letra minuscula
    );

    if (filtradas.length === 0) {
        resultadosDiv.innerHTML = "<p class = 'buscarTarefa-NenhumaTarefaEncontrada'>Nenhuma tarefa encontrada.</p>"; //se nao tiver nenhuma tarefa filtrada mostra que não tem nenhuma tarefa com esse titulo
        return;
    }

    filtradas.forEach(tarefa => {
        resultadosDiv.appendChild(criarResultadoBusca(tarefa));// para cada tarefa filtrada renderiza elas
    });
}

function criarResultadoBusca(tarefa) {
    const div = document.createElement("div"); //cria o container do resultado da busca
    div.className = 'tarefaResultadosBusca';

    //cria o corpo do resultado da busca, com estilização dos elementos internos
    const corpoResultadoBusca = document.createElement("div");
    corpoResultadoBusca.className = "topTask";

    // cria checkbox e coloca o estado dela (concluido ou não)
    const checkBox = document.createElement("input");
    checkBox.type = "checkbox";
    checkBox.className = "checkBoxTarefa";
    checkBox.checked = tarefa.concluida;

    // cria título da tarefa
    const titulo = document.createElement("label");
    titulo.className = "topTaskTitleResultadosBusca";
    titulo.textContent = tarefa.titulo;

    // deixa a tarefa meio transparente se ela já está concluída
    if (tarefa.concluida) {
        titulo.style.textDecoration = "line-through";
        div.style.opacity = "0.5";
    }

    // quando o checkbox mudar de estado, verifica o estado e altera a aparencia da tarefa e atualiza no localstorage chamando a funcao atualizarTarefa
    checkBox.addEventListener("change", () => {
        titulo.style.textDecoration = checkBox.checked ? "line-through" : "none";
        div.style.opacity = checkBox.checked ? "0.5" : "1";
        atualizarTarefa(tarefa.id, { concluida: checkBox.checked });
    });

    //cria o botão para editar a tarefa
    const editTaskButton = document.createElement("div");
    editTaskButton.classList.add('icon-images', 'small-icon-images');

    const imagemEditar = document.createElement("img");
    imagemEditar.src = "images/editTaskImage.svg";
    editTaskButton.onclick = () => editaTarefa(tarefa.id); //ao clicar no botão chama afunção para editar a tarefa

    editTaskButton.appendChild(imagemEditar);

    // montar corpo do resultado: checkbox, título, botão editar tarefa
    corpoResultadoBusca.appendChild(checkBox);
    corpoResultadoBusca.appendChild(titulo);
    corpoResultadoBusca.appendChild(editTaskButton);

    div.appendChild(corpoResultadoBusca);

    return div;
}

function barraTarefaExcluida() { //relacionada ao popup de aviso ao excluir uma tarefa, mexe com a barra de tempo do aviso
    const barraPreenchida = document.getElementById("progressBarFilledTarefa");
    const aviso = document.querySelector(".avisoTarefaExcluida");

    // vonfigura a barra preenchida para iniciar em 100% e desabilitar a transição por enquanto para poder definir a largura da barra em 100% para não fazer a animação
    barraPreenchida.style.transition = 'none';
    barraPreenchida.style.width = '100%';

    // faz reflow (não entendi muito bem, mas faz o layout da página ser mudado automaticamente para evitar do aviso fazer a animação suave de transition)
    barraPreenchida.offsetHeight;

    // reabilita a transição
    barraPreenchida.style.transition = 'width 3s linear';

    //deixa o aviso visível
    aviso.classList.add("show");

    // inicia a barra de progresso depois um delay de 100ms
    setTimeout(() => {
        barraPreenchida.style.width = "0%";
    }, 100);

    // deixa o aviso invisível ao acabar o tempo da animação
    setTimeout(() => {
        aviso.classList.remove("show");
    }, 3100); // mesmo tempo da animação + delay
}

function barraCategoriaExcluida() { //relacionada ao popup de aviso ao excluir uma categoria, mexe com a barra de tempo do aviso, igual a de cima
    const barraPreenchida = document.getElementById("progressBarFilledCategoria");
    const aviso = document.querySelector(".avisoCategoriaExcluida");

    barraPreenchida.style.transition = 'none';
    barraPreenchida.style.width = '100%';

    barraPreenchida.offsetHeight;

    barraPreenchida.style.transition = 'width 3s linear';

    aviso.classList.add("show");

    setTimeout(() => {
        barraPreenchida.style.width = "0%";
    }, 100);

    setTimeout(() => {
        aviso.classList.remove("show");
    }, 3100);
}

document.getElementById("tarefa").addEventListener("keydown", function (event) { //se o usuário estiver digitandno nos inputs de adicionar/editar tarefa e clicar enter adiciona a tarefa 
    if (event.key === "Enter") {
        adicionaTarefa();
        event.preventDefault();
    }
});

document.getElementById("tarefaEditar").addEventListener("keydown", function (event) { //se o usuário estiver digitando nos inputs de editar tarefa e clicar enter edita a tarefa 
    if (event.key === "Enter") {
        salvarAEdicao();
        event.preventDefault();
    }
});