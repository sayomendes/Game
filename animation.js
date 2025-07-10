
//Função criar lixos. Função é um conjunto de instruções que só sera executado quando for chamado.
function criarLixos() {

    var lake = document.getElementById("lake"); //Pegue o elemento com id="lake" e guarda na variavel lake. document.getElementById("lake") vai buscar no HTML quem tem esse id

    var image = [
        //Lista de array com os caminhos das imagens.

        ["./assets/lixos/metal/lata1.PNG", "metal"],
        ["./assets/lixos/metal/lata2.PNG", "metal"],
        ["./assets/lixos/metal/lata3.PNG", "metal"],
        ["./assets/lixos/metal/tesoura.PNG", "metal"],
        ["./assets/lixos/naoReciclavel/embalagemCosmetico.PNG", "naoReciclavel"],
        ["./assets/lixos/naoReciclavel/lampada.PNG", "naoReciclavel"],
        ["./assets/lixos/naoReciclavel/lampadaQuebrada.PNG", "naoReciclavel"],
        ["./assets/lixos/organico/banana.PNG", "organico"],
        ["./assets/lixos/organico/frango.PNG", "organico"],
        ["./assets/lixos/organico/maça.PNG", "organico"],
        ["./assets/lixos/papel/caixa.PNG", "papel"],
        ["./assets/lixos/papel/caixa2.PNG", "papel"],
        ["./assets/lixos/papel/papel.PNG", "papel"],
        ["./assets/lixos/papel/rolo.PNG", "papel"],
        ["./assets/lixos/plastico/borrifador.PNG", "plastico"],
        ["./assets/lixos/plastico/garrafa.PNG", "plastico"],
        ["./assets/lixos/vidro/garrafaVidro1.PNG", "vidro"],
        ["./assets/lixos/vidro/garrafaVidro2.png", "vidro"],
        ["./assets/lixos/vidro/jarra.PNG", "vidro"],
        ["./assets/lixos/vidro/pote.png", "vidro"]
    ];

    //Agora o for vai repetir o que esta dentro dele para cada imagem da lista.

    //Var i = 0 porque os arrays começam do zero
    //i < image.length enquanto i for menor que a quantidade de imagens, continua.
    //i++ soma 1 ao i a cada volta

    for (var i = 0; i < image.length; i++) {
        var img = document.createElement("img"); //Cria uma imagem no HTML
        img.src = image[i][0]; //Mostra a imagem da lista na posicção. Se i = 0, pega a primeira imagem. image[i] é a linha da lista e [0] pega o caminho da img.
        img.className = "trash"; //class css para style
        img.setAttribute("data-tipo", image[i][1]) //Armazena o tipo. [1] pega o tipo
        img.setAttribute("draggable", "true"); //Permitir arrastar com o mouse.

        img.ondragstart = function () {
            lixoAtual = this.getAttribute("data-tipo"); //Guarda o tipo de lixo arrastado
            lixoAtualElemento = this; //Guarda qual imagem está sendo arrastada
        };

        //Posição aleatoria

        img.style.position = "absolute"; //Permite colocar em qualquer ponto da tela
        img.style.width = "50px";
        img.style.left = Math.random() * (lake.clientWidth - 60) + "px";
        img.style.top = Math.random() * (lake.clientHeight - 60) + "px";

        lake.appendChild(img); //Coloca a img dentro do lago e aparece na tela
    }

}

window.onload = function () {
    criarLixos();

    //NOVIDADE - SOM DE FUNDO
    iniciarCronometro();

    var som = document.getElementById("somFundo")
    som.volume = 0.5; //colume de 0.0 a 1.0
    som.play().catch(function (erro) {
    console.log("Som bloqueado até a interação do usuário");
    });

}; 

// Criar o sistema "arrasta e solta" os lixos
var lixoAtual = null; //Guarda o tipo de lixo. null representa ausencia de valor.                                                  usencia de valor.
var lixoAtualElemento = null; //Guarda a img
var pontuacao = 0; //NOVIDADE

//Permitir soltar o lixo na lizeira
function permitirSoltar(evento) {
    evento.preventDefault(); //Manda o navegador permitir soltar
}

//Verificar o lixo com o tipo de lixeira correta
function soltarNaLixeira(evento, tipoLixeira) {
    evento.preventDefault();

    console.log("soltando:", lixoAtual, "em:", tipoLixeira);

    //Se o tipo de lixo for igual ao tipo de lixeira, remove a img do lixo da tela
    if (lixoAtual === tipoLixeira) {
        if (lixoAtualElemento) {
            pontuacao = pontuacao + 10; //NOVIDADE
            document.getElementById("pontuacao").textContent = "Pontuação: " + pontuacao; //NOVIDADE
            lixoAtualElemento.remove();
            
            var lixosRestantes = document.querySelectorAll(".trash");
            if (lixosRestantes.length === 0) {
                clearInterval(intervalo);
                mostrarTelaFinal(true);
            }
            
        }
    } else {
        mostrarNotificacao("Lixeira incorreta!")
    }

    //Precisa?
    lixoAtual = null;
    lixoAtualElemento = null;
}

function mostrarNotificacao(mensagem) {
    var notificacao = document.getElementById("notificacao");
    notificacao.textContent = mensagem;
    notificacao.classList.remove("oculto");
    notificacao.classList.add("visivel");

    setTimeout(function () {
        notificacao.classList.remove("visivel");
    }, 2000); // 2 segundos visível
}

var tempoRestante = 90;
var intervalo;

function iniciarCronometro() {
    var cronometro = document.getElementById("cronometro");
    intervalo = setInterval(function () {
        tempoRestante--;
        cronometro.textContent = "Tempo: " + tempoRestante + "s";

        if (tempoRestante <= 0) {
            clearInterval(intervalo);
            encerrarJogo();
        }
    }, 1000); // a cada 1 segundo
}

function mostrarTelaFinal(faseCompleta) {
    var telaFinal = document.getElementById("telaFinal");
    var planetildo = document.getElementById("planetildoResultado");
    var mensagem = document.getElementById("mensagemFinal");

    telaFinal.classList.remove("oculto");

    if (faseCompleta) {
        planetildo.src = "./assets/planetildo/alegre.png";
        mensagem.textContent = "Parabéns! Você salvou o lago!";
    } else {
        planetildo.src = "./assets/planetildo/triste.png";
        mensagem.textContent = "Oh não! O tempo acabou!";
    }
}
function encerrarJogo() {
    var lixosRestantes = document.querySelectorAll(".trash");
    if (lixosRestantes.length > 0) {
        clearInterval(intervalo); // parar o cronômetro
        mostrarTelaFinal(false); // false = não completou a fase
    }
}

function reiniciarFase() {
    location.reload(); // Recarrega a página
}