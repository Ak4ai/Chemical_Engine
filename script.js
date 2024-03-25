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

// Variável de controle para a receita
let receitaUtilizada = false;

const receitas = {
  misturarDragMeEToo: () => {
    // Verificar se a receita já foi utilizada
    if (receitaUtilizada) {
      console.log("A receita já foi utilizada uma vez. Não é possível criar mais elementos.");
      return;
    }

    // Verificar se Drag Me e Drag Me Too estão sobrepondo a área de mistura
    const H = document.querySelector('.draggable-element[data-symbol="H"]');
    const O = document.querySelector('.draggable-element[data-symbol="O"]');
    const areaMistura = document.querySelector('.dragging-area');
    
    if (!H || !O || !areaMistura) {
      console.error("Os elementos Drag Me, Drag Me Too ou a área de mistura não foram encontrados.");
      return;
    }

    const HRect = H.getBoundingClientRect();
    const ORect = O.getBoundingClientRect();
    const areaRect = areaMistura.getBoundingClientRect();

    if (
      HRect.right >= areaRect.left &&
      HRect.left <= areaRect.right &&
      HRect.bottom >= areaRect.top &&
      HRect.top <= areaRect.bottom &&
      ORect.right >= areaRect.left &&
      ORect.left <= areaRect.right &&
      ORect.bottom >= areaRect.top &&
      ORect.top <= areaRect.bottom
    ) {
      // Ambos Drag Me e Drag Me Too estão sobrepondo a área de mistura
      // Verificar se a receita já foi utilizada
      if (receitaUtilizada) {
        console.log("A receita já foi utilizada uma vez. Não é possível criar mais elementos.");
        return;
      }

      // Criar novo elemento
      const newElement = document.createElement('div');
      newElement.classList.add('draggable-element');
      newElement.classList.add('element');
      newElement.textContent = 'H2O';
      newElement.setAttribute('data-symbol', 'H2O');

      // Criar elemento filho para o tooltip
      const newTooltip = document.createElement('div');
      newTooltip.classList.add('main-tooltip');

      // Adicionar o conteúdo do tooltip
      const tooltipContent = `
          <table>
              <tr>
                  <td rowspan="2" style="width: 60px;">
                      <img src="https://exemplo.com/caminho-para-imagem-helio.png" alt="Agua" style="width: 60px;">
                  </td>
                  <td style="text-transform: uppercase; font-weight: bold; color: #FFF; font-size: larger;">Água</td>
              </tr>
              <tr>
                  <td style="font-style: italic; font-size: xx-small;">Substância Química</td>
              </tr>
              <tr>
                  <td colspan="2">Água: Uma substância composta por hidrogênio e oxigênio.</td>
              </tr>
          </table>
      `;
      newTooltip.innerHTML = tooltipContent;

      // Adicionar o elemento filho ao novo elemento
      newElement.appendChild(newTooltip);

      // Adicionar novo elemento ao DOM
      document.getElementById('container').appendChild(newElement);


      // Aplicar funcionalidade de arrastar para o novo elemento
      makeDraggable(newElement);

      // Definir a variável de controle para indicar que a receita foi utilizada
      receitaUtilizada = true;

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
    }
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
      // Elemento está sobrepondo a área de mistura, chame a função de receita apropriada
      receitas.misturarDragMeEToo(); // Você pode adicionar mais lógica aqui para diferentes receitas
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