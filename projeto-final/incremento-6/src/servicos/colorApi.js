// Serviço da The Color API (https://www.thecolorapi.com, sem chave, CORS liberado).
// É o único arquivo do projeto que chama fetch. Os componentes e os hooks só usam as
// funções exportadas daqui e recebem os dados já no formato do CombinaCor.

import { normalizarHex } from '../lib/cores.js';

const URL_API = 'https://www.thecolorapi.com';

// Depois desse tempo sem resposta, o pedido é cancelado.
const TEMPO_LIMITE = 8000;

// Se o pedido falhar por um problema passageiro, é feito mais uma vez depois desta espera.
const ESPERA_ANTES_DE_TENTAR_DE_NOVO = 600;

// Estilos de paleta da API (parâmetro "mode") e o nome que aparece na página.
export const MODOS_API = {
  analogic: 'Análoga',
  complement: 'Complementar',
  'analogic-complement': 'Análoga + complementar',
  triad: 'Tríade',
  quad: 'Quádrupla',
  monochrome: 'Monocromática',
};

// Erro com a mensagem pronta para mostrar na página.
// passageiro diz se vale a pena tentar de novo (erro 5xx do servidor).
class ErroDaApi extends Error {
  constructor(mensagem, passageiro = false) {
    super(mensagem);
    this.name = 'ErroDaApi';
    this.passageiro = passageiro;
  }
}

// Nomes já buscados, para não pedir a mesma cor duas vezes. A chave é o HEX.
const nomesEmCache = new Map();

// Uma promessa que termina depois de ms milissegundos, para usar com await.
// Se o sinal for cancelado antes, ela rejeita com o motivo do cancelamento.
function esperar(ms, sinal) {
  return new Promise((resolver, rejeitar) => {
    const temporizador = setTimeout(resolver, ms);
    sinal?.addEventListener(
      'abort',
      () => {
        clearTimeout(temporizador);
        rejeitar(sinal.reason);
      },
      { once: true }
    );
  });
}

// Um pedido GET que devolve o JSON da resposta.
// sinal (opcional) vem de um AbortController e cancela o pedido.
// O tempo limite é juntado a ele com AbortSignal.any.
async function pedirUmaVez(url, sinal) {
  const limite = AbortSignal.timeout(TEMPO_LIMITE);
  const resposta = await fetch(url, { signal: sinal ? AbortSignal.any([sinal, limite]) : limite });
  // fetch só rejeita quando não há resposta. Um erro 404 ou 500 chega como resposta normal,
  // então o status precisa ser conferido.
  if (!resposta.ok) {
    throw new ErroDaApi(`A The Color API respondeu com erro ${resposta.status}.`, resposta.status >= 500);
  }
  return resposta.json();
}

// Vale tentar de novo quando o servidor falhou (5xx) ou a rede falhou no meio do caminho
// (TypeError). Não vale quando o pedido foi cancelado, estourou o tempo ou não há internet.
function valeTentarDeNovo(erro, sinal) {
  if (sinal?.aborted || !navigator.onLine) {
    return false;
  }
  return erro.name === 'TypeError' || erro.passageiro === true;
}

// Monta o endereço, faz o pedido e tenta mais uma vez se o problema for passageiro.
async function pedir(caminho, parametros, sinal) {
  const url = `${URL_API}${caminho}?${new URLSearchParams(parametros)}`;
  try {
    return await pedirUmaVez(url, sinal);
  } catch (erro) {
    if (!valeTentarDeNovo(erro, sinal)) {
      throw erro;
    }
    await esperar(ESPERA_ANTES_DE_TENTAR_DE_NOVO, sinal);
    return pedirUmaVez(url, sinal);
  }
}

// Converte uma cor do formato da API para o do CombinaCor: { hex, nome, exato }.
// exato é false quando a API não tem nome para a cor e manda o nome da cor mais parecida.
// A resposta vem de fora, então o formato é conferido antes de usar.
function converterCor(dados) {
  const hex = dados && dados.hex ? normalizarHex(dados.hex.value) : null;
  if (hex === null || !dados.name || typeof dados.name.value !== 'string') {
    throw new ErroDaApi('A The Color API mandou uma resposta num formato inesperado.');
  }
  return {
    hex: hex,
    nome: dados.name.value,
    exato: dados.name.exact_match_name === true,
  };
}

// Endpoint /id: o nome de uma cor. Devolve { hex, nome, exato }.
export async function buscarNomeDaCor(hex, sinal) {
  if (nomesEmCache.has(hex)) {
    return nomesEmCache.get(hex);
  }
  const dados = await pedir('/id', { hex: hex.slice(1) }, sinal);
  const cor = converterCor(dados);
  nomesEmCache.set(hex, cor);
  return cor;
}

// Endpoint /scheme: uma paleta montada pela própria API num estilo (modo).
// Devolve uma lista de { hex, nome, exato }.
export async function buscarPaleta(hex, modo, quantidade, sinal) {
  const dados = await pedir('/scheme', { hex: hex.slice(1), mode: modo, count: quantidade }, sinal);
  if (!Array.isArray(dados.colors)) {
    throw new ErroDaApi('A The Color API mandou uma resposta num formato inesperado.');
  }
  const cores = dados.colors.map(converterCor);
  // As cores já vêm com nome, então entram no cache também.
  for (const cor of cores) {
    nomesEmCache.set(cor.hex, cor);
  }
  return cores;
}

// Paletas em todos os estilos, pedidas ao mesmo tempo.
// Com allSettled, um estilo que falha não esconde os que deram certo (o Promise.all rejeitaria tudo).
// Devolve { grupos, falhas }: grupos é uma lista de { modo, cores } e falhas é quantos não vieram.
// Só rejeita se nenhum estilo vier.
export async function buscarPaletasDeTodosOsEstilos(hex, quantidade, sinal) {
  const modos = Object.keys(MODOS_API);
  const resultados = await Promise.allSettled(modos.map((modo) => buscarPaleta(hex, modo, quantidade, sinal)));

  const grupos = [];
  resultados.forEach((resultado, i) => {
    if (resultado.status === 'fulfilled') {
      grupos.push({ modo: modos[i], cores: resultado.value });
    }
  });
  if (grupos.length === 0) {
    throw resultados[0].reason;
  }
  return { grupos: grupos, falhas: modos.length - grupos.length };
}

// Transforma um erro em um texto para mostrar na página.
// Tempo limite: TimeoutError. Sem resposta nenhuma (sem internet): TypeError.
export function explicarErro(erro) {
  if (erro.name === 'TimeoutError') {
    return 'A The Color API demorou demais para responder. Tente de novo daqui a pouco.';
  }
  if (erro.name === 'TypeError') {
    return 'Não deu para falar com a The Color API. Confira a conexão com a internet e tente de novo.';
  }
  return erro.message;
}
