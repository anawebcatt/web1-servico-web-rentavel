# CombinaCor — Projeto Incremental 2

Gerador de paletas de cores feito só com HTML, CSS e JavaScript puro. A pessoa escolhe uma cor e o site gera cores que combinam com ela (complementar, análoga, tríade, monocromática), com os códigos HEX, RGB e HSL prontos para copiar para o CSS.

- **Problema:** encontrar cores que combinam e pegar os códigos no formato certo, em poucos segundos.
- **Para quem:** estudantes e devs front-end.
- **Sem back-end próprio:** publicado como site estático.

## Incrementos

Cada pasta tem uma cópia completa do site naquele incremento e funciona sozinha. O incremento seguinte começa copiando a pasta do anterior, então dá para abrir e comparar qualquer etapa.

| Incremento | Foco | Status |
|---|---|---|
| [1. JS básico](incremento-1/) | Variáveis, tipos, operadores, condicionais, loops, funções, arrays e objetos | Feito |
| [2. DOM e eventos](incremento-2/) | DOM, formulários e eventos | Feito |
| [3. Persistência](incremento-3/) | `localStorage` | Não iniciado |
| [4. APIs](incremento-4/) | `fetch`, HTTP e JSON | Não iniciado |
| [5. Assincronismo e concorrência](incremento-5/) | Promises, `async`/`await`, `Promise.all` | Não iniciado |
| [6. Web APIs](incremento-6/) | Geolocation, Clipboard, File, Share etc. | Não iniciado |
| [7. Publicação e monetização](incremento-7/) | GitHub Pages | Não iniciado |

O README de cada pasta explica o que foi feito (ou o que está planejado) naquele incremento.

## Como rodar

Na pasta do repositório:

```bash
python3 -m http.server 8000 --directory projeto-incremental-2
```

Depois acesse http://localhost:8000 e escolha o incremento, por exemplo http://localhost:8000/incremento-1/.

Abrir o `index.html` direto também funciona nos primeiros incrementos, mas recursos como a Clipboard API só funcionam em `localhost` ou HTTPS.

## Layout

Regiões obrigatórias em todos os incrementos:

- **Header:** nome do serviço
- **Ferramenta:** escolha da cor, tipo de paleta e paleta gerada
- **Espaço publicitário** (bônus): abaixo da ferramenta no celular, ao lado (300x250) no desktop
- **Instruções:** o que é cada tipo de paleta e como usar as cores no CSS
- **Footer:** link para o [site pessoal](https://anawebcatt.github.io/ana-portfolio/02-css/)

## APIs usadas

| API | Uso | Chave | CORS |
|---|---|---|---|
| [The Color API](https://www.thecolorapi.com/) | Nome das cores e paletas | Não precisa | Liberado |
