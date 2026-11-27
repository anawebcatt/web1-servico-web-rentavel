# Incremento 1 — Migração para framework

**Status:** feito. Parte da versão final do Projeto Incremental 2 ([incremento 7](../../projeto-incremental-2/incremento-7/)).

**Foco:** React.

**Objetivo:** reimplementar o serviço anterior usando uma arquitetura baseada em componentes.

## O que muda nesta versão

O CombinaCor faz as mesmas coisas que fazia em JavaScript puro: gera a paleta, mostra os nomes das cores e as ideias da The Color API, guarda as favoritas e a última cor no `localStorage`, copia os códigos e usa o conta-gotas. O visual também é o mesmo, com o mesmo CSS.

O que muda é como a página é montada:

1. **O projeto passa a ser React com Vite.** O `index.html` só tem uma `div#root`. A página inteira é montada pelo React a partir do componente `App`.
2. **O `main.js` deixou de existir.** Ele tinha 496 linhas com `querySelector`, `createElement`, `textContent` e `addEventListener`. No lugar dele há componentes que descrevem a página em JSX.
3. **A página é função do estado.** Antes, cada mudança chamava funções como `mostrarPaleta()` e `mostrarFavoritas()` para atualizar o DOM. Agora o `App` guarda a cor, o tipo e as favoritas com `useState`, e o React atualiza a tela sozinho quando um deles muda.
4. **Os eventos estão no JSX** (`onClick`, `onChange`, `onSubmit`). A delegação de eventos com `data-acao` e `data-indice` não é mais necessária: cada botão recebe a função com os dados dele.
5. **Os arquivos de lógica foram reaproveitados.** `cores.js`, `api.js`, `armazenamento.js` e `recursos.js` já não mexiam na página, então só ganharam `export` e `import` (viraram módulos).

## Arquivos

```
incremento-1/
├── index.html            # só a div#root e as metatags
├── vite.config.js
├── public/favicon.svg
└── src/
    ├── main.jsx          # ponto de entrada: monta o App na div#root
    ├── App.jsx           # estado da ferramenta e composição da página
    ├── style.css         # o mesmo CSS do Projeto Incremental 2
    ├── components/
    │   ├── Cabecalho.jsx
    │   ├── Formulario.jsx    # cor base e tipo de paleta
    │   ├── Paleta.jsx        # cores geradas e CSS pronto
    │   ├── NomeDaCor.jsx     # nome vindo da API (usado na paleta e nas ideias)
    │   ├── Ideias.jsx        # paletas da The Color API
    │   ├── Favoritas.jsx     # paletas salvas
    │   ├── Anuncio.jsx
    │   ├── Instrucoes.jsx
    │   └── Rodape.jsx
    └── lib/              # lógica vinda do JS puro, sem mexer na página
        ├── cores.js
        ├── api.js
        ├── armazenamento.js
        └── recursos.js
```

Nesta etapa há um componente para cada região da página. Separar em partes menores e reutilizáveis (amostra de cor, botão de copiar, mensagens) fica para o [incremento 2](../incremento-2/).

## Do JavaScript puro para o React

| No JavaScript puro (`main.js`) | No React |
|---|---|
| `document.querySelector('#paleta')` e outras 20 referências a elementos | Não existem: cada componente devolve o próprio JSX |
| `criarBloco`, `criarItemFavorita`, `criarItemIdeia` com `createElement` e `append` | `paleta.map(...)`, `favoritas.map(...)` e `grupos.map(...)` no JSX, com `key` |
| `let corAtual`, `let favoritas` e chamadas a `mostrarPaleta()` | `useState` no `App`; a tela muda quando o estado muda |
| `elemento.hidden = true/false` | Renderização condicional: `{condicao && <p>...</p>}` |
| `classList.toggle`, `setAttribute('aria-pressed', ...)` | `className` e atributos calculados a partir do estado e das props |
| `seletorCor.value = ...`, `campoHex.value = ...` | Campos controlados: `value` vem do estado e `onChange` atualiza o estado |
| `addEventListener` e delegação com `evento.target.closest(...)` | `onClick`, `onChange` e `onSubmit` direto no elemento |
| `clearTimeout` + `AbortController` em variáveis globais para os nomes | `useEffect` que depende da paleta; a função de limpeza cancela a espera e os pedidos |
| `window.addEventListener('storage', ...)` solto no arquivo | `useEffect` que liga o ouvinte ao montar e desliga ao desmontar |
| `<script src>` em ordem no HTML, tudo global | `import` e `export` entre módulos |

Em dois pontos o código ainda fala com o DOM, pelos meios do próprio React:

- `useRef` no título da paleta, para rolar a página até ele (`scrollIntoView`) ao usar uma favorita ou uma ideia;
- `useRef` no bloco de CSS e `evento.currentTarget` nos códigos, para selecionar o texto quando a cópia automática falha.

## Onde aparece cada conceito

| Conceito | Onde |
|---|---|
| Componentes | Um arquivo por componente em [`src/components/`](src/components/); o [`App`](src/App.jsx) junta todos |
| JSX | Em todos os componentes; listas com `map` e `key`, condicionais com `&&` e `? :` |
| Propriedades (props) | `App` passa dados (`paleta`, `nomes`, `favoritas`) e funções (`aoCopiar`, `aoUsar`) para os filhos |
| Estado (`useState`) | Cor, tipo, texto do campo, favoritas, nomes e avisos no `App`; estilo, resultado e status na [`Ideias`](src/components/Ideias.jsx) |
| Eventos | `onChange` nos campos do [`Formulario`](src/components/Formulario.jsx), `onClick` nos botões, `onSubmit` nos formulários |
| Efeitos (`useEffect`) | Busca dos nomes, evento `storage` e aviso de cópia que some sozinho, no `App` |
| Referências (`useRef`) | Título da paleta (`App`) e bloco de CSS ([`Paleta`](src/components/Paleta.jsx)) |

Estado, efeitos e consumo da API funcionam, mas ainda estão concentrados no `App`. Os incrementos 3, 4 e 5 reorganizam cada um deles.

## Como rodar

É preciso ter o [Node.js](https://nodejs.org/) 20.19 ou mais novo. Na pasta deste incremento:

```bash
cd projeto-final/incremento-1
npm install
npm run dev
```

Acesse o endereço que aparecer no terminal (normalmente http://localhost:5173).

Outros comandos:

- `npm run lint`: confere o código com o oxlint;
- `npm run build`: gera a versão de produção na pasta `dist/`;
- `npm run preview`: abre a versão de produção gerada.

Esta etapa ainda não está publicada. Um projeto React precisa passar pelo `build` antes de ir para o GitHub Pages, o que será feito no incremento 7.

## Como testar

Use a ferramenta como na versão anterior e confira se tudo se comporta igual:

- trocar a cor pelo seletor e pelo campo de HEX (`04a` vira `#0044AA`; `xyz` mostra o erro ao sair do campo);
- trocar o tipo de paleta e ver os nomes das cores chegarem;
- copiar um código e o CSS pronto;
- salvar, usar e remover favoritas, e recarregar a página para ver que a cor e as favoritas voltam;
- buscar ideias em um estilo e em todos, e clicar numa cor para usá-la como cor base;
- abrir o site em duas abas e remover uma favorita numa delas: a outra se atualiza.
