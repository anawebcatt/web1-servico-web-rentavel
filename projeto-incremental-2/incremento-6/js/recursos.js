// Recursos nativos do navegador: Clipboard API e EyeDropper (conta-gotas).
// Não mexe na página: só usa os recursos e devolve o resultado.

// A Clipboard API só existe em HTTPS ou localhost (contexto seguro).
function podeCopiar() {
  return window.isSecureContext && navigator.clipboard !== undefined;
}

// Devolve true se copiou. writeText pode falhar se a pessoa negar a
// permissão ou se a página não estiver em foco.
async function copiarTexto(texto) {
  if (!podeCopiar()) {
    return false;
  }
  try {
    await navigator.clipboard.writeText(texto);
    return true;
  } catch (erro) {
    return false;
  }
}

// O EyeDropper só existe no Chrome e no Edge para computador.
function temContaGotas() {
  return 'EyeDropper' in window;
}

// Abre o conta-gotas e devolve o HEX da cor clicada, ou null se a pessoa
// apertar Esc. Só funciona dentro de um clique (gesto da pessoa).
async function pegarCorDaTela() {
  try {
    const resultado = await new EyeDropper().open();
    return normalizarHex(resultado.sRGBHex);
  } catch (erro) {
    if (erro.name === 'AbortError') {
      return null;
    }
    throw erro;
  }
}
