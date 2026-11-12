# CombinaCor — Projeto Incremental 2

Gerador de paletas de cores feito só com HTML, CSS e JavaScript puro. A pessoa escolhe uma cor e o site gera cores que combinam com ela (complementar, análoga, tríade, monocromática), com os códigos HEX, RGB e HSL prontos para copiar para o CSS.

- **Problema:** encontrar cores que combinam e pegar os códigos no formato certo, em poucos segundos.
- **Para quem:** estudantes e devs front-end.
- **Sem back-end próprio:** publicado como site estático.

## Como rodar

Sirva a pasta com um servidor local. Abrir o `index.html` direto funciona no começo, mas recursos como a Clipboard API só funcionam em `localhost` ou HTTPS.

```bash
python3 -m http.server 8000 --directory projeto-incremental-2
```

Depois acesse http://localhost:8000.

## Layout

Regiões obrigatórias, já marcadas no [`index.html`](index.html):

- **Header:** nome do serviço
- **Ferramenta:** escolha da cor, tipo de harmonia e paleta gerada
- **Espaço publicitário** (bônus): abaixo da ferramenta no celular, ao lado (300x250) no desktop
- **Instruções:** o que é cada tipo de harmonia e como usar as cores no CSS
- **Footer:** link para o [site pessoal](https://anawebcatt.github.io/ana-portfolio/02-css/)

## Incrementos

- [ ] **1. JS básico:** funções que convertem HEX ↔ RGB ↔ HSL e geram a paleta girando o matiz da cor (complementar, análoga, tríade, monocromática). A paleta é um array de objetos.
- [ ] **2. DOM e eventos:** `<input type="color">` e campo HEX, escolha da harmonia e paleta exibida em blocos de cor, atualizando sem recarregar a página.
- [ ] **3. Persistência:** `localStorage` para salvar paletas favoritas e lembrar a última cor e harmonia usadas.
- [ ] **4. APIs:** [The Color API](https://www.thecolorapi.com/) para mostrar o nome de cada cor e gerar paletas pelo endpoint `/scheme`.
- [ ] **5. Assincronismo e concorrência:** buscar o nome de todas as cores da paleta em paralelo com `Promise.all`.
- [ ] **6. Web APIs:** Clipboard para copiar o código de uma cor ou o CSS da paleta inteira. Extra: conta-gotas (EyeDropper) para pegar a cor base da tela, só no Chrome e no Edge.
- [ ] **7. Publicação e monetização:** GitHub Pages, espaço de anúncio e estratégia de monetização documentada.

## APIs usadas

| API | Uso | Chave | CORS |
|---|---|---|---|
| [The Color API](https://www.thecolorapi.com/) | Nome das cores e paletas | Não precisa | Liberado |

## Monetização

A documentar no incremento 7.
