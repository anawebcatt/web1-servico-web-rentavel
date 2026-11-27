// Recursos nativos do navegador: Clipboard API e EyeDropper (conta-gotas).
// Não mexe na página: só usa os recursos e devolve o resultado.

import { normalizarHex } from '../lib/cores.js';

// A Clipboard API só existe em HTTPS ou localhost (contexto seguro).
export function podeCopiar() {
  return window.isSecureContext && navigator.clipboard !== undefined;
}

// Devolve true se copiou. writeText pode falhar se a pessoa negar a
// permissão ou se a página não estiver em foco.
export async function copiarTexto(texto) {
  if (!podeCopiar()) {
    return false;
  }
  try {
    await navigator.clipboard.writeText(texto);
    return true;
  } catch {
    return false;
  }
}

// O EyeDropper só existe no Chrome e no Edge para computador.
export function temContaGotas() {
  return 'EyeDropper' in window;
}

// Abre o conta-gotas e devolve o HEX da cor clicada, ou null se a pessoa
// apertar Esc. Só funciona dentro de um clique (gesto da pessoa).
export async function pegarCorDaTela() {
  try {
    const resultado = await new EyeDropper().open();
    return normalizarHex(resultado.sRGBHex);
  } catch {
    if (erro.name === 'AbortError') {
      return null;
    }
    throw erro;
  }
}

// Se não der para copiar, seleciona o texto para a pessoa usar Ctrl+C.
export function selecionarTexto(elemento) {
  const intervalo = document.createRange();
  intervalo.selectNodeContents(elemento);
  getSelection().removeAllRanges();
  getSelection().addRange(intervalo);
}
