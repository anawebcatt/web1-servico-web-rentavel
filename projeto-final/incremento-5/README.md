# Incremento 5 — Serviços e APIs

**Status:** feito. Começou como uma cópia do [incremento 4](../incremento-4/).

**Foco:** `fetch`, serviços e `async`/`await`.

**Objetivo:** reorganizar o consumo de APIs e operações assíncronas.

## O que muda nesta versão

1. **Pasta `servicos/`.** Tudo que fala com algo fora do app (a The Color API, o `localStorage` e os recursos do navegador) ficou em [`src/servicos/`](src/servicos/). A pasta `lib/` ficou só com o `cores.js`, que faz contas e não fala com ninguém.
2. **Um serviço para a The Color API.** O [`colorApi.js`](src/servicos/colorApi.js) é o único arquivo que chama `fetch`. Componentes e hooks pedem "o nome desta cor" ou "paletas neste estilo" e recebem os dados prontos, sem saber de URL, status HTTP ou formato do JSON.
3. **O componente `Ideias` não busca mais nada.** A lógica de buscar um estilo ou todos estava dentro do componente. A parte de rede foi para o serviço e o controle da busca foi para o hook novo [`useIdeias`](src/hooks/useIdeias.js). O componente ficou só com a tela.
4. **Nova tentativa automática** (novo). Se a API responder com erro 5xx ou a rede falhar no meio, o serviço espera 600 ms e tenta mais uma vez antes de mostrar o erro.
5. **Busca de ideias cancelável** (novo). Enquanto a busca está em andamento, aparece um botão "Cancelar". A busca também é cancelada se uma nova começar ou se o componente sair da página.

## Arquivos

```
src/
├── lib/
│   └── cores.js              # contas de cor (sem rede, sem navegador)
├── servicos/                 # pasta nova
│   ├── colorApi.js           # era lib/api.js, reescrito
│   ├── armazenamento.js      # era lib/armazenamento.js (igual)
│   └── navegador.js          # era lib/recursos.js (igual): Clipboard e conta-gotas
├── hooks/
│   ├── useIdeias.js          # novo
│   ├── useNomesDasCores.js   # só mudou o import
│   └── ...
└── components/
    ├── Ideias.jsx            # de 110 para 63 linhas
    └── ...
```

## As camadas

```
Componente (Ideias, Paleta)        mostra dados e avisa cliques
        │
Hook (useIdeias, useNomesDasCores) guarda o estado da busca: fase, resultado, erro
        │
Serviço (colorApi.js)              monta a URL, chama fetch, confere e converte a resposta
        │
The Color API
```

Cada camada só conversa com a de baixo. Se a The Color API mudar de endereço ou de formato, só o `colorApi.js` muda. Se a tela das ideias mudar, o serviço não é tocado.

## O serviço da The Color API

| Função | Exportada | O que faz |
|---|---|---|
| `buscarNomeDaCor(hex, sinal)` | Sim | Endpoint `/id`. Devolve `{ hex, nome, exato }`. Usa o cache |
| `buscarPaleta(hex, modo, quantidade, sinal)` | Sim | Endpoint `/scheme`. Devolve uma lista de cores |
| `buscarPaletasDeTodosOsEstilos(hex, quantidade, sinal)` | Sim | Seis pedidos ao mesmo tempo. Devolve `{ grupos, falhas }` |
| `explicarErro(erro)` | Sim | Transforma um erro num texto para a página |
| `MODOS_API` | Sim | Estilos da API e o nome de cada um em português |
| `pedir(caminho, parametros, sinal)` | Não | Monta a URL e tenta de novo se o problema for passageiro |
| `pedirUmaVez(url, sinal)` | Não | O `fetch`, com tempo limite e conferência do status |
| `esperar(ms, sinal)` | Não | Uma pausa para usar com `await`, que pode ser cancelada |
| `converterCor(dados)` | Não | Confere o formato da resposta e fica só com o que o app usa |
| `ErroDaApi` | Não | Erro com a mensagem pronta e a marca `passageiro` |

O que mudou em relação ao `api.js`:

- `buscarPaleta` aceita um `sinal` para cancelar (antes só os nomes podiam ser cancelados);
- a busca de todos os estilos, com `Promise.allSettled`, veio do componente para cá;
- as funções auxiliares e as constantes deixaram de ser exportadas: de fora só se vê o necessário;
- o cache é um `Map` em vez de um objeto;
- a nova tentativa e a classe `ErroDaApi` são novas.

## Quando o serviço tenta de novo

| Situação | Tenta de novo? | Por quê |
|---|---|---|
| Erro 5xx (500, 503...) | Sim, uma vez | O servidor falhou; costuma ser passageiro |
| Falha de rede (`TypeError`) com internet | Sim, uma vez | A conexão oscilou |
| Erro 4xx (404, 400...) | Não | O pedido está errado; repetir dá o mesmo erro |
| Tempo limite de 8 s (`TimeoutError`) | Não | A pessoa já esperou bastante |
| Sem internet (`navigator.onLine` é `false`) | Não | Vai falhar de novo; o incremento 4 refaz a busca quando a conexão volta |
| Pedido cancelado | Não | Ninguém quer mais a resposta |
| Resposta num formato inesperado | Não | Repetir dá a mesma resposta |

## Onde aparece cada conceito

| Conceito | Onde |
|---|---|
| `fetch` | `pedirUmaVez` no `colorApi.js` (único lugar) |
| Conferir `resposta.ok` | `pedirUmaVez`: o `fetch` não rejeita em 404 ou 500 |
| `async`/`await` | Todas as funções do serviço; `buscar` no `useIdeias`; `aoEnviar` no `Ideias` |
| `try`/`catch` com `await` | `pedir` (nova tentativa), `buscar` no `useIdeias`, `buscarNome` no `useNomesDasCores` |
| Criar uma Promise | `esperar`, que embrulha o `setTimeout` |
| `Promise.all` | `useNomesDasCores`: os nomes da paleta ao mesmo tempo |
| `Promise.allSettled` | `buscarPaletasDeTodosOsEstilos`: um estilo que falha não derruba os outros |
| `AbortController` e `AbortSignal` | Cancelar: `useIdeias` e `useNomesDasCores`. Tempo limite: `AbortSignal.timeout`. Juntar os dois: `AbortSignal.any` |
| `URLSearchParams` | `pedir`, para montar os parâmetros da URL |
| Erro próprio (`class ... extends Error`) | `ErroDaApi` |
| Conferir dados que vêm de fora | `converterCor` e o `Array.isArray` em `buscarPaleta` |
| Cache | `nomesEmCache` (`Map`) no serviço |
| Estado de uma operação assíncrona | `busca.fase` no `useIdeias`: `parada`, `buscando`, `pronta`, `cancelada`, `erro` |
| `useRef` para guardar algo que não aparece na tela | O `AbortController` da busca em andamento, no `useIdeias` |
| Resposta atrasada ignorada | `if (!sinal.aborted)` antes de cada `setBusca` e `setNomes` |

## Como rodar

```bash
cd projeto-final/incremento-5
npm install
npm run dev
```

Acesse o endereço que aparecer no terminal (normalmente http://localhost:5173). `npm run lint` confere o código e `npm run build` gera a versão de produção.

## Como testar

- **Uso normal:** tudo funciona como no incremento 4 (nomes, ideias num estilo e em todos).
- **Cancelar:** no DevTools, em **Network**, escolha a velocidade **Slow 3G** (ou "3G"). Clique em "Buscar ideias" e depois em "Cancelar". Aparece "Busca cancelada." e os pedidos ficam como "(canceled)" na lista.
- **Erro e nova tentativa:** em **Network**, clique com o botão direito num pedido a `thecolorapi.com/scheme` e escolha **Block request URL**. Busque de novo: aparecem dois pedidos bloqueados (a tentativa e a nova tentativa) e depois a mensagem de erro. As ideias anteriores continuam na tela.
- **Sem internet:** em **Offline**, a busca falha na hora, sem nova tentativa.
