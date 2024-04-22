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

                        
    
                        // Definir a posição inicial no centro da tela
                        const screenWidth = window.innerWidth;
                        const screenHeight = window.innerHeight;
                        const newElementWidth = 100; // largura do novo elemento (ajustar conforme necessário)
                        const newElementHeight = 100; // altura do novo elemento (ajustar conforme necessário)
                        newElement.style.left = `${(screenWidth - newElementWidth) / 2}px`;
                        newElement.style.top = `${(screenHeight - newElementHeight) / 2}px`;
                    
                        const newTooltip = document.createElement('div');
                        newTooltip.classList.add('main-tooltip');
                        const tooltipContent = getTooltipContent(elementoResultante); // Use a função para obter o conteúdo da tooltip
                        newTooltip.innerHTML = tooltipContent;

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
      const tooltip = element.querySelector('.main-tooltip');
      const symbol = element.getAttribute('data-symbol');

      element.addEventListener('mouseenter', () => {
          tooltip.style.display = 'block';
          tooltip.innerHTML = getTooltipContent(symbol);
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
  });

  // Função para obter o conteúdo da tooltip com base no símbolo do elemento
  function getTooltipContent(symbol) {
      // Aqui você pode adicionar lógica para obter o conteúdo da tooltip com base no símbolo do elemento
      // Por enquanto, estou fornecendo um exemplo estático para demonstração
      if (symbol === 'H') {
          return `
              <table>
                  <tr>
                      <td rowspan="2" style="width: 60px;">
                          <img src="https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExcXZ5ZXloMjVwb3gyd3k0bmsyZDU4aDU2bjg3c3IwbGVlNTN1cWloNiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/VbQk7UzSrryWjuF7Yb/giphy.gif" alt="Hidrogenio" style="width: 60px;">
                      </td>
                      <td style="text-transform: uppercase; font-weight: bold; color: #FFF; font-size: 3vh;">Hidrogenio</td>
                  </tr>
                  <tr>
                      <td style="font-style: italic; font-size: xx-small;">Elemento Quimico</td>
                  </tr>
                  <tr>
                      <td colspan="2">MA: 1,008 <br>RA: 25(53) <br>VM: 1,14×10-5 m3/mol <br>Config E:	1s1</td>
                  </tr>
              </table>
          `;
      } else if (symbol === 'He') {
          return `
              <table>
                  <tr>
                      <td rowspan="2" style="width: 60px;">
                          <img src="https://exemplo.com/caminho-para-imagem-helio.png" alt="Hélio" style="width: 60px;">
                      </td>
                      <td style="text-transform: uppercase; font-weight: bold; color: #FFF; font-size: larger;">Hélio</td>
                  </tr>
                  <tr>
                      <td style="font-style: italic; font-size: xx-small;">Elemento Químico</td>
                  </tr>
                  <tr>
                      <td colspan="2">Hélio: O segundo elemento mais abundante no universo.</td>
                  </tr>
              </table>
          `;
      }
      else if (symbol === 'H2O') {
        return `
            <table>
                <tr>
                    <td rowspan="2" style="width: 60px;">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/c/c2/Water_molecule_rotation_animation_large.gif" alt="Agua" style="width: 60px;">
                    </td>
                    <td style="text-transform: uppercase; font-weight: bold; color: #FFF; font-size: larger;">Agua</td>
                </tr>
                <tr>
                    <td style="font-style: italic; font-size: xx-small;">Substancia Quimica</td>
                </tr>
                <tr>
                    <td colspan="2">Agua: A substancia da vida</td>
                </tr>
            </table>
        `;
    }
      // Adicione mais lógica conforme necessário para outros elementos
      // ou retorne um conteúdo padrão caso o símbolo do elemento não corresponda a nenhum caso específico
      return 'Conteúdo da tooltip para ' + symbol;
  }