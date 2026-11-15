// Liga a página às funções de cor (cores.js), de armazenamento (armazenamento.js)
// e da The Color API (api.js).

const formulario = document.querySelector('#formulario');
const seletorCor = document.querySelector('#seletor-cor');
const campoHex = document.querySelector('#campo-hex');
const erroHex = document.querySelector('#erro-hex');
const avisoNeutra = document.querySelector('#aviso-neutra');
const tituloPaleta = document.querySelector('#titulo-paleta');
const listaPaleta = document.querySelector('#paleta');
const cssPronto = document.querySelector('#css-pronto');
const botaoSalvar = document.querySelector('#botao-salvar');
const avisoArmazenamento = document.querySelector('#aviso-armazenamento');
const semFavoritas = document.querySelector('#sem-favoritas');
const listaFavoritas = document.querySelector('#lista-favoritas');
const avisoNomes = document.querySelector('#aviso-nomes');
const formIdeias = document.querySelector('#form-ideias');
const seletorModo = document.querySelector('#modo-api');
const botaoIdeias = document.querySelector('#botao-ideias');
const statusIdeias = document.querySelector('#status-ideias');
const listaIdeias = document.querySelector('#lista-ideias');

// Espera a pessoa parar de mexer na cor antes de pedir os nomes, para não fazer
// um pedido a cada movimento do seletor.
const ESPERA_ANTES_DOS_NOMES = 400;
let temporizadorNomes;
let pedidoDeNomes = 0;

// Volta para a última cor e o último tipo usados, se houver algo salvo.
const preferencias = carregarPreferencias();

// Última cor válida escolhida. A paleta continua nela enquanto o campo de HEX estiver inválido.
let corAtual = preferencias ? preferencias.cor : normalizarHex(seletorCor.value);
if (preferencias) {
  formulario.elements.tipo.value = preferencias.tipo;
}

let favoritas = carregarFavoritas();

function criarElemento(tag, classe, texto) {
  const elemento = document.createElement(tag);
  elemento.className = classe;
  if (texto !== undefined) {
    elemento.textContent = texto;
  }
  return elemento;
}

// A paleta que está na tela agora, no mesmo formato em que as favoritas são guardadas.
function paletaAtual() {
  return { cor: corAtual, tipo: formulario.elements.tipo.value };
}

function descreverPaleta(paleta) {
  return `${HARMONIAS[paleta.tipo].nome} de ${paleta.cor}`;
}

// Se o navegador recusar uma gravação, avisa uma vez e o site continua funcionando sem salvar.
function conferirGravacao(gravou) {
  if (!gravou) {
    avisoArmazenamento.hidden = false;
  }
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
  const nome = criarElemento('span', 'cor-nome');
  nome.dataset.hex = cor.hex;
  escreverNome(nome, nomeEmCache(cor.hex));
  codigos.append(
    nome,
    criarElemento('code', 'cor-hex', cor.hex),
    criarElemento('code', '', formatarRgb(cor.rgb)),
    criarElemento('code', '', formatarHsl(cor.hsl))
  );
  bloco.append(codigos);

  return bloco;
}

// cor é o que veio da API ({ nome, exato }), undefined enquanto busca ou null se falhou.
function escreverNome(elemento, cor) {
  if (cor === undefined) {
    elemento.textContent = 'Buscando nome…';
    elemento.classList.add('cor-nome-pendente');
  } else if (cor === null) {
    elemento.textContent = 'Nome indisponível';
    elemento.classList.add('cor-nome-pendente');
  } else {
    elemento.textContent = cor.exato ? cor.nome : `≈ ${cor.nome}`;
    elemento.title = cor.exato ? 'Nome da cor' : 'Nome da cor mais parecida';
    elemento.classList.remove('cor-nome-pendente');
  }
}

function mostrarNomeNaPaleta(hex, cor) {
  const elemento = listaPaleta.querySelector(`.cor-nome[data-hex="${hex}"]`);
  if (elemento !== null) {
    escreverNome(elemento, cor);
  }
}

// Busca os nomes um de cada vez: o próximo pedido só sai quando o anterior termina.
// Se a paleta mudou no meio do caminho, pedido deixa de ser o atual e a busca para.
function buscarNomesUmPorUm(cores, indice, pedido) {
  if (pedido !== pedidoDeNomes || indice >= cores.length) {
    return;
  }
  const hex = cores[indice].hex;

  buscarNomeDaCor(hex)
    .then((cor) => {
      if (pedido === pedidoDeNomes) {
        mostrarNomeNaPaleta(hex, cor);
        avisoNomes.hidden = true;
      }
    })
    .catch((erro) => {
      if (pedido === pedidoDeNomes) {
        mostrarNomeNaPaleta(hex, null);
        avisoNomes.textContent = `${explicarErroDaApi(erro)} A paleta continua funcionando, só sem os nomes.`;
        avisoNomes.hidden = false;
      }
    })
    .finally(() => {
      buscarNomesUmPorUm(cores, indice + 1, pedido);
    });
}

function agendarNomes(paleta) {
  pedidoDeNomes++;
  const pedido = pedidoDeNomes;
  clearTimeout(temporizadorNomes);
  temporizadorNomes = setTimeout(() => buscarNomesUmPorUm(paleta, 0, pedido), ESPERA_ANTES_DOS_NOMES);
}

// Uma cor sugerida pela API: um botão que troca a cor base.
function criarItemIdeia(cor) {
  const item = criarElemento('li', '');
  const botao = criarElemento('button', 'ideia');
  botao.type = 'button';
  botao.dataset.hex = cor.hex;
  botao.setAttribute('aria-label', `Usar ${cor.nome} (${cor.hex}) como cor base`);

  const amostra = criarElemento('span', 'ideia-amostra');
  amostra.style.backgroundColor = cor.hex;
  const nome = criarElemento('span', 'ideia-nome');
  escreverNome(nome, cor);

  botao.append(amostra, criarElemento('code', 'ideia-hex', cor.hex), nome);
  item.append(botao);
  return item;
}

function mostrarStatusIdeias(texto, ehErro) {
  statusIdeias.textContent = texto;
  statusIdeias.classList.toggle('erro', ehErro);
  statusIdeias.classList.toggle('aviso', !ehErro);
  statusIdeias.hidden = false;
}

// Um item da lista de favoritas: as cores em miniatura, o nome e os botões.
// O índice no data-indice diz ao ouvinte da lista qual favorita foi clicada.
function criarItemFavorita(favorita, indice) {
  const item = criarElemento('li', 'favorita');
  if (mesmaPaleta(favorita, paletaAtual())) {
    item.classList.add('favorita-atual');
  }

  const miniaturas = criarElemento('div', 'favorita-cores');
  for (const cor of gerarPaleta(favorita.cor, favorita.tipo)) {
    const miniatura = criarElemento('span', '');
    miniatura.style.backgroundColor = cor.hex;
    miniaturas.append(miniatura);
  }

  const texto = criarElemento('div', 'favorita-texto');
  texto.append(
    criarElemento('strong', '', HARMONIAS[favorita.tipo].nome),
    criarElemento('code', '', favorita.cor)
  );

  const acoes = criarElemento('div', 'favorita-acoes');
  const descricao = descreverPaleta(favorita);
  for (const [acao, rotulo] of [['usar', 'Usar'], ['remover', 'Remover']]) {
    const botao = criarElemento('button', 'botao botao-pequeno', rotulo);
    botao.type = 'button';
    botao.dataset.acao = acao;
    botao.dataset.indice = indice;
    botao.setAttribute('aria-label', `${rotulo} a paleta ${descricao}`);
    acoes.append(botao);
  }

  item.append(miniaturas, texto, acoes);
  return item;
}

function mostrarFavoritas() {
  listaFavoritas.replaceChildren(...favoritas.map(criarItemFavorita));
  semFavoritas.hidden = favoritas.length > 0;
}

// O botão funciona como um liga/desliga: aria-pressed diz se a paleta atual já está salva.
function atualizarBotaoSalvar() {
  const salva = favoritas.some((favorita) => mesmaPaleta(favorita, paletaAtual()));
  botaoSalvar.setAttribute('aria-pressed', String(salva));
  botaoSalvar.textContent = salva ? '★ Salva nas favoritas' : '☆ Salvar nas favoritas';
}

function mostrarPaleta() {
  const tipo = formulario.elements.tipo.value;
  const paleta = gerarPaleta(corAtual, tipo);

  tituloPaleta.textContent = `Paleta ${HARMONIAS[tipo].nome.toLowerCase()}`;
  listaPaleta.replaceChildren(...paleta.map(criarBloco));
  cssPronto.textContent = gerarCss(paleta);
  avisoNeutra.hidden = tipo === 'monocromatica' || !ehCorNeutra(criarCor(corAtual));
  agendarNomes(paleta);

  atualizarBotaoSalvar();
  mostrarFavoritas();
  conferirGravacao(salvarPreferencias(corAtual, tipo));
}

function trocarFavoritas(novaLista) {
  favoritas = novaLista;
  conferirGravacao(salvarFavoritas(favoritas));
  atualizarBotaoSalvar();
  mostrarFavoritas();
}

// Coloca uma cor nos dois campos do formulário.
function preencherCampos(hex) {
  seletorCor.value = hex.toLowerCase();
  campoHex.value = hex;
  esconderErroHex();
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

// Salva a paleta atual, ou tira das favoritas se ela já estiver lá.
botaoSalvar.addEventListener('click', () => {
  const paleta = paletaAtual();
  if (botaoSalvar.getAttribute('aria-pressed') === 'true') {
    trocarFavoritas(removerFavorita(favoritas, paleta));
  } else {
    trocarFavoritas(adicionarFavorita(favoritas, paleta));
  }
});

// Delegação de eventos: um ouvinte só na lista trata os botões de todas as favoritas.
listaFavoritas.addEventListener('click', (evento) => {
  const botao = evento.target.closest('button[data-acao]');
  if (botao === null) {
    return;
  }
  const favorita = favoritas[Number(botao.dataset.indice)];

  if (botao.dataset.acao === 'usar') {
    corAtual = favorita.cor;
    preencherCampos(corAtual);
    formulario.elements.tipo.value = favorita.tipo;
    mostrarPaleta();
    tituloPaleta.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } else {
    trocarFavoritas(removerFavorita(favoritas, favorita));
  }
});

// Se as favoritas mudarem em outra aba do CombinaCor, esta aba se atualiza também.
// O evento storage só dispara nas outras abas, não na que fez a mudança.
window.addEventListener('storage', (evento) => {
  if (evento.key === CHAVE_FAVORITAS || evento.key === null) {
    favoritas = carregarFavoritas();
    atualizarBotaoSalvar();
    mostrarFavoritas();
  }
});

// Pede ao endpoint /scheme uma paleta com 5 cores no estilo escolhido.
formIdeias.addEventListener('submit', (evento) => {
  evento.preventDefault();
  const cor = corAtual;
  const modo = seletorModo.value;

  botaoIdeias.disabled = true;
  mostrarStatusIdeias(`Buscando ideias para ${cor}…`, false);

  buscarPaletaDaApi(cor, modo, 5)
    .then((cores) => {
      listaIdeias.replaceChildren(...cores.map(criarItemIdeia));
      mostrarStatusIdeias(`Paleta ${MODOS_API[modo].toLowerCase()} da The Color API para ${cor}:`, false);
    })
    .catch((erro) => {
      mostrarStatusIdeias(explicarErroDaApi(erro), true);
    })
    .finally(() => {
      botaoIdeias.disabled = false;
    });
});

// Delegação de eventos: um ouvinte só na lista trata o clique em qualquer ideia.
listaIdeias.addEventListener('click', (evento) => {
  const botao = evento.target.closest('button.ideia');
  if (botao === null) {
    return;
  }
  corAtual = botao.dataset.hex;
  preencherCampos(corAtual);
  mostrarPaleta();
  tituloPaleta.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

for (const [modo, nome] of Object.entries(MODOS_API)) {
  seletorModo.append(new Option(nome, modo));
}

// O navegador pode manter o que estava no formulário ao recarregar a página,
// então os campos são preenchidos de novo com a cor certa.
preencherCampos(corAtual);
mostrarPaleta();
