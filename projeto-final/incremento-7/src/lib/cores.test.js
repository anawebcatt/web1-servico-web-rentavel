import { describe, expect, test } from 'vitest';
import {
  criarCor,
  ehCorNeutra,
  formatarHsl,
  formatarRgb,
  gerarCss,
  gerarPaleta,
  hexParaRgb,
  normalizarHex,
  rgbParaHex,
} from './cores.js';

function hexes(paleta) {
  return paleta.map((cor) => cor.hex);
}

describe('normalizarHex', () => {
  test('aceita com ou sem #, em maiúsculas ou minúsculas', () => {
    expect(normalizarHex('#0047ab')).toBe('#0047AB');
    expect(normalizarHex('0047AB')).toBe('#0047AB');
    expect(normalizarHex('  #0047ab ')).toBe('#0047AB');
  });

  test('expande a forma curta', () => {
    expect(normalizarHex('#04a')).toBe('#0044AA');
  });

  test('devolve null para o que não é HEX', () => {
    expect(normalizarHex('xyz')).toBeNull();
    expect(normalizarHex('#12345')).toBeNull();
    expect(normalizarHex('#1234567')).toBeNull();
    expect(normalizarHex('')).toBeNull();
    expect(normalizarHex(undefined)).toBeNull();
    expect(normalizarHex(123456)).toBeNull();
  });
});

describe('conversões', () => {
  test('HEX para RGB e de volta', () => {
    expect(hexParaRgb('#0047AB')).toEqual({ r: 0, g: 71, b: 171 });
    expect(rgbParaHex({ r: 0, g: 71, b: 171 })).toBe('#0047AB');
  });

  test('textos prontos para o CSS', () => {
    const cor = criarCor('#06459E');
    expect(formatarRgb(cor.rgb)).toBe('rgb(6, 69, 158)');
    expect(formatarHsl(cor.hsl)).toBe('hsl(215, 93%, 32%)');
  });

  test('cinza, branco e preto são cores neutras', () => {
    expect(ehCorNeutra(criarCor('#808080'))).toBe(true);
    expect(ehCorNeutra(criarCor('#FFFFFF'))).toBe(true);
    expect(ehCorNeutra(criarCor('#0047AB'))).toBe(false);
  });
});

describe('gerarPaleta', () => {
  test('complementar: a cor base e a oposta', () => {
    expect(hexes(gerarPaleta('#0047AB', 'complementar'))).toEqual(['#0047AB', '#AB6400']);
  });

  test('análoga: a cor base fica no meio', () => {
    expect(hexes(gerarPaleta('#0044AA', 'analoga'))).toEqual(['#0099AA', '#0044AA', '#1100AA']);
  });

  test('tríade: três cores', () => {
    expect(hexes(gerarPaleta('#0044AA', 'triade'))).toEqual(['#0044AA', '#AA0044', '#44AA00']);
  });

  test('monocromática: da mais escura para a mais clara', () => {
    expect(hexes(gerarPaleta('#808080', 'monocromatica'))).toEqual([
      '#343434',
      '#5A5A5A',
      '#808080',
      '#A6A6A6',
      '#CCCCCC',
    ]);
  });

  test('perto do branco, as cores repetidas são tiradas', () => {
    const paleta = hexes(gerarPaleta('#FFFFFF', 'monocromatica'));
    expect(new Set(paleta).size).toBe(paleta.length);
    expect(paleta.length).toBeLessThan(5);
  });
});

describe('gerarCss', () => {
  test('uma variável para cada cor', () => {
    expect(gerarCss(gerarPaleta('#0047AB', 'complementar'))).toBe(
      ':root {\n  --cor-1: #0047AB;\n  --cor-2: #AB6400;\n}'
    );
  });
});
