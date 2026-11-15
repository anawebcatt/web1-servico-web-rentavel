// Busca dados na The Color API (sem chave, CORS liberado).
// Não mexe na página: só busca e devolve os dados.

const URL_API = 'https://www.thecolorapi.com';

// Estilos de paleta da API (parâmetro "mode") e o nome que aparece na página.
const MODOS_API = {
  analogic: 'Análoga',
  complement: 'Complementar',
  'analogic-complement': 'Análoga + complementar',
  triad: 'Tríade',
  quad: 'Quádrupla',
  monochrome: 'Monocromática',
};

// Nomes já buscados, para não pedir a mesma cor duas vezes. A chave é o HEX.
const nomesEmCache = {};

// fetch só falha sozinho quando não chega resposta (sem internet).
// Erro do servidor (404, 500...) aparece em resposta.ok.
function buscarJson(url) {
  return fetch(url).then((resposta) => {
    if (!resposta.ok) {
      throw new Error(`A The Color API respondeu com erro ${resposta.status}.`);
    }
    return resposta.json();
  });
}

// Fica só com o que o CombinaCor usa. exato é false quando a API
// não tem nome para a cor e manda o nome da cor mais parecida.
function lerCorDaApi(dados) {
  const hex = dados && dados.hex ? normalizarHex(dados.hex.value) : null;
  if (hex === null || !dados.name || typeof dados.name.value !== 'string') {
    throw new Error('A The Color API mandou uma resposta num formato inesperado.');
  }
  return {
    hex: hex,
    nome: dados.name.value,
    exato: dados.name.exact_match_name === true,
  };
}

// Devolve undefined se a cor ainda não foi buscada.
function nomeEmCache(hex) {
  return nomesEmCache[hex];
}

// Endpoint /id. Devolve uma Promise com { hex, nome, exato }.
function buscarNomeDaCor(hex) {
  if (nomesEmCache[hex] !== undefined) {
    return Promise.resolve(nomesEmCache[hex]);
  }
  return buscarJson(`${URL_API}/id?hex=${hex.slice(1)}`).then((dados) => {
    const cor = lerCorDaApi(dados);
    nomesEmCache[hex] = cor;
    return cor;
  });
}

// Endpoint /scheme: paleta gerada pela própria API.
// Devolve uma Promise com uma lista de { hex, nome, exato }.
function buscarPaletaDaApi(hex, modo, quantidade) {
  const parametros = new URLSearchParams({ hex: hex.slice(1), mode: modo, count: quantidade });
  return buscarJson(`${URL_API}/scheme?${parametros}`).then((dados) => {
    if (!Array.isArray(dados.colors)) {
      throw new Error('A The Color API mandou uma resposta num formato inesperado.');
    }
    const cores = dados.colors.map(lerCorDaApi);
    for (const cor of cores) {
      nomesEmCache[cor.hex] = cor;
    }
    return cores;
  });
}

// TypeError é o erro do fetch quando nem chega a ter resposta.
function explicarErroDaApi(erro) {
  if (erro.name === 'TypeError') {
    return 'Não deu para falar com a The Color API. Confira a conexão com a internet e tente de novo.';
  }
  return erro.message;
}
