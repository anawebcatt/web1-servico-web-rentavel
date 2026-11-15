// Guarda as preferências e as paletas favoritas no localStorage do navegador.
// Não mexe na página: só lê e grava os dados.

const CHAVE_PREFERENCIAS = 'combinacor:preferencias';
const CHAVE_FAVORITAS = 'combinacor:favoritas';
const LIMITE_FAVORITAS = 12;

// O localStorage só guarda texto, então os dados vão e voltam como JSON.
// Armazenamento bloqueado ou texto estragado devolvem o valor padrão.
function lerDoArmazenamento(chave, valorPadrao) {
  try {
    const texto = localStorage.getItem(chave);
    if (texto === null) {
      return valorPadrao;
    }
    return JSON.parse(texto);
  } catch (erro) {
    return valorPadrao;
  }
}

// Devolve false se não deu para gravar (armazenamento bloqueado ou cheio).
function gravarNoArmazenamento(chave, valor) {
  try {
    localStorage.setItem(chave, JSON.stringify(valor));
    return true;
  } catch (erro) {
    return false;
  }
}

function removerDoArmazenamento(chave) {
  try {
    localStorage.removeItem(chave);
    return true;
  } catch (erro) {
    return false;
  }
}

// Qualquer pessoa pode editar o localStorage pelo DevTools, então tudo que vem de lá é conferido.
function ehPaletaValida(dados) {
  return (
    dados !== null &&
    typeof dados === 'object' &&
    normalizarHex(dados.cor) === dados.cor &&
    Object.hasOwn(HARMONIAS, dados.tipo)
  );
}

// Última cor e último tipo usados, ou null se não houver nada salvo.
function carregarPreferencias() {
  const preferencias = lerDoArmazenamento(CHAVE_PREFERENCIAS, null);
  return ehPaletaValida(preferencias) ? preferencias : null;
}

function salvarPreferencias(cor, tipo) {
  return gravarNoArmazenamento(CHAVE_PREFERENCIAS, { cor: cor, tipo: tipo });
}

// Lista de favoritas, da mais recente para a mais antiga. Cada uma é { cor, tipo }.
function carregarFavoritas() {
  const favoritas = lerDoArmazenamento(CHAVE_FAVORITAS, []);
  if (!Array.isArray(favoritas)) {
    return [];
  }
  return favoritas.filter(ehPaletaValida);
}

// Lista vazia apaga a chave, para não deixar lixo no navegador.
function salvarFavoritas(favoritas) {
  if (favoritas.length === 0) {
    return removerDoArmazenamento(CHAVE_FAVORITAS);
  }
  return gravarNoArmazenamento(CHAVE_FAVORITAS, favoritas);
}

function mesmaPaleta(a, b) {
  return a.cor === b.cor && a.tipo === b.tipo;
}

// Funções que devolvem uma lista nova, sem alterar a original.

function adicionarFavorita(favoritas, paleta) {
  const semRepetir = favoritas.filter((outra) => !mesmaPaleta(outra, paleta));
  return [paleta, ...semRepetir].slice(0, LIMITE_FAVORITAS);
}

function removerFavorita(favoritas, paleta) {
  return favoritas.filter((outra) => !mesmaPaleta(outra, paleta));
}
