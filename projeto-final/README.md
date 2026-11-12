# CombinaCor — Projeto Final (React ou Angular)

**Status:** não iniciado. Esta parte começa depois do [Projeto Incremental 2](../projeto-incremental-2/).

Reimplementação do CombinaCor com um framework moderno. Não é um produto novo: a geração de paletas, a The Color API, o `localStorage` e a Clipboard API continuam. O que muda é a organização, que passa a usar componentes, props/inputs, estado, eventos e ciclo de vida no lugar da manipulação direta do DOM.

- **Framework:** a definir (React ou Angular)

O projeto do framework será gerado dentro desta pasta quando esta etapa começar.

## Incrementos

- [ ] **1. Migração para framework:** reimplementar o CombinaCor com arquitetura baseada em componentes.
- [ ] **2. Componentização:** separar em partes reutilizáveis, como seletor de cor, amostra de cor, paleta e lista de paletas salvas.
- [ ] **3. Estado da aplicação:** cor base, harmonia e paletas salvas em estado (`useState` / signals), sem manipular o DOM direto.
- [ ] **4. Efeitos e ciclo de vida:** carregar as paletas salvas ao abrir e buscar os nomes das cores quando a paleta mudar (`useEffect` / lifecycle hooks).
- [ ] **5. Serviços e APIs:** isolar as chamadas à The Color API num serviço, com `async`/`await`.
- [ ] **6. Navegação:** rotas se fizer sentido, por exemplo uma página de paletas salvas (React Router / Angular Router).
- [ ] **7. Qualidade e publicação:** build, deploy e comparação com a versão em JavaScript puro.
