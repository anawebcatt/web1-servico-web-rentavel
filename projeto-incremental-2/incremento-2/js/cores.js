// Funções de cor do CombinaCor: conversão entre formatos e geração de paletas.

const DIGITOS_HEX = '0123456789ABCDEF';

// Cada harmonia diz o que ajustar na cor base e em quanto, uma vez para cada cor da paleta.
// "matiz" gira a cor no círculo cromático (em graus); "luminosidade" deixa mais escura ou mais clara (em %).
// O valor 0 é a própria cor base.
const HARMONIAS = {
  complementar: { nome: 'Complementar', ajuste: 'matiz', valores: [0, 180] },
  analoga: { nome: 'Análoga', ajuste: 'matiz', valores: [-30, 0, 30] },
  triade: { nome: 'Tríade', ajuste: 'matiz', valores: [0, 120, 240] },
  monocromatica: { nome: 'Monocromática', ajuste: 'luminosidade', valores: [-30, -15, 0, 15, 30] },
};

// Aceita "#0047ab", "0047AB" ou a forma curta "#04a". Devolve "#RRGGBB" ou null se não for um HEX válido.
function normalizarHex(texto) {
  if (typeof texto !== 'string') {
    return null;
  }

  let hex = texto.trim().toUpperCase();
  if (hex.startsWith('#')) {
    hex = hex.slice(1);
  }
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }
  if (hex.length !== 6) {
    return null;
  }

  for (const caractere of hex) {
    if (!DIGITOS_HEX.includes(caractere)) {
      return null;
    }
  }
  return '#' + hex;
}

function hexParaRgb(hex) {
  return {
    r: parseInt(hex.slice(1, 3), 16),
    g: parseInt(hex.slice(3, 5), 16),
    b: parseInt(hex.slice(5, 7), 16),
  };
}

function rgbParaHex(rgb) {
  let hex = '#';
  for (const canal of [rgb.r, rgb.g, rgb.b]) {
    hex += canal.toString(16).padStart(2, '0');
  }
  return hex.toUpperCase();
}

// Matiz em graus (0 a 360), saturação e luminosidade em % (0 a 100), sem arredondar.
function rgbParaHsl(rgb) {
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;
  const maximo = Math.max(r, g, b);
  const minimo = Math.min(r, g, b);
  const delta = maximo - minimo;
  const l = (maximo + minimo) / 2;

  let h = 0;
  let s = 0;
  if (delta !== 0) {
    s = delta / (1 - Math.abs(2 * l - 1));

    if (maximo === r) {
      h = ((g - b) / delta) % 6;
    } else if (maximo === g) {
      h = (b - r) / delta + 2;
    } else {
      h = (r - g) / delta + 4;
    }
    h = h * 60;
    if (h < 0) {
      h = h + 360;
    }
  }

  return { h: h, s: s * 100, l: l * 100 };
}

function hslParaRgb(hsl) {
  const s = hsl.s / 100;
  const l = hsl.l / 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((hsl.h / 60) % 2) - 1));
  const m = l - c / 2;

  let canais;
  if (hsl.h < 60) {
    canais = [c, x, 0];
  } else if (hsl.h < 120) {
    canais = [x, c, 0];
  } else if (hsl.h < 180) {
    canais = [0, c, x];
  } else if (hsl.h < 240) {
    canais = [0, x, c];
  } else if (hsl.h < 300) {
    canais = [x, 0, c];
  } else {
    canais = [c, 0, x];
  }

  return {
    r: Math.round((canais[0] + m) * 255),
    g: Math.round((canais[1] + m) * 255),
    b: Math.round((canais[2] + m) * 255),
  };
}

// Uma cor da paleta guarda os três formatos juntos. O HEX precisa estar normalizado.
function criarCor(hex) {
  const rgb = hexParaRgb(hex);
  return { hex: hex, rgb: rgb, hsl: rgbParaHsl(rgb) };
}

function formatarRgb(rgb) {
  return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
}

function formatarHsl(hsl) {
  return `hsl(${Math.round(hsl.h)}, ${Math.round(hsl.s)}%, ${Math.round(hsl.l)}%)`;
}

function girarMatiz(h, graus) {
  return (h + graus + 360) % 360;
}

function limitar(valor, minimo, maximo) {
  return Math.min(Math.max(valor, minimo), maximo);
}

// Cinza, branco e preto não têm matiz: girar o círculo cromático não muda nada.
function ehCorNeutra(cor) {
  return cor.hsl.s < 1;
}

function removerRepetidas(paleta) {
  const unicas = [];
  for (const cor of paleta) {
    if (!unicas.some((outra) => outra.hex === cor.hex)) {
      unicas.push(cor);
    }
  }
  return unicas;
}

// Gera a paleta a partir de uma cor HEX normalizada e de uma chave de HARMONIAS.
function gerarPaleta(hexBase, tipo) {
  const harmonia = HARMONIAS[tipo];
  const base = criarCor(hexBase);
  let paleta = [];

  for (const valor of harmonia.valores) {
    if (valor === 0) {
      paleta.push(base);
      continue;
    }

    const hsl = { h: base.hsl.h, s: base.hsl.s, l: base.hsl.l };
    if (harmonia.ajuste === 'matiz') {
      hsl.h = girarMatiz(hsl.h, valor);
    } else {
      hsl.l = limitar(hsl.l + valor, 0, 100);
    }
    paleta.push(criarCor(rgbParaHex(hslParaRgb(hsl))));
  }

  // Perto do branco ou do preto, a luminosidade bate no limite e algumas cores saem iguais.
  paleta = removerRepetidas(paleta);
  if (harmonia.ajuste === 'luminosidade') {
    paleta.sort((a, b) => a.hsl.l - b.hsl.l);
  }
  return paleta;
}

// CSS pronto para colar: uma variável para cada cor da paleta.
function gerarCss(paleta) {
  let css = ':root {\n';
  for (let i = 0; i < paleta.length; i++) {
    css += `  --cor-${i + 1}: ${paleta[i].hex};\n`;
  }
  return css + '}';
}
