# CombinaCor — Projeto Final (React)

**Status:** os 7 incrementos estão feitos; falta ligar a publicação na Cloudflare Pages ([passo a passo](incremento-7/#publicação-na-cloudflare-pages)). Continua o [Projeto Incremental 2](../projeto-incremental-2/).

Reimplementação do CombinaCor com um framework moderno. Não é um produto novo: a geração de paletas, a The Color API, o `localStorage`, a Clipboard API e o conta-gotas continuam. O que muda é a organização, que passa a usar componentes, props, estado, eventos e ciclo de vida no lugar da manipulação direta do DOM.

- **Framework:** [React](https://react.dev/) 19, com [Vite](https://vite.dev/) e JavaScript (JSX)
- **Por que React:** os arquivos de lógica do Projeto Incremental 2 (`cores.js`, `api.js`, `armazenamento.js`, `recursos.js`) já eram separados da página e puderam ser reaproveitados como módulos, sem reescrever em TypeScript. Assim a comparação entre as duas versões mostra só o que o framework muda.

## Incrementos

Cada pasta tem uma cópia completa do projeto naquele incremento e funciona sozinha, como no Projeto Incremental 2. O incremento seguinte começa copiando a pasta do anterior.

| Incremento | Foco | Status |
|---|---|---|
| [1. Migração para framework](incremento-1/) | React: reimplementar o CombinaCor com arquitetura baseada em componentes | Feito |
| [2. Componentização](incremento-2/) | Componentes, props e reutilização: botão, mensagem, amostra de cor, código copiável | Feito |
| [3. Estado da aplicação](incremento-3/) | `useState` e estado local: onde mora cada estado e o que é só calculado | Feito |
| [4. Efeitos e ciclo de vida](incremento-4/) | `useEffect`: efeitos em hooks próprios, título da aba e detecção de conexão | Feito |
| [5. Serviços e APIs](incremento-5/) | `fetch`, serviços e `async`/`await`: serviço da The Color API, nova tentativa e cancelamento | Feito |
| [6. Navegação](incremento-6/) | React Router: páginas de gerador, favoritas e como usar, e link de paleta | Feito |
| [7. Qualidade e publicação](incremento-7/) | Build, publicação na Cloudflare Pages, SEO, testes e comparação com a versão em JavaScript puro | Feito |

O README de cada pasta explica o que foi feito naquele incremento.

## Como rodar

É preciso ter o [Node.js](https://nodejs.org/) 20.19 ou mais novo. Cada incremento é um projeto separado:

```bash
cd projeto-final/incremento-7
npm install
npm run dev
```

Depois acesse o endereço que aparecer no terminal (normalmente http://localhost:5173).
