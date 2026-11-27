# Incremento 4 — Efeitos e ciclo de vida

**Status:** feito. Começou como uma cópia do [incremento 3](../incremento-3/).

**Foco:** `useEffect` e ciclo de vida dos componentes.

**Objetivo:** controlar carregamentos, inicialização e atualização de dados.

## O que muda nesta versão

1. **Os efeitos saíram do `App` e viraram hooks.** Os três `useEffect` que estavam no meio do `App` foram para a pasta nova [`src/hooks/`](src/hooks/), cada um num arquivo com o estado que ele controla. O `App` não chama mais `useEffect` direto.
2. **O título da aba acompanha a paleta** (novo). Em vez de "CombinaCor | Gerador de paletas de cores", a aba mostra, por exemplo, "Tríade de #0047AB | CombinaCor".
3. **O site percebe quando a internet cai ou volta** (novo). Sem conexão, aparece um aviso no topo da ferramenta. Quando a conexão volta, o aviso some e os nomes que tinham falhado são buscados de novo, sem a pessoa fazer nada.

O resto da ferramenta e o visual são os mesmos do incremento 3.

## Arquivos

```
src/hooks/                    # pasta nova
├── useNomesDasCores.js       # busca os nomes quando a paleta muda ou a internet volta
├── useFavoritas.js           # lista de favoritas + evento storage (outras abas)
├── useAvisoTemporario.js     # aviso que some sozinho
├── useConexao.js             # novo: online ou offline
└── useTituloDaPagina.js      # novo: título da aba
```

- [`src/App.jsx`](src/App.jsx): usa os cinco hooks e mostra o aviso de "sem internet". Ficou com 170 linhas (eram 241).
- O resto é igual ao incremento 3.

Um hook próprio é uma função que começa com `use` e chama outros hooks (`useState`, `useEffect`). Ele não desenha nada: guarda estado, cuida de um efeito e devolve o que o componente precisa.

## Os efeitos, um por um

| Hook | Quando o efeito roda | O que faz | O que a limpeza desfaz |
|---|---|---|---|
| [`useNomesDasCores`](src/hooks/useNomesDasCores.js) | Ao abrir a página e sempre que `cores` ou `online` mudam | Espera 400 ms e pede os nomes à The Color API | Cancela a espera (`clearTimeout`) e os pedidos (`AbortController`) da paleta anterior |
| [`useFavoritas`](src/hooks/useFavoritas.js) | Só ao abrir a página (`[]`) | Liga o ouvinte do evento `storage` | Desliga o ouvinte |
| [`useConexao`](src/hooks/useConexao.js) | Só ao abrir a página (`[]`) | Liga os ouvintes de `online` e `offline` | Desliga os dois |
| [`useAvisoTemporario`](src/hooks/useAvisoTemporario.js) | Sempre que o aviso muda | Marca um temporizador para apagar o aviso | Cancela o temporizador do aviso anterior |
| [`useTituloDaPagina`](src/hooks/useTituloDaPagina.js) | Sempre que o título muda | Escreve em `document.title` | Devolve o título que estava antes |

Todo efeito daqui fala com algo que está **fora do React**: a rede, o `localStorage` de outras abas, os eventos do navegador, um temporizador e o `<head>` da página. É para isso que o `useEffect` serve.

## Ciclo de vida

Um componente passa por três momentos, e o `useEffect` cobre os três:

| Momento | No `useEffect` | Exemplo no CombinaCor |
|---|---|---|
| Entra na página (montagem) | O efeito roda pela primeira vez | Ligar os ouvintes de `storage`, `online` e `offline`; buscar os nomes da primeira paleta |
| Atualiza | Se uma dependência mudou: roda a limpeza do efeito anterior e depois o efeito de novo | Trocar a cor cancela os pedidos antigos e faz os novos |
| Sai da página (desmontagem) | Roda a limpeza pela última vez | Desligar os ouvintes; cancelar pedidos e temporizadores |

A lista de dependências decide quando o efeito roda de novo:

- `[cores, online]`: quando um dos dois muda;
- `[]`: só na montagem;
- sem lista: em toda renderização (não é usado aqui).

## Carregamento, inicialização e atualização

| O quê | Como é controlado |
|---|---|
| **Carregamento** dos nomes | Enquanto o nome não chega, o `NomeDaCor` mostra "Buscando nome…"; se falhar, "Nome indisponível" e um aviso |
| **Inicialização** da paleta e das favoritas | `useState(paletaInicial)` e `useState(carregarFavoritas)`: o `localStorage` é lido na primeira renderização, sem efeito |
| **Atualização** quando a paleta muda | O efeito de `useNomesDasCores` depende de `cores` |
| **Atualização** quando a internet volta | O mesmo efeito depende de `online` |
| **Atualização** vinda de outra aba | O evento `storage` em `useFavoritas` |
| Resposta que chega atrasada | Depois da limpeza, `sinal.aborted` é `true` e a resposta é ignorada |

## Quando não usar efeito

Nem tudo que "acontece depois" precisa de `useEffect`. Neste projeto, três coisas ficaram de fora de propósito:

- **Ler o `localStorage` ao abrir.** É rápido e não espera nada, então vai no valor inicial do `useState`. Num efeito, a página apareceria vazia e depois piscaria com as favoritas.
- **Gravar as preferências e as favoritas.** Acontece porque a pessoa clicou ou digitou, então fica na função do evento (`trocarPaleta`, `trocarFavoritas`), não num efeito que observa o estado.
- **Valores calculados**, como `cores` e `salva`. São contas feitas na renderização.

## Do JavaScript puro para os efeitos

| No JavaScript puro (`main.js`) | No React |
|---|---|
| `let temporizadorNomes` e `let controleNomes` globais; `agendarNomes()` chamada por `mostrarPaleta()` | `useEffect` com `[cores, online]`; o temporizador e o `AbortController` são variáveis do próprio efeito |
| `clearTimeout(...)` e `controleNomes.abort()` no começo de `agendarNomes()` | Função de limpeza devolvida pelo efeito |
| `window.addEventListener('storage', ...)` solto no arquivo, nunca removido | `useEffect` com `[]`, que remove o ouvinte na limpeza |
| `let temporizadorCopia` global em `mostrarAvisoCopia()` | `useAvisoTemporario` |
| Código solto no fim do arquivo (`preencherCampos(corAtual); mostrarPaleta();`) | Valor inicial do estado; a primeira renderização já mostra tudo |

No JavaScript puro, quem escreve o código precisa lembrar de chamar a função certa em cada lugar em que a cor muda. Com o efeito, basta dizer do que ele depende.

## Por que os efeitos rodam duas vezes no `npm run dev`

O `main.jsx` usa `<StrictMode>`. No modo de desenvolvimento, ele monta cada componente, desmonta e monta de novo, para mostrar se alguma limpeza está faltando. Por isso, ao abrir a página, os ouvintes são ligados, desligados e ligados de novo, e a primeira espera dos nomes é cancelada e refeita. Na versão de produção (`npm run build`), cada efeito roda uma vez só.

## Como rodar

```bash
cd projeto-final/incremento-4
npm install
npm run dev
```

Acesse o endereço que aparecer no terminal (normalmente http://localhost:5173). `npm run lint` confere o código e `npm run build` gera a versão de produção.

## Como testar

- **Título:** troque a cor e o tipo e veja o texto da aba mudar.
- **Espera e cancelamento:** abra o DevTools na aba **Network** e arraste o seletor de cor. Os pedidos a `thecolorapi.com/id` só saem quando você para.
- **Sem internet:** no DevTools, em **Network**, troque "No throttling" por **Offline**. Aparece o aviso no topo; troque a cor e os nomes ficam "Nome indisponível". Volte para "No throttling": o aviso some e os nomes aparecem sozinhos.
- **Outra aba:** abra o site em duas abas e salve ou remova uma favorita numa delas. A outra se atualiza.
- **Aviso de cópia:** clique num código e, antes de o aviso sumir, clique em outro. A contagem recomeça.
