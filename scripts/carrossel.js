// Nessa primeira parte do código são selecionadas as classes do HTML
// que serão utilizadas para fazer o carrossel funcionar.
const carrossel = document.querySelector('.carrossel');
const originalItems = Array.from(document.querySelectorAll('.carrossel-item'));
const btnNext = document.querySelector('.next');
const btnPrev = document.querySelector('.prev');

// Cria clones dos itens antes e depois dos originais
// para permitir o efeito de carrossel infinito
// OBS para o cloneNode(true) que clona o elemento pai e seus filhos
const items = [
  ...originalItems.map(item => item.cloneNode(true)), // clones antes
  ...originalItems,                                   // itens reais
  ...originalItems.map(item => item.cloneNode(true))  // clones depois
];

// Limpa o carrossel e adiciona todos os itens (clones + originais)
carrossel.innerHTML = ''; //Propriedade utilizada para fazer alterações no HTNL
items.forEach(item => carrossel.appendChild(item)); //appendChild adc os itens sendo filhos do carrossel

// Define a posição inicial e variáveis para controle do carrossel
let index = originalItems.length; // começar no primeiro item real
const total = items.length;
const realCount = originalItems.length;

// Função destinada para criação dos efeitos no carrossel
function atualizar(transicao = true) {
  carrossel.style.transition = transicao ? 'transform 0.5s ease' : 'none'; // Liga ou desliga a animação suave do carrossel dependendo do parâmetro 'transicao'
  items.forEach(item => item.classList.remove('ativo')); // Remove a classe 'ativo' de todos os itens para garantir que apenas um fique destacado
  items[index].classList.add('ativo'); // Adiciona a classe 'ativo' ao item atual, ativando o destaque via CSS

  const gap = parseInt(getComputedStyle(carrossel).gap) || 24; // Pega o valor do gap definido no CSS do carrossel e converte para número. Se não existir, usa 24 como padrão
  const itemWidth = items[0].offsetWidth + gap; // Calcula a largura total do primeiro item, incluindo o espaço (gap) entre itens
  const containerWidth = carrossel.parentElement.offsetWidth; // Pega a largura total da área visível do carrossel (containercarro), que é o elemento pai
  const offset = containerWidth / 2 - itemWidth / 2; // Calcula o deslocamento necessário para centralizar o item ativo no containercarro

  carrossel.style.transform = `translateX(${offset - index * itemWidth}px)`; // Calcula e aplica a movimentação horizontal do carrossel para centralizar o item ativo
}

// Próximo item
btnNext.addEventListener('click', () => {
  index++;
  atualizar();

  // Quando o index ultrapassa os itens reais (entra nos clones),
  // ele é redefinido para o primeiro item real (realCount).
  // Depois disso chamamos atualizar(false) para reposicionar
  // o carrossel instantaneamente (sem transição),
  // criando o efeito de loop infinito.
  if (index >= realCount * 2) {
    index = realCount;
    atualizar(false);
  }
});

// Item anterior
btnPrev.addEventListener('click', () => {
  index--;
  atualizar();

  // Aqui acontece o teletransporte quando o carrossel tenta ir
  // antes do primeiro item real. Isso significa que ele entrou
  // nos clones que existem antes dos itens originais.
  // Então redefinimos o index para o último item real
  // (realCount + realCount - 1) para manter o efeito de carrossel infinito.
  if (index < realCount) {
    index = realCount + realCount - 1;
    atualizar(false);
  }
});

// Sempre que o tamanho da janela mudar (resize),
// a função atualizar() é chamada novamente para recalcular
// as posições e manter o item ativo centralizado no carrossel
window.addEventListener('resize', () => atualizar(true));

// Executa a função atualizar() quando a página carrega,
// posicionando o carrossel corretamente no primeiro item real.
// O "false" indica que a movimentação será feita sem animação inicial
atualizar(false);