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
        'H2O': 'https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExdjA2eWE0MzVyZm81czdkdWtqbTNnaHNobWpkOXRzM2hoaWRyMDg0bSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/W4p8ANgBSnmtAvIbaS/giphy.webp',    // Imagem para a molécula de água
        'CO2': 'https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHk5aGQ4enh6Y29oZm55dzdkMmZyN2poZTk4MDVmeGt4NXlqZGl1ZCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/nhMdWYN79qcNyqI7Q6/giphy.webp',    // Imagem para o dióxido de carbono
        'H2': ' https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS3MePc78yuyOe7YeZIeF7A3v3G3v2m6TKRMQ&s',     // Imagem para a molécula de hidrogênio
        'CH4': 'https://t4.ftcdn.net/jpg/03/02/46/37/360_F_302463704_Obue9Cf1wxXdNQmXSYxm8TrdouWzsbk6.jpg',    // Imagem para o metano
        'N2': 'https://c8.alamy.com/comp/BKTPRR/stickstoffmolekl-n2-nitrogen-molecule-n2-BKTPRR.jpg',     // Imagem para o nitrogênio molecular
        'O2': 'https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExbXhoZDRxN3MzODlmaW55Z29jM2lmc3Z2ZDBobjIzYzBnMmNjY3dmNyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/Pwqzq0rIefb644gD5f/giphy.webp',     // Imagem para o oxigênio molecular
        'NO': 'https://st2.depositphotos.com/4532731/9392/v/950/depositphotos_93922816-stock-illustration-no-nitric-oxide-molecule.jpg',     // Imagem para o monóxido de nitrogênio
        'NO2': 'https://as1.ftcdn.net/v2/jpg/03/15/50/86/1000_F_315508619_ijcnWTvj6FSzMlik8as51TrFdI7NFq4o.jpg',    // Imagem para o dióxido de nitrogênio
        'N2O': 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fstock.adobe.com%2Fbr%2Fimages%2Fnitrous-oxide-laughing-gas-n2o-molecule-it-is-used-such-as-a-pharmacologic-agent-to-produce-anesthesia-a-food-additive-as-a-propellant-structural-chemical-formula-and-molecule-model%2F314139162&psig=AOvVaw1ZaoZ_tOUKlWlwk4jGJXgI&ust=1725416083236000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCJDYq_jZpYgDFQAAAAAdAAAAABAE',    // Imagem para o óxido nitroso
        'SO2': 'https://homework.study.com/cimages/multimages/16/so2lewis729039065636398019.jpg',    // Imagem para o dióxido de enxofre
        'SO3': 'https://www.infoescola.com/wp-content/uploads/2019/06/img_5cf5820797c2e.png',    // Imagem para o trióxido de enxofre
        'H2S': 'https://media.licdn.com/dms/image/D5612AQEzddVw_rvHyA/article-cover_image-shrink_600_2000/0/1684238378687?e=2147483647&v=beta&t=23t6Ehp5iyHDd9CEuUQ9KpkVp6LT-r7mejfdZwPMe-I',    // Imagem para o sulfeto de hidrogênio
        'P4O10': 'https://upload.wikimedia.org/wikipedia/commons/8/84/Phosphorus-pentoxide-2D-dimensions.svg',  // Imagem para o tetrafosfato de decaóxido
        'Cl2': 'https://thumbs.dreamstime.com/b/mol%C3%A9cula-do-cloro-do-cl-65588656.jpg',    // Imagem para o cloro molecular
        'ClO': 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fen.wikipedia.org%2Fwiki%2FHypochlorite&psig=AOvVaw2NmOnaQ_sg0v-4nZv7a90e&ust=1725416249815000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCND97cbapYgDFQAAAAAdAAAAABAE',    // Imagem para o clorato
        'Cl2O': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSgv_qUXLa73KfzrsBBMkB44qK9oadvsyKVcg&s',   // Imagem para o óxido de dicloro
        'Br2': 'https://as1.ftcdn.net/v2/jpg/05/02/07/58/1000_F_502075877_YyIl16JpzHfhGPuJ0XxY3FB0ArB4p6fW.jpg',    // Imagem para o bromo molecular
        'I2': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSdYXJRq5Srz4mcBmnDwfQru6tCsBm4ZS9VEg&s',     // Imagem para o iodo molecular
        'I2O5': 'https://structimg.guidechem.com/1/13/16692.png',   // Imagem para o pentóxido de diiodo
        'Li2O': 'https://upload.wikimedia.org/wikipedia/commons/1/19/Lithium-oxide-unit-cell-3D-balls-B.png',
        'H2O2': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSvcg-lCpWRH7GSKGsVPCWjWZRDmJkq3ZvBGg&s',
        'ClO2': 'https://lh5.googleusercontent.com/proxy/cPqcV3ERGw1QTCaemFpf3XPbzrQNSK5bxl0wYt_8hcEaq-O6fultDC23-UybMY_dLbWAR6zfbTFwNGap4nUPJdP0f4PXfGyvh_AJ-EsjReQFwTHmrISaQ_SUuuV86fOyew     ',
        'NaCl': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSNW8O9Ce2gA2G6u4Vfw3bDV_gpwYPNlY5iKw&s',
        'NaOH': 'https://labnetwork.com.br/wp-content/uploads/2021/06/antonpaar.jpg',
        'CO': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJYgMVkbAbBNTKH1DdHrd9gtvuMbzRs2Xpyg&s',
        'C2': 'https://media.istockphoto.com/id/179236697/tr/foto%C4%9Fraf/c2-molecule.jpg?s=612x612&w=0&k=20&c=c029PV1J5GuEWuFNyPvOCkshxOydX7twMRtJTK_NbsQ=',
        'CH4': 'https://img.freepik.com/fotos-premium/ch4-metano-formula-quimica-3d-estrutura-quimica-ilustracao-3d_118019-2694.jpg',
        'C2H4': 'https://as2.ftcdn.net/v2/jpg/01/59/65/53/1000_F_159655329_svwYixwh2SYBfLN4cZzArLf77RKdDHLv.jpg',
        'C2H2': 'https://i.ytimg.com/vi/EGbTDmKH6Bo/maxresdefault.jpg',
        'C2H6': 'https://as1.ftcdn.net/v2/jpg/01/57/58/64/1000_F_157586420_ZVjS7dzeqPBFLQuuJICHQLiwHHxwfYC5.jpg',
        'F2': 'https://previews.123rf.com/images/alidm94/alidm942207/alidm94220700046/188361508-modelo-molecular-da-mol%C3%A9cula-de-fl%C3%BAor-f2-ilustra%C3%A7%C3%A3o-vetorial.jpg',
        'Cl2': 'https://as1.ftcdn.net/v2/jpg/03/16/19/58/1000_F_316195819_or0U9GF1Bovtqb3MJ2UbEQO8yuuNkThO.jpg',
        'Br2': 'https://as1.ftcdn.net/v2/jpg/05/02/07/58/1000_F_502075877_YyIl16JpzHfhGPuJ0XxY3FB0ArB4p6fW.jpg',
        'SO':'https://t4.ftcdn.net/jpg/00/98/93/75/360_F_98937543_0tsDMcAnrwWtZjHBtmHRmGFjjRBD6ZMx.jpg',
        'O3': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTcLQE1dBq5YuVhclbRBMTea06qMxOkU69QRA&s',
        'SO2':'https://img.freepik.com/vetores-premium/estrutura-da-molecula-de-dioxido-de-enxofre-so2-consistindo-de-enxofre-e-oxigenio-molecula-quimica_530733-2139.jpg',
        'SO3':'https://media.istockphoto.com/id/1221181300/vector/sulfur-trioxide-so3-molecule-model-and-chemical-formula.jpg?s=612x612&w=is&k=20&c=PoA2rVnuSzmgeZSaPNR-p3rIj9jBkyV5r4W2mk6rC7M='
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
        case 'Li2':
            dataMix = 'Li2,O,Li2O';
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
            dataMix = 'O,H2,H2O O,O,O2 O,O2,O3';
            break;
        case 'O2':
            dataMix = 'O2,O,O3';
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
        case 'Cl2':
            dataMix = 'Cl2,O,Cl2O';
            break;
            
        case 'C2':
            dataMix = 'C2,H,C2H4 C2,H,C2H6 C2,H,C2H2';
            break;

        // Bromo
        case 'Br2':
            dataMix = 'Br2,O,Br2O';
            break;

        // Iodo
        case 'I':
            dataMix = 'I,I,I2 I2,O,I2O5';
            break;
        case 'I2':
            dataMix = 'I2,O,I2O5';
            break;

        case 'NaCl':
        dataMix = 'NaCl,H2O,NaOH';
        break;

        default:
            dataMix = 'Nenhuma reação conhecida';
    }

    return dataMix;
}

