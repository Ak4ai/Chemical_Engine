  let draggableElems = document.querySelectorAll(".draggable-element");
  let initialX = 0,
    initialY = 0;
  let moveElement = false;
  let deviceType = "";

  // Events Object
  let events = {
    mouse: {
      down: "mousedown",
      move: "mousemove",
      up: "mouseup",
    },
    touch: {
      down: "touchstart",
      move: "touchmove",
      up: "touchend",
    },
  };

  // Detect touch device
  const isTouchDevice = () => {
    try {
      document.createEvent("TouchEvent");
      deviceType = "touch";
      return true;
    } catch (e) {
      deviceType = "mouse";
      return false;
    }
  };

  isTouchDevice();

  const misturarElementos = (elementoSoltado) => {
    const areaMistura = document.querySelector('.dragging-area');

    if (!areaMistura) {
        console.error("A área de mistura não foi encontrada.");
        return;
    }

    const elemSoltadoRect = elementoSoltado.getBoundingClientRect();
    const areaRect = areaMistura.getBoundingClientRect();

    if (
        elemSoltadoRect.right >= areaRect.left &&
        elemSoltadoRect.left <= areaRect.right &&
        elemSoltadoRect.bottom >= areaRect.top &&
        elemSoltadoRect.top <= areaRect.bottom
    ) {
        const combinacoes = elementoSoltado.getAttribute('data-mix').split(' ');

        combinacoes.forEach(combinacao => {
            const [elemento1, elemento2, elementoResultante] = combinacao.split(',');

            const elem1 = document.querySelector(`.draggable-element[data-symbol="${elemento1}"]`);
            const elem2 = document.querySelector(`.draggable-element[data-symbol="${elemento2}"]`);

            if (elem1 && elem2) {
                const elem1Rect = elem1.getBoundingClientRect();
                const elem2Rect = elem2.getBoundingClientRect();

                if (
                    elem1Rect.right >= areaRect.left &&
                    elem1Rect.left <= areaRect.right &&
                    elem1Rect.bottom >= areaRect.top &&
                    elem1Rect.top <= areaRect.bottom &&
                    elem2Rect.right >= areaRect.left &&
                    elem2Rect.left <= areaRect.right &&
                    elem2Rect.bottom >= areaRect.top &&
                    elem2Rect.top <= areaRect.bottom
                ) {
                    // Verificar se o elemento resultante já existe
                    const existingElement = document.querySelector(`.draggable-element[data-symbol="${elementoResultante}"]`);

                    if (!existingElement) {
                        const newElement = document.createElement('div');
                        newElement.classList.add('draggable-element');
                        newElement.classList.add('element');
                        newElement.textContent = elementoResultante;
                        newElement.setAttribute('data-symbol', elementoResultante);

                        // Verificar se existe um data-mix para o novo elemento
                        const dataMixForNewElement = getDatamix(elementoResultante);
                        if (dataMixForNewElement) {
                            newElement.setAttribute('data-mix', dataMixForNewElement);
                        }
    
                        // Definir a posição inicial no centro da tela
                        const screenWidth = window.innerWidth;
                        const screenHeight = window.innerHeight;
                        const newElementWidth = 100; // largura do novo elemento (ajustar conforme necessário)
                        const newElementHeight = 100; // altura do novo elemento (ajustar conforme necessário)
                        newElement.style.left = `${(screenWidth - newElementWidth) / 2}px`;
                        newElement.style.top = `${(screenHeight - newElementHeight) / 4}px`;
                    
                        const newTooltip = document.createElement('div');
                        newTooltip.classList.add('main-tooltip');
                        const tooltipContent = getTooltipContent(elementoResultante); // Use a função para obter o conteúdo da tooltip
                        
                        // Certifique-se de que o tooltipContent é um nó DOM e adicione-o diretamente
                        newTooltip.appendChild(tooltipContent);

                        newElement.appendChild(newTooltip);

                        document.getElementById('container').appendChild(newElement);

                        makeDraggable(newElement);

                        // Adiciona event listeners para mostrar/ocultar os tooltips para o novo elemento
                        newElement.addEventListener('mouseenter', () => {
                            newTooltip.style.display = 'block';
                        });

                        newElement.addEventListener('mouseleave', () => {
                            newTooltip.style.display = 'none';
                        });

                        newElement.addEventListener('mousemove', event => {
                            const x = event.clientX;
                            const y = event.clientY;

                            newTooltip.style.left = `${x + 10}px`;
                            newTooltip.style.top = `${y + 10}px`;
                        });
                    }
                }
            }
        });
    }
};



// Função para tornar um elemento arrastável
  const makeDraggable = (elem) => {
    elem.addEventListener(events[deviceType].down, (e) => {
      e.preventDefault();
      initialX = !isTouchDevice() ? e.clientX : e.touches[0].clientX;
      initialY = !isTouchDevice() ? e.clientY : e.touches[0].clientY;
      moveElement = true;
    });

    elem.addEventListener(events[deviceType].move, (e) => {
      if (moveElement) {
        e.preventDefault();
        let newX = !isTouchDevice() ? e.clientX : e.touches[0].clientX;
        let newY = !isTouchDevice() ? e.clientY : e.touches[0].clientY;
        elem.style.top = elem.offsetTop - (initialY - newY) + "px";
        elem.style.left = elem.offsetLeft - (initialX - newX) + "px";
        initialX = newX;
        initialY = newY;
      }
    });

    elem.addEventListener(events[deviceType].up, () => {
      moveElement = false;

      // Verificar se o elemento está sobrepondo a área de mistura
      const areaMistura = document.querySelector('.dragging-area');
      const elemRect = elem.getBoundingClientRect();
      const areaRect = areaMistura.getBoundingClientRect();

      if (
        elemRect.right >= areaRect.left &&
        elemRect.left <= areaRect.right &&
        elemRect.bottom >= areaRect.top &&
        elemRect.top <= areaRect.bottom
      ) {
          misturarElementos(elem);
      }
    });

    elem.addEventListener("mouseleave", () => {
      moveElement = false;
    });
  };

// Aplicar funcionalidade de arrastar para todos os elementos arrastáveis
draggableElems.forEach((elem) => {
makeDraggable(elem);
});

// Adiciona event listeners para mostrar/ocultar os tooltips
const elements = document.querySelectorAll('.draggable-element');

elements.forEach(element => {
    const symbol = element.getAttribute('data-symbol');
    const tooltip = document.createElement('div');
    tooltip.classList.add('main-tooltip');

    element.addEventListener('mouseenter', () => {
        tooltip.innerHTML = ''; // Limpe qualquer conteúdo anterior
        const content = getTooltipContent(symbol);
        tooltip.appendChild(content); // Adicione o novo conteúdo como um nó DOM
        tooltip.style.display = 'block';
    });
    
    element.addEventListener('mouseleave', () => {
        tooltip.style.display = 'none';
    });

    element.addEventListener('mousemove', event => {
        const x = event.clientX;
        const y = event.clientY;

        tooltip.style.left = `${x + 10}px`;
        tooltip.style.top = `${y + 10}px`;
    });

    element.appendChild(tooltip); // Adiciona o tooltip ao elemento
});


// Função de debounce para otimizar eventos
function debounce(func, delay) {
    let timer;
    return function(...args) {
        clearTimeout(timer);
        timer = setTimeout(() => func.apply(this, args), delay);
    };
}
let angleOffsets = [];

function createAtomCanvas(electronConfiguration) {
    const canvas = document.createElement('canvas');
    canvas.width = 220; // Aumenta o tamanho do canvas para acomodar mais órbitas
    canvas.height = 140;
    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 3;
    const centerY = canvas.height / 2;

    // Determinar a escala com base no número de elétrons
    const electronCount = electronConfiguration.reduce((a, b) => a + b, 0);
    const scaleFactor = electronCount <= 2 ? 1.5 : 1;  // Aumenta 1.5x se houver 2 ou menos elétrons

    const nucleusRadius = 20 * scaleFactor;

    // Definir os raios das órbitas, aplicando a escala. Menos camadas, órbitas mais próximas
    const orbitRadii = [30 * scaleFactor, 45 * scaleFactor, 60 * scaleFactor, 75 * scaleFactor, 90 * scaleFactor, 105 * scaleFactor];

    // Garantir que o número de camadas não exceda o número de órbitas definidas
    electronConfiguration = electronConfiguration.slice(0, orbitRadii.length);

    // Array para armazenar os deslocamentos angulares para cada elétron
    const angleOffsets = electronConfiguration.map(numElectrons => 
        new Array(numElectrons).fill(0)
    );

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Desenhar núcleo
        ctx.beginPath();
        ctx.arc(centerX, centerY, nucleusRadius, 0, 2 * Math.PI, false);
        ctx.fillStyle = '#32CD32';
        ctx.fill();
        ctx.closePath();

        // Desenhar órbitas
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 1;
        orbitRadii.forEach((radius, index) => {
            if (index < electronConfiguration.length) {  // Desenhar órbita apenas se houver elétrons nessa camada
                ctx.beginPath();
                ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
                ctx.stroke();
                ctx.closePath();
            }
        });

        // Desenhar elétrons
        electronConfiguration.forEach((numElectrons, orbitIndex) => {
            let angleStep = 2 * Math.PI / numElectrons;

            for (let i = 0; i < numElectrons; i++) {
                angleOffsets[orbitIndex][i] += 0.02; // Movimento contínuo dos elétrons
                let angle = i * angleStep + angleOffsets[orbitIndex][i];
                let electronX = centerX + orbitRadii[orbitIndex] * Math.cos(angle);
                let electronY = centerY + orbitRadii[orbitIndex] * Math.sin(angle);

                ctx.beginPath();
                ctx.arc(electronX, electronY, 5 * scaleFactor, 0, 2 * Math.PI, false);
                ctx.fillStyle = '#B0C4DE';
                ctx.fill();
                ctx.closePath();
            }
        });

        requestAnimationFrame(draw);
    }

    draw(); // Inicia a animação
    return canvas;
}

function getTooltipContent(symbol) {
    let tooltipContainer, canvasContainer, textContainer;
    const moleculeImages = {
        'H2O': '',    // Imagem para a molécula de água
        'CO2': '',    // Imagem para o dióxido de carbono
        'H2': ' https://upload.wikimedia.org/wikipedia/commons/c/c2/Water_molecule_rotation_animation_large.gif',     // Imagem para a molécula de hidrogênio
        'CH4': '',    // Imagem para o metano
        'N2': '',     // Imagem para o nitrogênio molecular
        'O2': '',     // Imagem para o oxigênio molecular
        'NO': '',     // Imagem para o monóxido de nitrogênio
        'NO2': '',    // Imagem para o dióxido de nitrogênio
        'N2O': '',    // Imagem para o óxido nitroso
        'SO2': '',    // Imagem para o dióxido de enxofre
        'SO3': '',    // Imagem para o trióxido de enxofre
        'H2S': '',    // Imagem para o sulfeto de hidrogênio
        'P4O10': '',  // Imagem para o tetrafosfato de decaóxido
        'Cl2': '',    // Imagem para o cloro molecular
        'ClO': '',    // Imagem para o clorato
        'Cl2O': '',   // Imagem para o óxido de dicloro
        'Br2': '',    // Imagem para o bromo molecular
        'I2': '',     // Imagem para o iodo molecular
        'I2O5': '',   // Imagem para o pentóxido de diiodo
    };
    
    

    // Verifica se o símbolo corresponde a uma molécula com uma imagem
    if (moleculeImages[symbol]) {
        tooltipContainer = document.createElement('div');
        tooltipContainer.classList.add('tooltip');
        tooltipContainer.dataset.symbol = symbol;
        tooltipContainer.style.width = '422px';
        tooltipContainer.style.display = 'flex';
        tooltipContainer.style.alignItems = 'center';

        const imageContainer = document.createElement('div');
        imageContainer.style.flex = '0 0 30px';
        imageContainer.style.textAlign = 'center';
        imageContainer.classList.add('image-container');
        
        const image = document.createElement('img');
        image.src = moleculeImages[symbol];
        image.alt = symbol;
        image.style.width = '100px'; // Ajuste o tamanho conforme necessário
        imageContainer.appendChild(image);

        textContainer = document.createElement('div');
        textContainer.style.flex = '1';
        textContainer.style.marginLeft = '12px';
        textContainer.classList.add('text-container');
        textContainer.innerHTML = `
            <div style="text-transform: uppercase; font-weight: bold; color: #FFF; font-size: 2vh;">
                ${symbol}
            </div>
            <div style="font-style: italic; font-size: xx-small;">
                Molecula
            </div>
            <div style="font-size: small;">
                ${getElementInfo(symbol)} <!-- Pode ser ajustado conforme a necessidade para moléculas -->
            </div>
        `;

        tooltipContainer.appendChild(imageContainer);
        tooltipContainer.appendChild(textContainer);

        return tooltipContainer; // Retorna o elemento HTML completo
    }

    // Configurações de elétrons para cada elemento
    const electronConfigurations = {
        'H': [1],          // Hidrogênio
        'He': [2],         // Hélio
        'Li': [2, 1],      // Lítio
        'Be': [2, 2],      // Berílio
        'B': [2, 3],       // Boro
        'C': [2, 4],       // Carbono
        'N': [2, 5],       // Nitrogênio
        'O': [2, 6],       // Oxigênio
        'F': [2, 7],       // Flúor
        'Ne': [2, 8],      // Neônio
        'Na': [2, 8, 1],   // Sódio
        'K': [2, 8, 8, 1], // Potássio
        'Ca': [2, 8, 8, 2],// Cálcio
        'S': [2, 8, 6],    // Enxofre
        'P': [2, 8, 5],    // Fósforo
        'Cl': [2, 8, 7],   // Cloro
        'Br': [2, 8, 18, 7], // Bromo
        'I': [2, 8, 18, 18, 7], // Iodo
    };

    // Criação do canvas para a animação do átomo
    if (electronConfigurations[symbol]) {
        atomCanvas = createAtomCanvas(electronConfigurations[symbol]);
    }

    tooltipContainer = document.createElement('div');
    tooltipContainer.classList.add('tooltip');
    tooltipContainer.dataset.symbol = symbol;
    tooltipContainer.style.width = '422px';
    tooltipContainer.style.display = 'flex';
    tooltipContainer.style.alignItems = 'center';

    canvasContainer = document.createElement('div');
    canvasContainer.style.flex = '0 0 30px';
    canvasContainer.style.textAlign = 'center';
    canvasContainer.classList.add('canvas-container');
    if (atomCanvas) {
        canvasContainer.appendChild(atomCanvas);
    }

    textContainer = document.createElement('div');
    textContainer.style.flex = '1';
    textContainer.style.marginLeft = '-42px';
    textContainer.classList.add('text-container');
    textContainer.innerHTML = `
        <div style="text-transform: uppercase; font-weight: bold; color: #FFF; font-size: 2vh;">
            ${symbol}
        </div>
        <div style="font-style: italic; font-size: xx-small;">
            Elemento Quimico
        </div>
        <div style="font-size: small;">
            ${getElementInfo(symbol)}
        </div>
    `;

    tooltipContainer.appendChild(canvasContainer);
    tooltipContainer.appendChild(textContainer);

    return tooltipContainer; // Retorna o elemento HTML completo
}




function getElementInfo(symbol) {
    const elementInfo = {
        // Informações para elementos químicos
        'H': 'MA: 1,008 <br> RA: 1 <br> VM: 1,20×10-5 m3/mol <br> Config E: 1s1',
        'He': 'MA: 4,0026 <br> RA: 2 <br> VM: 2,18×10-5 m3/mol <br> Config E: 1s2',
        'Li': 'MA: 6,94 <br> RA: 1(3) <br> VM: 1,82×10-5 m3/mol <br> Config E: 1s2 2s1',
        'Be': 'MA: 9,0122 <br> RA: 2(4) <br> VM: 4,28×10-5 m3/mol <br> Config E: 1s2 2s2',
        'B': 'MA: 10,81 <br> RA: 2(5) <br> VM: 2,64×10-5 m3/mol <br> Config E: 1s2 2s2 2p1',
        'C': 'MA: 12,01 <br> RA: 2(6) <br> VM: 1,00×10-5 m3/mol <br> Config E: 1s2 2s2 2p2',
        'N': 'MA: 14,01 <br> RA: 2(7) <br> VM: 1,04×10-5 m3/mol <br> Config E: 1s2 2s2 2p3',
        'O': 'MA: 16,00 <br> RA: 2(8) <br> VM: 1,43×10-5 m3/mol <br> Config E: 1s2 2s2 2p4',
        'F': 'MA: 18,998 <br> RA: 2(9) <br> VM: 1,40×10-5 m3/mol <br> Config E: 1s2 2s2 2p5',
        'Ne': 'MA: 20,18 <br> RA: 2(10) <br> VM: 1,74×10-5 m3/mol <br> Config E: 1s2 2s2 2p6',
        'Na': 'MA: 22,99 <br> RA: 1(8,1) <br> VM: 1,47×10-5 m3/mol <br> Config E: 1s2 2s2 2p6 3s1',
        'K': 'MA: 39,10 <br> RA: 1(8,1) <br> VM: 1,55×10-5 m3/mol <br> Config E: 1s2 2s2 2p6 3s2 3p6 4s1',
        'Ca': 'MA: 40,08 <br> RA: 1(8,2) <br> VM: 1,83×10-5 m3/mol <br> Config E: 1s2 2s2 2p6 3s2 3p6 4s2',
        'S': 'MA: 32,07 <br> RA: 2(8,6) <br> VM: 2,77×10-5 m3/mol <br> Config E: 1s2 2s2 2p6 3s2 3p4',
        'P': 'MA: 30,97 <br> RA: 2(8,5) <br> VM: 1,00×10-5 m3/mol <br> Config E: 1s2 2s2 2p6 3s2 3p5',
        'Cl': 'MA: 35,45 <br> RA: 2(8,7) <br> VM: 2,48×10-5 m3/mol <br> Config E: 1s2 2s2 2p6 3s2 3p5',
        'Br': 'MA: 79,90 <br> RA: 2(8,18,7) <br> VM: 3,44×10-5 m3/mol <br> Config E: 1s2 2s2 2p6 3s2 3p6 4s2 3d10 4p5',
        'I': 'MA: 126,90 <br> RA: 2(8,18,18,7) <br> VM: 5,09×10-5 m3/mol <br> Config E: 1s2 2s2 2p6 3s2 3p6 4s2 3d10 4p6 5s2 4d10 5p5',

        // Informações para moléculas resultantes
        'H2': 'MA: 2,016 <br> RA: N/A <br> VM: 1,04×10-5 m3/mol ',
        'H2O': 'MA: 18,015 <br> RA: N/A <br> VM: 1,82×10-5 m3/mol ',
        'CO2': 'MA: 44,01 <br> RA: N/A <br> VM: 3,3×10-5 m3/mol ',
        'CH4': 'MA: 16,04 <br> RA: N/A <br> VM: 1,06×10-5 m3/mol ',
        'NO': 'MA: 30,01 <br> RA: N/A <br> VM: 2,74×10-5 m3/mol ',
        'NO2': 'MA: 46,01 <br> RA: N/A <br> VM: 2,18×10-5 m3/mol ',
        'N2O': 'MA: 44,01 <br> RA: N/A <br> VM: 3,7×10-5 m3/mol ',
        'O2': 'MA: 32,00 <br> RA: N/A <br> VM: 2,12×10-5 m3/mol ',
        'FO2': 'MA: 52,00 <br> RA: N/A <br> VM: 3,5×10-5 m3/mol ',
        'SO2': 'MA: 64,07 <br> RA: N/A <br> VM: 2,77×10-5 m3/mol ',
        'SO3': 'MA: 80,06 <br> RA: N/A <br> VM: 2,81×10-5 m3/mol ',
        'H2S': 'MA: 34,08 <br> RA: N/A <br> VM: 4,10×10-5 m3/mol ',
        'P4O10': 'MA: 283,88 <br> RA: N/A <br> VM: 5,65×10-5 m3/mol ',
        'Cl2O': 'MA: 86,90 <br> RA: N/A <br> VM: 4,00×10-5 m3/mol ',
        'Br2O': 'MA: 159,81 <br> RA: N/A <br> VM: 5,85×10-5 m3/mol ',
        'I2O5': 'MA: 333,81 <br> RA: N/A <br> VM: 6,40×10-5 m3/mol '
    };

    return elementInfo[symbol] || 'Informações não disponíveis'; // Retorna informações específicas ou uma mensagem padrão
}




function getDatamix(symbol) {
    let dataMix = ''; // Inicializa a string de data-mix vazia

    switch (symbol) {
        // Hidrogênio
        case 'H':
            dataMix = 'H,H,H2';
            break;
        case 'H2':
            dataMix = 'H2,O,H2O';
            break;
        case 'H2O':
            dataMix = 'H2O,O2,H2O2';
            break;

        // Hélio
        case 'He':
            dataMix = 'He';
            break;

        // Lítio
        case 'Li':
            dataMix = 'Li,O,Li2O';
            break;

        // Berílio
        case 'Be':
            dataMix = 'Be,O,BeO';
            break;

        // Boro
        case 'B':
            dataMix = 'B,O,BO B,O,B2O3';
            break;

        // Carbono
        case 'C':
            dataMix = 'C,O,CO C,O,CO2 C,H,CH4';
            break;

        // Nitrogênio
        case 'N':
            dataMix = 'N,N,N2 N,O,NO N,O2,NO2 N2,O,N2O';
            break;

        // Oxigênio
        case 'O':
            dataMix = 'O,H2,H2O O,O,O2';
            break;

        // Flúor
        case 'F':
            dataMix = 'F,F,F2, F,O2,FO2';
            break;

        // Neônio
        case 'Ne':
            dataMix = 'Ne';
            break;

        // Sódio
        case 'Na':
            dataMix = 'Na,O,Na2O';
            break;

        // Potássio
        case 'K':
            dataMix = 'K,O,K2O';
            break;

        // Cálcio
        case 'Ca':
            dataMix = 'Ca,O,CaO';
            break;

        // Enxofre
        case 'S':
            dataMix = 'S,O2,SO2 S,O3,SO3 S,H2,H2S';
            break;

        // Fósforo
        case 'P':
            dataMix = 'P,O,P4O10';
            break;

        // Cloro
        case 'Cl':
            dataMix = 'Cl,Cl,Cl2 Clo,O,ClO Cl2,O,Cl2O';
            break;

        // Bromo
        case 'Br':
            dataMix = 'Br2,O,Br2O';
            break;

        // Iodo
        case 'I':
            dataMix = 'I2,O,I2O5';
            break;

        default:
            dataMix = 'Nenhuma reação conhecida';
    }

    return dataMix;
}

