// Motorzinho de Alquimia
// Objetivos: Precisamos de um formato "simples" para que os alunos criem seu universo a partir dele:
let universo = {
  "fogo": {
    displayName: "Fogo",
    combinations: {
      "água": "vapor",
      "fogo": "sol"
    },
    isStartingItem: true,
    imageURL: "https://i.pinimg.com/564x/d4/f7/0a/d4f70aad8b4e1fa70216a0edba3b94ac.jpg"
  },
  "água": {
    displayName: "Água",
    combinations: {
      "fogo": "vapor",
      "vapor": "nuvem",
      "nuvem": "chuva"
    },
    isStartingItem: true,
    imageURL:"https://i.pinimg.com/564x/b4/9d/52/b49d52d31fc36f5bf0adb528789b084d.jpg"
  },
  "sol": {
    displayName: "Sol",
    combinations: {
      "chuva":"arcoiris"
    },
    isStartingItem: false,
    imageURL: "https://i.pinimg.com/564x/93/06/5e/93065e53a0ba979174d6de26387c4751.jpg"
  },
  "nuvem": {
    displayName: "Nuvem",
    combinations: {
      "água":"chuva"
    },
    isStartingItem: false,
    imageURL: "https://i.pinimg.com/564x/a7/89/0a/a7890a1e0d9ac4cf6cc0de6e0507543f.jpg"
  },
  "chuva": {
    displayName: "Chuva",
    combinations: {
      "sol":"arcoiris"
    },
    isStartingItem: false,
    imageURL: "https://i.pinimg.com/564x/35/0f/01/350f019c5ebc52179e073240acd496ea.jpg"
  },
  "arcoiris": {
    displayName: "Lgbt",
    combinations: {
    },
    isStartingItem: false,
    imageURL: "https://i.pinimg.com/564x/2e/74/7f/2e747f5f0a8253190b61d6a5619090a3.jpg"
  }, 
  "vapor": {
    displayName: "Vapor",
    combinations: {
      "água": "nuvem"
    },
    isStartingItem: false,
    imageURL: "https://i.pinimg.com/564x/e1/f6/40/e1f640c675ec89d64c971a00eca7d58f.jpg"
  }
}

let criarEstadoDoJogo = function(universo){
  let elementos = Object.keys(universo);
  let hidratarEl = function(elID, universo){
    let resultado = JSON.parse(JSON.stringify(universo[elID]));
    resultado.isDescoberto = resultado.isStartingItem;
    resultado.id = elID;
    return resultado;
  };

  let indescobertos = {};
  let descobertos = {};
  elementos.map(elID=>{
    if (universo[elID].isStartingItem){
      descobertos[elID] = hidratarEl(elID, universo);
    } else {
      indescobertos[elID] = hidratarEl(elID, universo); 
    }
  });
  let objJogo = {
    "descobertos": descobertos,
    "indescobertos": indescobertos,
    "universo": universo,
    "tentativas": 0,
    "misturas":[]
  };
  // obj.universo é um objeto com dados brutos -- use para procuras,
  // descobertos é um objeto de objetos com chaves .id e .descoberto
  // indescobertos é um objeto com chaves .id e .descoberto adicionadas
  // Eu vou procurar em indescobertos e MOVER PARA descobertos
  return objJogo;
};

let salvarJogo = function(estadoJogo){
  localStorage.setItem("salvarAlquimia", JSON.stringify(estadoJogo));
}

let carregarJogo = function(){
  let leituraLocal = localStorage.getItem("salvarAlquimia");
  if (!leituraLocal){
    return criarEstadoDoJogo(universo);
  }
  return JSON.parse(leituraLocal);
}

estadoJogo = carregarJogo();

let obterImg = function(elID){
  console.log("imagem para ",elID);
  return  `<img class="icone" src="${estadoJogo.universo[elID].imageURL}">`;
}

let renderizarMistura = function(){
  if (estadoJogo.misturas.length == 0){
    $("#mistura").html("");
    return;
  } else if (estadoJogo.misturas.length == 1){
    $("#mistura").html(`Misturar ${obterImg(estadoJogo.misturas[0])} com ???`);
  }
};

let descobrirNovo = function(novoEl){
  let indescoberto = estadoJogo.indescobertos[novoEl];
  if (indescoberto) {
    indescoberto.isDescoberto = true;
    delete estadoJogo.indescobertos[novoEl];
    estadoJogo.descobertos[novoEl] = indescoberto;
    renderizarDescobertos();
  }
}

let fazerMistura = function(){
  let doisEls = JSON.parse(JSON.stringify(estadoJogo.misturas));
  estadoJogo.misturas = [];

  // Verifica se os elementos são válidos
  if (estadoJogo.universo[doisEls[0]] && estadoJogo.universo[doisEls[1]]) {
    let combinacoes = estadoJogo.universo[doisEls[0]].combinations;

    // Verifica se há combinação definida
    if (combinacoes && combinacoes.hasOwnProperty(doisEls[1])) {
      let novoElemento = combinacoes[doisEls[1]];

      // Verifica se o novo elemento existe no universo
      if (estadoJogo.universo[novoElemento]) {
        if (!estadoJogo.descobertos.hasOwnProperty(novoElemento)) {
          $("#msg").html(`Parabéns! Você descobriu que ${obterImg(doisEls[0])} e ${obterImg(doisEls[1])} formam ${obterImg(novoElemento)}`);
          descobrirNovo(novoElemento);
        } else {
          $("#msg").html(`Você já descobriu que ${obterImg(doisEls[0])} e ${obterImg(doisEls[1])} formam ${obterImg(novoElemento)}`);
        }
      } else {
        console.error(`Novo elemento "${novoElemento}" não encontrado no universo.`);
      }
    } else {
      $("#msg").html(`Bem, ${obterImg(doisEls[0])} e ${obterImg(doisEls[1])} não se misturam`);
    }
  } else {
    console.error(`Elementos inválidos: ${doisEls[0]}, ${doisEls[1]}`);
  }
}

let misturarItem = function(evt){
  let elID = $(evt.currentTarget).attr("data-id");
  if (estadoJogo.misturas.length === 0){
    estadoJogo.misturas.push(elID);
  } else {
    // misturas tem 1 elemento
    estadoJogo.misturas.push(elID);
    fazerMistura();
  }
  return renderizarMistura();
}

let renderizarDescobertos = function(){ 
  let mostrarItem = function(oItem) {
    return `<div class="caixa-item" draggable="true" data-id="${oItem.id}">
              <div class="coluna">
                <p>${oItem.displayName}</p>
                <img class="icone" src="${oItem.imageURL}">
              </div>
              <button class="misturar" data-id="${oItem.id}">Misturar</button>
            </div>`;
  };
  $("#contador").html(`${Object.keys(estadoJogo.descobertos).length}/${Object.keys(estadoJogo.universo).length} coisas`);
  $("#descobertos").html("");
  $(".misturar").off("click");
  let chavesDescobertos = Object.keys(estadoJogo.descobertos);
  chavesDescobertos.map(elID=>{
    let oItem = estadoJogo.descobertos[elID];
    $("#descobertos").append(mostrarItem(oItem));
  });
  $(".misturar").on("click", misturarItem);  // Movido para dentro da função

  // Adiciona a classe "caixa-item" e atributo "draggable" aos elementos
  $(".caixa-item").addClass("caixa-item").attr("draggable", "true");

  $(".caixa-item").on("dragstart", function (event) {
    // Armazene o ID do elemento arrastado
    event.originalEvent.dataTransfer.setData("text/plain", $(this).attr("data-id"));
  });

  $(".caixa-item").on("dragover", function (event) {
    // Impede o comportamento padrão para permitir o soltar
    event.preventDefault();
  });

  $(".caixa-item").on("drop", function (event) {
    // Impede o comportamento padrão para permitir o soltar
    event.preventDefault();

    // Obtém o ID do elemento arrastado
    let draggedElement = event.originalEvent.dataTransfer.getData("text/plain");

    // Obtém o ID do elemento alvo
    let targetElement = $(this).attr("data-id");

    // Verifica se o universo possui o elemento arrastado e o elemento alvo
    if (
      estadoJogo.universo[draggedElement] &&
      estadoJogo.universo[targetElement] &&
      estadoJogo.universo[draggedElement].combinations &&
      estadoJogo.universo[draggedElement].combinations[targetElement]
    ) {
      // Realiza a mistura
      estadoJogo.misturas = [draggedElement, targetElement];
      fazerMistura();

      // Mostra o novo elemento descoberto
      descobrirNovo(estadoJogo.universo[draggedElement].combinations[targetElement]);

      // Atualiza a interface
      renderizarMistura();
      renderizarDescobertos();
    }
  });
};

renderizarDescobertos();