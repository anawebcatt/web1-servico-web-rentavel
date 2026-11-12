// Liga o formulário da página às funções de cor do cores.js.

const formulario = document.querySelector('#formulario');
const seletorCor = document.querySelector('#seletor-cor');
const campoHex = document.querySelector('#campo-hex');
const erroHex = document.querySelector('#erro-hex');
const avisoNeutra = document.querySelector('#aviso-neutra');
const tituloPaleta = document.querySelector('#titulo-paleta');
const listaPaleta = document.querySelector('#paleta');
const cssPronto = document.querySelector('#css-pronto');

// Última cor válida escolhida. A paleta continua nela enquanto o campo de HEX estiver inválido.
let corAtual = normalizarHex(seletorCor.value);

function criarElemento(tag, classe, texto) {
  const elemento = document.createElement(tag);
  elemento.className = classe;
  if (texto !== undefined) {
    elemento.textContent = texto;
  }
  return elemento;
}

// Um bloco da paleta: a amostra da cor e os três códigos.
function criarBloco(cor) {
  const bloco = criarElemento('li', 'cor');

  const amostra = criarElemento('div', 'cor-amostra');
  amostra.style.backgroundColor = cor.hex;
  bloco.append(amostra);

  const codigos = criarElemento('div', 'cor-codigos');
  if (cor.hex === corAtual) {
    codigos.append(criarElemento('span', 'cor-base', 'Cor base'));
  }
  codigos.append(
    criarElemento('code', 'cor-hex', cor.hex),
    criarElemento('code', '', formatarRgb(cor.rgb)),
    criarElemento('code', '', formatarHsl(cor.hsl))
  );
  bloco.append(codigos);

  return bloco;
}

function mostrarPaleta() {
  const tipo = formulario.elements.tipo.value;
  const paleta = gerarPaleta(corAtual, tipo);

  tituloPaleta.textContent = `Paleta ${HARMONIAS[tipo].nome.toLowerCase()}`;
  listaPaleta.replaceChildren(...paleta.map(criarBloco));
  cssPronto.textContent = gerarCss(paleta);
  avisoNeutra.hidden = tipo === 'monocromatica' || !ehCorNeutra(criarCor(corAtual));
}

function mostrarErroHex(texto) {
  erroHex.textContent = `"${texto}" não é um HEX válido. Use 6 dígitos de 0 a 9 e de A a F, como #0047AB.`;
  erroHex.hidden = false;
  campoHex.setAttribute('aria-invalid', 'true');
}

function esconderErroHex() {
  erroHex.hidden = true;
  campoHex.removeAttribute('aria-invalid');
}

// Seletor de cor: o valor é sempre válido, então só copia para o campo de HEX.
seletorCor.addEventListener('input', () => {
  corAtual = normalizarHex(seletorCor.value);
  campoHex.value = corAtual;
  esconderErroHex();
  mostrarPaleta();
});

// Campo de HEX, a cada tecla: atualiza assim que o texto vira um HEX válido.
// Enquanto a pessoa ainda está digitando, não mostra erro.
campoHex.addEventListener('input', () => {
  const hex = normalizarHex(campoHex.value);
  if (hex === null) {
    return;
  }
  corAtual = hex;
  seletorCor.value = hex.toLowerCase();
  esconderErroHex();
  mostrarPaleta();
});

// Campo de HEX, ao sair do campo ou apertar Enter: avisa se ficou inválido, ou arruma o texto (ex.: "04a" vira "#0044AA").
campoHex.addEventListener('change', () => {
  if (normalizarHex(campoHex.value) === null) {
    mostrarErroHex(campoHex.value);
  } else {
    campoHex.value = corAtual;
  }
});

// Um ouvinte só no formulário pega a troca de qualquer um dos tipos de paleta.
formulario.addEventListener('change', (evento) => {
  if (evento.target.name === 'tipo') {
    mostrarPaleta();
  }
});

// Enter no campo de HEX enviaria o formulário e recarregaria a página.
formulario.addEventListener('submit', (evento) => {
  evento.preventDefault();
});

// O navegador pode manter o que estava no formulário ao recarregar a página.
campoHex.value = corAtual;
mostrarPaleta();
