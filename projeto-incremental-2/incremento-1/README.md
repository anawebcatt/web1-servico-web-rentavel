# Incremento 1 — JS básico

**Status:** feito.

**Foco:** variáveis, tipos, operadores, condicionais, loops, funções, arrays e objetos.

**Objetivo:** criar a primeira versão funcional do serviço.

## O que o CombinaCor faz nesta versão

1. Pede a cor base em HEX com `prompt` e valida a resposta (aceita `#0047AB`, `0047ab` e a forma curta `#04a`).
2. Pede o tipo de paleta: complementar, análoga, tríade ou monocromática.
3. Gera a paleta e mostra os códigos HEX num `alert`.
4. Mostra no console (F12 → Console) uma amostra de cada cor com os códigos HEX, RGB e HSL, e o CSS pronto com uma variável para cada cor.
5. Pergunta se a pessoa quer gerar outra paleta.

A página ainda não mostra a paleta.

## Arquivos

- [`js/cores.js`](js/cores.js): conversões entre HEX, RGB e HSL e geração das paletas. Não mexe na página.
- [`js/main.js`](js/main.js): perguntas com `prompt` e saída no `alert` e no console.

## Onde aparece cada conceito

| Conceito | Onde |
|---|---|
| Variáveis (`const`, `let`) | Em todas as funções; `HARMONIAS` e `DIGITOS_HEX` no topo do `cores.js` |
| Tipos | `typeof` em `normalizarHex`; conversão de texto para número com `parseInt` e `Number` |
| Operadores | Contas de cor em `rgbParaHsl` e `hslParaRgb`; `%` em `girarMatiz`; `&&` e `!` nas validações |
| Condicionais | `if`/`else if` em `rgbParaHsl` e `hslParaRgb`; validações em `normalizarHex` e `pedirHarmonia` |
| Loops | `for...of` em `normalizarHex` e `gerarPaleta`; `for` em `gerarCss`; `while` nas perguntas; `do...while` em `iniciar` |
| Funções | Uma função para cada tarefa, como `hexParaRgb`, `gerarPaleta` e `pedirCor` |
| Arrays | A paleta é um array de cores; `push`, `some`, `sort`, `map` e `join` |
| Objetos | Cada cor é um objeto `{ hex, rgb, hsl }`; `HARMONIAS` descreve cada tipo de paleta |

## Como testar

Na pasta do repositório:

```bash
python3 -m http.server 8000 --directory projeto-incremental-2
```

Acesse http://localhost:8000/incremento-1/ e responda às perguntas.
