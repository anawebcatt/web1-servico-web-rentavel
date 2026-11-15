# Incremento 4 — APIs

**Status:** feito. Começou como uma cópia do [incremento 3](../incremento-3/).

**Foco:** `fetch`, HTTP e JSON.

**Objetivo:** consumir dados de APIs públicas quando fizer sentido.

## O que o CombinaCor faz nesta versão

Tudo do incremento 3, e mais:

1. **Nome de cada cor.** Cada bloco da paleta mostra o nome da cor, buscado na [The Color API](https://www.thecolorapi.com/) (em inglês). Quando a cor não tem nome próprio, aparece o da cor mais parecida, com `≈` na frente (ex.: `≈ Terracotta`).
2. **Ideias da The Color API.** Uma seção nova pede à API uma paleta de 5 cores no estilo escolhido (análoga, complementar, tríade etc.). Clicar numa das cores faz dela a nova cor base.
3. **Sem internet ou com a API fora do ar,** a paleta continua funcionando com as contas do `cores.js`. Os blocos mostram "Nome indisponível" e um aviso explica o que houve.

## Arquivos

- [`index.html`](index.html): ganhou o aviso dos nomes, a seção "Ideias da The Color API" e o texto "De onde vêm os nomes das cores".
- [`css/style.css`](css/style.css): estilos do nome nos blocos e das ideias.
- [`js/api.js`](js/api.js): **novo.** Faz os pedidos à API com `fetch` e devolve só os dados que o CombinaCor usa. Não mexe na página.
- [`js/main.js`](js/main.js): pede os nomes quando a paleta muda e liga o formulário de ideias.
- [`js/cores.js`](js/cores.js) e [`js/armazenamento.js`](js/armazenamento.js): iguais aos do incremento 3, só com comentários mais curtos.

## Endpoints usados

| Endpoint | Para quê | Exemplo |
|---|---|---|
| `GET /id?hex=` | Nome de uma cor | https://www.thecolorapi.com/id?hex=0047AB → `"name": {"value": "Cobalt", "exact_match_name": true}` |
| `GET /scheme?hex=&mode=&count=` | Paleta montada pela API | https://www.thecolorapi.com/scheme?hex=0047AB&mode=triad&count=5 |

A API não precisa de chave e tem CORS liberado (`Access-Control-Allow-Origin: *`), então dá para chamar direto do navegador, sem back-end.

## Como os pedidos funcionam

- **Um nome por vez.** Os nomes são buscados em sequência: o pedido da próxima cor só sai quando o anterior termina. No [incremento 5](../incremento-5/) isso muda para todos ao mesmo tempo, com `Promise.all`.
- **Espera antes de pedir.** Arrastar o seletor de cor muda a paleta dezenas de vezes por segundo. O CombinaCor espera 400 ms sem mudanças antes de pedir os nomes, para não mandar um pedido a cada movimento.
- **Pedidos velhos são ignorados.** Se a paleta mudar enquanto os nomes ainda estão chegando, a busca antiga para e a resposta dela não é escrita na página.
- **Cache.** Cada nome buscado fica guardado enquanto a página está aberta. Voltar para uma cor já vista mostra o nome na hora, sem novo pedido.

## Onde aparece cada conceito

| Conceito | Onde |
|---|---|
| `fetch` (GET) | `buscarJson` no `api.js` |
| Status HTTP e `resposta.ok` | `buscarJson`: 404, 500 etc. viram um erro com o código na mensagem |
| JSON | `resposta.json()` transforma o texto da resposta em objeto |
| Ler só o necessário do JSON | `lerCorDaApi` pega `hex.value`, `name.value` e `name.exact_match_name` |
| Montar a URL com parâmetros | `URLSearchParams` em `buscarPaletaDaApi` |
| `.then` / `.catch` / `.finally` | `buscarNomesUmPorUm` e o envio do formulário de ideias, no `main.js` |
| Falha de rede x erro do servidor | `explicarErroDaApi`: sem resposta nenhuma, o `fetch` dá `TypeError`; com resposta de erro, quem avisa é `resposta.ok` |
| Formulário com `submit` | `#form-ideias`, com `preventDefault`; o botão fica desativado durante o pedido |
| Temporizador | `setTimeout` e `clearTimeout` em `agendarNomes` |

## Como testar

Na pasta do repositório:

```bash
python3 -m http.server 8000 --directory projeto-incremental-2
```

Acesse http://localhost:8000/incremento-4/ e:

- veja os nomes aparecerem nos blocos, um de cada vez;
- arraste o seletor de cor e veja que os nomes só são buscados quando você para;
- no DevTools, aba Network (filtro "Fetch/XHR"), confira os pedidos para `thecolorapi.com` e o JSON de resposta;
- em "Ideias da The Color API", escolha um estilo, clique em "Buscar ideias" e depois numa das cores;
- na aba Network, mude "No throttling" para "Offline", troque a cor e busque ideias para ver os avisos.
