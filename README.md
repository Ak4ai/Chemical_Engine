# Chemical Engine

Chemical Engine é um projeto JavaScript que permite a interação e mistura de elementos químicos de forma dinâmica em uma interface de usuário.

## Introdução

Chemical Engine é uma biblioteca que fornece funcionalidades para arrastar e soltar elementos químicos em uma área específica, possibilitando a mistura entre eles para criar novas substâncias. Este projeto foi desenvolvido com o objetivo de facilitar a visualização e compreensão de reações químicas de maneira interativa.

O projeto utiliza JavaScript para criar elementos arrastáveis e interativos, detectando eventos de mouse e toque para garantir uma experiência de usuário consistente em diferentes dispositivos. Além disso, as informações sobre os elementos químicos são exibidas em tooltips dinâmicas, proporcionando detalhes como nome, propriedades e imagens relacionadas.

## Funcionalidades Principais

- Arraste e solte elementos químicos: Os usuários podem arrastar elementos químicos pré-definidos e soltá-los em uma área de mistura.
- Mistura dinâmica: Ao soltar os elementos em uma área específica, o Chemical Engine verifica as combinações possíveis e cria novos elementos resultantes da mistura.
- Exibição de informações: As tooltips exibem informações detalhadas sobre os elementos químicos, incluindo nome, propriedades e imagens ilustrativas.
<br><br><br>
# Modelo HTML

O modelo HTML fornecido permite a integração rápida do Chemical Engine em qualquer projeto web. Abaixo estão as instruções sobre como interagir e modificar o código para criar novos elementos, misturas e dados.

### Interagindo com o Código

Para interagir com o código HTML:

1. Copie o código HTML fornecido para o seu projeto.
2. Modifique os elementos existentes conforme necessário, incluindo símbolo, nome, posição na tabela periódica e dados de mistura.
3. Adicione novos elementos seguindo a estrutura dos elementos existentes.

### Modificando Elementos

Cada elemento químico é representado por uma `div` com a classe `draggable-element`. Para modificar um elemento, você pode editar os atributos `data-symbol`, `data-mix` e outros conforme necessário.

- `data-symbol`: O símbolo do elemento químico.
- `data-mix`: As combinações possíveis deste elemento com outros elementos, separados por espaços. Cada combinação é representada por uma sequência de símbolos separados por vírgula.

### Criando Novos Elementos

Para criar novos elementos químicos:

1. Copie e cole uma das `divs` existentes que representam os elementos.
2. Modifique os atributos `data-symbol`, `data-mix` e outras informações conforme necessário.
3. Certifique-se de seguir a estrutura e classes existentes para garantir o funcionamento correto do Chemical Engine.

### Adicionando Dados de Mistura

Os dados de mistura são definidos pelo atributo `data-mix` em cada elemento. Este atributo especifica as combinações possíveis do elemento com outros elementos, indicando os produtos resultantes da mistura.

- Cada combinação é representada por uma sequência de símbolos separados por vírgula.
- Os produtos resultantes são separados por espaços.

Por exemplo, `data-mix="H,O,H2 H2O"` indica que o elemento H pode se combinar com O para formar H2 ou com H2O para formar H2O2.

## Exemplo de Código HTML

Aqui está um exemplo de como o código HTML pode ser modificado para adicionar um novo elemento químico:

```html
      <div class="draggable-element element" data-symbol="H" data-mix="H,H,H2" data-row="1" data-col="1">
        <p>H</p>
        <p>Hydrogen</p>
        <div class="main-tooltip">Hidrogênio: O elemento mais simples e abundante do universo.</div>
      </div>
```
<br><br><br>
# Exemplo de Código JavaScript

Aqui está uma explicação das funcionalidades do código JavaScript e como interagir e modificar com ele:

### Detecção de Dispositivo de Toque

A função `isTouchDevice()` é responsável por detectar se o dispositivo possui capacidade de toque. Isso é útil para determinar quais eventos de interação serão usados, como eventos de mouse ou de toque.

Para interagir com essa função, você pode ajustar o comportamento com base no tipo de dispositivo detectado. Por exemplo, você pode modificar a lógica para eventos específicos de dispositivos de toque ou de mouse.

### Misturar Elementos

A função `misturarElementos(elementoSoltado)` é responsável por verificar se um elemento solto está sobrepondo a área de mistura e realizar combinações químicas com base nos dados de mistura dos elementos.

Para modificar essa função, você pode adicionar novas combinações químicas para elementos existentes ou criar lógica para misturas com novos elementos adicionados ao projeto. Por exemplo, você pode adicionar novos dados de mistura para elementos criados posteriormente na função `makeDraggable(elem)`.

### Tornar Elemento Arrastável

A função `makeDraggable(elem)` é responsável por tornar um elemento HTML arrastável. Ela lida com eventos de mouse ou de toque para permitir o movimento do elemento na tela.

Para interagir com essa função, você pode ajustar o comportamento do arraste, como a sensibilidade ao movimento ou a restrição de áreas de soltura. Você também pode adicionar lógica adicional para eventos de arraste, como animações ou atualizações visuais.

### Adicionar Event Listeners para Tooltips

Os event listeners adicionados para mostrar e ocultar tooltips permitem que os usuários vejam informações adicionais sobre os elementos químicos ao passar o mouse sobre eles.

Para modificar esse comportamento, você pode ajustar o estilo ou o conteúdo das tooltips para fornecer informações mais relevantes ou personalizadas sobre os elementos.

### Obter Conteúdo da Tooltip e Data Mix

As funções `getTooltipContent(symbol)` e `getDatamix(symbol)` são responsáveis por fornecer o conteúdo das tooltips com base no símbolo do elemento e por determinar os dados de mistura para um determinado elemento, respectivamente.

Para interagir com essas funções, você pode adicionar lógica adicional para personalizar o conteúdo das tooltips ou os dados de mistura com base nas necessidades do projeto ou nos requisitos dos novos elementos adicionados.

## Exemplos de Adição de Tooltips e Data Mix para Novos Elementos

Aqui estão exemplos de como você pode criar tooltips e data mix para novos elementos, baseando-se no código existente:

Aqui está a atualização do arquivo `README.md` no formato Markdown para o GitHub, com a função `getTooltipContent(symbol)` exemplificando o uso para o H2:

```markdown
# Exemplo de uso da função `getTooltipContent(symbol)`

Este projeto utiliza a função `getTooltipContent(symbol)` para exibir informações e imagens sobre elementos e moléculas em tooltips interativas. A função pode ser estendida facilmente para incluir novos elementos ou moléculas.

## Exemplo de código para o elemento H2

```javascript
function getTooltipContent(symbol) {
    let tooltipContainer, canvasContainer, textContainer;
    const moleculeImages = {
        'H2O': 'https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExdjA2eWE0MzVyZm81czdkdWtqbTNnaHNobWpkOXRzM2hoaWRyMDg0bSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/W4p8ANgBSnmtAvIbaS/giphy.webp',
        'CO2': 'https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHk5aGQ4enh6Y29oZm55dzdkMmZyN2poZTk4MDVmeGt4NXlqZGl1ZCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/nhMdWYN79qcNyqI7Q6/giphy.webp',
        'H2': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS3MePc78yuyOe7YeZIeF7A3v3G3v2m6TKRMQ&s',
        // Adicione mais moléculas aqui conforme necessário
    };

    // Configurações de elétrons para cada elemento
    const electronConfigurations = {
        'H': [1],
        'He': [2],
        'Li': [2, 1],
        // Adicione mais elementos conforme necessário
    };
    return tooltipContainer; // Retorna o elemento HTML completo
}
```

## Adicionando novos elementos ou moléculas

Para adicionar um novo elemento ou molécula, basta seguir o exemplo acima e adicionar a imagem correspondente à molécula no objeto `moleculeImages` e a configuração eletrônica no objeto `electronConfigurations`. Por exemplo:

```javascript
moleculeImages['CH4'] = 'https://path-to-ch4-image.jpg';
electronConfigurations['O'] = [2, 6]; // Configuração eletrônica para o oxigênio
```

## Função `getElementInfo(symbol)`

A função `getElementInfo(symbol)` retorna informações específicas sobre o elemento químico ou molécula, como massa atômica, raio atômico, volume molar e configuração eletrônica. Exemplo:

```javascript
function getElementInfo(symbol) {
    const elementInfo = {
        'H': 'MA: 1,008 <br> RA: 1 <br> VM: 1,20×10-5 m3/mol <br> Config E: 1s1',
        'He': 'MA: 4,0026 <br> RA: 2 <br> VM: 2,18×10-5 m3/mol <br> Config E: 1s2',
        // Adicione mais elementos conforme necessário
    };
    return elementInfo[symbol] || 'Informação não disponível';
}
```
# Estilização CSS para Novos Programadores

Aqui estão as explicações e funcionalidades do código CSS fornecido, juntamente com orientações para novos programadores:

### Tooltips (Dicas de Ferramentas)

O estilo `.main-tooltip` define o visual das tooltips exibidas quando um elemento é clicado ou passado sobre. Aqui está uma explicação dos principais atributos:

- `border`: Define a largura e o estilo da borda da tooltip.
- `color`: Define a cor do texto dentro da tooltip.
- `box-shadow`: Adiciona uma sombra à tooltip para criar um efeito de elevação.
- `border-radius`: Define o raio dos cantos da tooltip, tornando-os arredondados.
- `padding`: Adiciona espaçamento interno entre o conteúdo da tooltip e suas bordas.
- `background-color`: Define a cor de fundo da tooltip.
- `transition`: Define uma transição suave para todas as propriedades afetadas, com duração de 0.2 segundos.
- `max-width`: Define a largura máxima da tooltip para evitar que ela se estenda demais.

### Corpo da Página (Body)

O estilo para o `body` define o plano de fundo gradiente da página.

### Container Principal (#container)

- `height`: Define a altura do container principal.
- `width`: Define a largura do container principal.
- `position`: Define o método de posicionamento do container (relativo).
- `display`: Define o método de exibição do container (grid).
- `grid-template-columns`: Define o layout de colunas do grid.
- `grid-gap`: Define o espaçamento entre as células do grid.

### Elementos Arrastáveis (.draggable-element)

- `position`: Define o método de posicionamento dos elementos (absoluto).
- `background-color`: Define a cor de fundo dos elementos arrastáveis.
- `font-size`: Define o tamanho da fonte dos elementos.
- `width` e `height`: Define as dimensões dos elementos.
- `display` e `place-items`: Centralizam o conteúdo dos elementos horizontal e verticalmente.
- `font-family`: Define a família de fontes a ser usada para o texto dos elementos.
- `border-radius`: Define o raio dos cantos dos elementos para torná-los arredondados.
- `cursor`: Define o cursor do mouse quando passa sobre os elementos (indicando que são arrastáveis).

### Área de Arraste (.dragging-area)

- `position`: Define o método de posicionamento da área de arraste (absoluto).
- `top` e `left`: Posicionam a área de arraste horizontal e verticalmente.
- `transform`: Move a área de arraste horizontalmente em relação ao centro.
- `width` e `height`: Define as dimensões da área de arraste.
- `background-color`: Define a cor de fundo da área de arraste.
- `border`: Define o estilo da borda da área de arraste.

### Texto da Área de Arraste (.area-text)

- `position`: Define o método de posicionamento do texto (absoluto).
- `top` e `left`: Posicionam o texto horizontal e verticalmente em relação à área de arraste.
- `color`: Define a cor do texto da área de arraste.
- `font-size`: Define o tamanho da fonte do texto da área de arraste.
- `font-family`: Define a família de fontes a ser usada para o texto da área de arraste.

### Linhas 1 e 2 dos Elementos

Os estilos específicos para cada linha e coluna dos elementos iniciados com o programa determinam suas posições na grade.

Espero que essas explicações ajudem a compreender e modificar o código CSS conforme necessário!
<br>
<br>
<br>
<br>
# Tutorial Rápido: Importando o Código para o VSCode e Usando o Vite

Este tutorial orienta como você pode importar o código deste projeto para o VSCode e usar o Vite para executá-lo localmente.

### Passo 1: Clone o Repositório

Abra o terminal e clone o repositório usando o seguinte comando:

```bash
git clone <URL do Repositório>
```
### Passo 2: Abra o Projeto no VSCode
Navegue até o diretório clonado e abra-o no VSCode com o seguinte comando:
```bash
cd <nome do diretório>
code .
````
### Passo 3: Instale as Dependências
Abra o terminal integrado do VSCode (Ctrl + `) e instale as dependências do projeto com npm ou yarn:
```bash
npm install
# ou
yarn
````
### Passo 4: Execute o Projeto com Vite
Após a instalação das dependências, execute o projeto usando o Vite ou baixe a extensao vite na loja do VS code:
```bash
npm run dev
# ou
yarn dev
````
### Passo 5: Visualize no Navegador
Abra o navegador e acesse http://localhost:3000 para visualizar o projeto em execução.

Agora você está pronto para explorar e modificar o projeto no seu ambiente local usando o VSCode e o Vite!

Se tiver alguma dúvida ou encontrar algum problema, consulte a documentação oficial do Vite ou sinta-se à vontade para abrir uma issue no repositório.c
<br><br><br>
## Conclusão

Este repositório contém um projeto simples de arrastar e soltar elementos HTML, com tooltips informativas para cada elemento. Abaixo está um resumo das principais funcionalidades e estrutura do projeto:

- **HTML**: O arquivo HTML define a estrutura básica da página, incluindo os elementos arrastáveis e a área de mistura.

- **CSS**: O arquivo CSS estiliza os elementos da página, definindo cores, tamanhos e posições para criar uma interface agradável e responsiva.

- **JavaScript**: O arquivo JavaScript contém funções para tornar os elementos arrastáveis e exibir tooltips informativas quando clicados.

- **Funcionalidades**: Os elementos podem ser arrastados e soltos na área de mistura. Quando clicados, exibem uma tooltip com informações sobre o elemento.
