# Incremento 5 — Assincronismo e concorrência

**Status:** feito. Começou como uma cópia do [incremento 4](../incremento-4/).

**Foco:** Promises, `async`/`await` e `Promise.all`.

**Objetivo:** executar operações assíncronas e requisições independentes.

## O que o CombinaCor faz nesta versão

Tudo do incremento 4, e mais:

1. **Nomes ao mesmo tempo.** Os nomes de todas as cores da paleta são pedidos juntos, com `Promise.all`, em vez de um por vez. Cada nome aparece assim que chega.
2. **Pedidos velhos cancelados de verdade.** Se a paleta muda enquanto os nomes ainda estão chegando, os pedidos antigos são cancelados com `AbortController`. No incremento 4 eles continuavam até o fim e a resposta só era ignorada.
3. **Tempo limite.** Se a The Color API passar de 8 segundos sem responder, o pedido é cancelado e aparece um aviso, em vez de o bloco ficar em "Buscando nome…" para sempre.
4. **Todos os estilos de uma vez.** Em "Ideias da The Color API", a opção "Todos os estilos" pede as 6 paletas da API ao mesmo tempo e mostra cada uma no seu grupo. Se um estilo falhar, os outros aparecem do mesmo jeito.

## Arquivos

- [`js/api.js`](js/api.js): reescrito com `async`/`await`. Aceita um `signal` para cancelar o pedido e tem tempo limite.
- [`js/main.js`](js/main.js): nomes em paralelo, cancelamento e a busca de todos os estilos.
- [`index.html`](index.html): as ideias agora ficam em grupos (`#lista-ideias` virou uma `div`).
- [`css/style.css`](css/style.css): título de cada grupo de ideias.
- [`js/cores.js`](js/cores.js) e [`js/armazenamento.js`](js/armazenamento.js): iguais aos do incremento 4.

## Um por vez x ao mesmo tempo

Paleta monocromática, 5 cores, cerca de 150 ms por pedido à The Color API:

| | Incremento 4 (um por vez) | Incremento 5 (`Promise.all`) |
|---|---|---|
| Quando cada pedido sai | Depois que o anterior termina | Todos juntos |
| Tempo até o último nome | ~5 × 150 ms = ~750 ms | ~150 ms (o tempo do mais lento) |
| "Todos os estilos" (6 × ~1 s) | — | ~1 s em vez de ~6 s |

Dá para ver a diferença no DevTools, aba Network: no incremento 4 as barras dos pedidos ficam em escada; aqui elas começam juntas.

## `Promise.all` x `Promise.allSettled`

- **Nomes da paleta (`Promise.all`):** `Promise.all` rejeita tudo se uma Promise falhar. Por isso cada pedido passa antes por `buscarEMostrarNome`, que trata o próprio erro e nunca rejeita: devolve `null` se deu certo ou o erro se falhou. Assim um nome que falha não apaga os outros, e o `Promise.all` só serve para saber quando o último terminou.
- **Todos os estilos (`Promise.allSettled`):** `allSettled` espera todas e diz, para cada uma, se deu certo (`fulfilled`) ou não (`rejected`). Os estilos que vieram aparecem e o status diz quantos falharam. Só se todos falharem aparece a mensagem de erro.

## Onde aparece cada conceito

| Conceito | Onde |
|---|---|
| `async` / `await` | Todas as funções do `api.js`; `buscarNomesDaPaleta` e o envio do formulário de ideias no `main.js` |
| `try` / `catch` / `finally` com `await` | Envio do formulário de ideias (o botão volta a funcionar no `finally`) e `buscarEMostrarNome` |
| `Promise.all` | `buscarNomesDaPaleta`: todos os nomes ao mesmo tempo |
| `Promise.allSettled` | `buscarTodosOsEstilos`: 6 pedidos ao `/scheme`, cada um podendo falhar sozinho |
| `AbortController` e `signal` | `agendarNomes` cancela os pedidos da paleta anterior; `buscarJson` repassa o `signal` ao `fetch` |
| `AbortSignal.timeout` e `AbortSignal.any` | `buscarJson`: junta o cancelamento com o tempo limite de 8 s |
| Tipos de erro | `explicarErroDaApi`: `AbortError` (cancelado), `TimeoutError` (demorou), `TypeError` (sem conexão) |
| Função `async` sempre devolve Promise | `buscarNomeDaCor` devolve o nome do cache direto, sem `Promise.resolve` como no incremento 4 |

`AbortSignal.any` funciona no Chrome 116+, Firefox 124+ e Safari 17.4+.

## Como testar

Na pasta do repositório:

```bash
python3 -m http.server 8000 --directory projeto-incremental-2
```

Acesse http://localhost:8000/incremento-5/ e:

- troque o tipo de paleta e veja, no DevTools (aba Network, filtro "Fetch/XHR"), os pedidos de nome começando juntos; compare com o incremento 4;
- troque a cor rápido duas vezes seguidas e veja pedidos marcados como "(canceled)" na aba Network;
- em "Ideias da The Color API", deixe "Todos os estilos" e clique em "Buscar ideias";
- na aba Network, use "Offline" para ver os avisos, e "Slow 3G" para ver os nomes chegando em ordens diferentes.
