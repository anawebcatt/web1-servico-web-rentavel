# Incremento 6 — Navegação

**Status:** feito. Começou como uma cópia do [incremento 5](../incremento-5/).

**Foco:** React Router.

**Objetivo:** estruturar a aplicação em páginas ou rotas quando necessário.

## O que muda nesta versão

Até o incremento 5, tudo ficava numa página só: ferramenta, favoritas e instruções, uma embaixo da outra. Agora o CombinaCor tem três páginas e um menu no cabeçalho:

| Endereço | Página | O que tem |
|---|---|---|
| `#/` | **Gerador** | Cor base, tipo de paleta, paleta, CSS pronto e ideias da The Color API |
| `#/favoritas` | **Favoritas** | As paletas salvas. "Usar" troca a paleta e leva para o gerador |
| `#/como-usar` | **Como usar** | As instruções, os tipos de paleta e o texto de privacidade |
| `#/paleta/:tipo/:hex` | Link de paleta | Abre a paleta do endereço no gerador (ex.: `#/paleta/triade/0047AB`) |
| qualquer outro | Página não encontrada | Aviso e link para o gerador |

Também é novo:

1. **Botão "Copiar link"** ao lado de "Salvar nas favoritas". Copia um endereço que abre a mesma paleta em qualquer navegador.
2. **Menu** com o link da página atual destacado e a quantidade de favoritas.
3. **Título da aba** diferente em cada página.

A troca de página não recarrega o site: o React Router troca só o miolo, e o estado do `App` (paleta, favoritas, nomes) continua o mesmo.

## Por que separar em páginas

- **Favoritas** é outra tarefa: consultar o que foi guardado, não gerar. Na página única, ficava no fim, depois das ideias.
- **Como usar** é texto de consulta, que a maioria lê uma vez. Ocupava mais espaço que a ferramenta.
- **Link de paleta** só é possível com rotas: o endereço passa a carregar informação.

## Arquivos

```
src/
├── main.jsx                   # agora envolve o App com o HashRouter
├── App.jsx                    # estado compartilhado + a tabela de rotas
├── paginas/                   # pasta nova: um componente por rota
│   ├── Layout.jsx             # cabeçalho, anúncio e rodapé em volta do <Outlet>
│   ├── PaginaGerador.jsx
│   ├── PaginaFavoritas.jsx
│   ├── PaginaComoUsar.jsx
│   ├── PaginaPaletaDoLink.jsx
│   └── PaginaNaoEncontrada.jsx
├── components/
│   ├── Navegacao.jsx          # novo: o menu
│   ├── Cabecalho.jsx          # agora mostra o menu
│   ├── Paleta.jsx             # ganhou o botão "Copiar link"
│   ├── Favoritas.jsx          # o texto de lista vazia tem um link para o gerador
│   ├── Instrucoes.jsx         # devolve só o conteúdo; a página decide onde ele fica
│   └── ...
└── style.css                  # estilos do menu e pequenos ajustes de grade
```

Dependência nova: [`react-router`](https://reactrouter.com/) 7.

## Por que `HashRouter`

O React Router tem dois jeitos de guardar a rota no endereço:

| | Endereço | O servidor precisa... |
|---|---|---|
| `BrowserRouter` | `.../favoritas` | Entregar o `index.html` para qualquer caminho |
| `HashRouter` | `.../#/favoritas` | Nada: o que vem depois do `#` não é enviado ao servidor |

O GitHub Pages só entrega arquivos que existem. Com `BrowserRouter`, abrir `.../favoritas` direto ou recarregar a página daria erro 404. Com `HashRouter`, o servidor sempre recebe o mesmo endereço e entrega o `index.html`; o React Router lê o que vem depois do `#` e mostra a página certa. Também funciona em qualquer subpasta, sem configurar nada.

O custo é o `#` no endereço, e os buscadores tratam tudo como uma página só.

## Onde aparece cada conceito

| Conceito | Onde |
|---|---|
| Roteador | `<HashRouter>` em [`main.jsx`](src/main.jsx) |
| Tabela de rotas | `<Routes>` e `<Route>` em [`App.jsx`](src/App.jsx) |
| Rota inicial | `<Route index ...>` |
| Layout compartilhado | Rota sem caminho com `element={<Layout />}` e as outras dentro dela; o [`Layout`](src/paginas/Layout.jsx) usa `<Outlet />` |
| Links sem recarregar | `<Link>` no gerador, nas favoritas e no "como usar" |
| Link da página atual | `<NavLink>` em [`Navegacao`](src/components/Navegacao.jsx): coloca `aria-current="page"`, que o CSS destaca; `end` na rota `/` |
| Parâmetros no endereço | `path="paleta/:tipo/:hex"` e `useParams()` em [`PaginaPaletaDoLink`](src/paginas/PaginaPaletaDoLink.jsx) |
| Navegar pelo código | `useNavigate()`: depois de "Usar" uma favorita e depois de abrir um link de paleta |
| Navegar sem deixar rastro | `navegar('/', { replace: true })`: o link de paleta não fica no histórico |
| Rota "não encontrada" | `<Route path="*" ...>` |
| Saber em que página está | `useLocation()` no `Layout` (voltar ao topo) e na página não encontrada |
| Montar um endereço | `useHref()` em [`PaginaGerador`](src/paginas/PaginaGerador.jsx), para o "Copiar link" |
| Conferir o que vem do endereço | `normalizarHex` e `Object.hasOwn(HARMONIAS, tipo)` em `PaginaPaletaDoLink` |

## Estado e rotas

O `App` fica **acima** das rotas, então o estado dele não se perde ao trocar de página: a paleta, as favoritas e os nomes continuam lá. Ele passa esse estado para as páginas por propriedades, no `element` de cada rota.

O estado **local** de uma página some quando ela sai da tela, porque o componente é desmontado. Isso acontece com o resultado da busca de ideias: ao ir para "Favoritas" e voltar, as ideias precisam ser buscadas de novo. É aqui que a limpeza do `useIdeias` (incremento 5) passa a ser usada de verdade: sair do gerador no meio de uma busca cancela o pedido.

O título da aba passou do `App` para as páginas: cada uma chama `useTituloDaPagina` com o próprio título.

## O que mudou de comportamento

- As favoritas e as instruções saíram da página inicial e foram para as páginas delas.
- "Usar" numa favorita leva para o gerador (antes rolava a página até a paleta).
- O resultado das ideias é apagado ao sair do gerador.
- O aviso de "este navegador não deixou salvar" aparece também no topo do gerador, já que as favoritas não estão mais na mesma página.

## Como rodar

```bash
cd projeto-final/incremento-6
npm install
npm run dev
```

Acesse o endereço que aparecer no terminal (normalmente http://localhost:5173). `npm run lint` confere o código e `npm run build` gera a versão de produção.

## Como testar

- **Menu:** clique em "Gerador", "Favoritas" e "Como usar". O endereço muda, a página não recarrega e o link atual fica destacado.
- **Voltar e avançar:** use os botões do navegador entre as páginas.
- **Recarregar:** em `#/favoritas`, aperte F5. A página continua sendo a de favoritas.
- **Favoritas:** salve duas paletas no gerador (o número no menu muda), vá para "Favoritas" e clique em "Usar": o gerador abre com a paleta.
- **Link de paleta:** clique em "Copiar link", abra uma janela anônima e cole o endereço. A mesma paleta aparece e o endereço vira `#/`.
- **Endereços errados:** teste `#/paleta/xadrez/zzz` (link inválido) e `#/qualquer-coisa` (página não encontrada).
