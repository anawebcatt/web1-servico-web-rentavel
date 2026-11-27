# CombinaCor — Projeto Final (React)

**Status:** em andamento. Continua o [Projeto Incremental 2](../projeto-incremental-2/).

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
| 4. Efeitos e ciclo de vida | `useEffect`: carregamentos, inicialização e atualização de dados | A fazer |
| 5. Serviços e APIs | `fetch`, serviços e `async`/`await`: reorganizar o consumo da The Color API | A fazer |
| 6. Navegação | React Router: páginas ou rotas, se fizer sentido (ex.: página de favoritas) | A fazer |
| 7. Qualidade e publicação | Build, deploy e comparação com a versão em JavaScript puro | A fazer |

O README de cada pasta explica o que foi feito naquele incremento.

## Como rodar

É preciso ter o [Node.js](https://nodejs.org/) 20.19 ou mais novo. Cada incremento é um projeto separado:

```bash
cd projeto-final/incremento-1
npm install
npm run dev
```

Depois acesse o endereço que aparecer no terminal (normalmente http://localhost:5173).
