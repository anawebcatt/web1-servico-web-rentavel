import { describe, expect, test } from 'vitest';
import { LIMITE_FAVORITAS, adicionarFavorita, mesmaPaleta, removerFavorita } from './armazenamento.js';

const azul = { cor: '#0047AB', tipo: 'triade' };
const azulAnaloga = { cor: '#0047AB', tipo: 'analoga' };
const verde = { cor: '#00AA44', tipo: 'triade' };

describe('favoritas', () => {
  test('duas paletas são iguais se a cor e o tipo forem iguais', () => {
    expect(mesmaPaleta(azul, { cor: '#0047AB', tipo: 'triade' })).toBe(true);
    expect(mesmaPaleta(azul, azulAnaloga)).toBe(false);
    expect(mesmaPaleta(azul, verde)).toBe(false);
  });

  test('a mais recente entra no começo e a lista original não muda', () => {
    const antes = [azul];
    const depois = adicionarFavorita(antes, verde);
    expect(depois).toEqual([verde, azul]);
    expect(antes).toEqual([azul]);
  });

  test('salvar de novo não repete: a paleta sobe para o começo', () => {
    expect(adicionarFavorita([verde, azul], azul)).toEqual([azul, verde]);
  });

  test('guarda no máximo o limite, ficando com as mais recentes', () => {
    let lista = [];
    for (let i = 0; i < LIMITE_FAVORITAS + 3; i++) {
      lista = adicionarFavorita(lista, { cor: `#0000${String(i).padStart(2, '0')}`, tipo: 'triade' });
    }
    expect(lista).toHaveLength(LIMITE_FAVORITAS);
    expect(lista[0].cor).toBe(`#0000${LIMITE_FAVORITAS + 2}`);
  });

  test('remover tira só a paleta pedida', () => {
    expect(removerFavorita([azul, azulAnaloga, verde], azulAnaloga)).toEqual([azul, verde]);
  });
});
