# CombinaCor

Gerador de paletas de cores para quem escreve CSS: escolha uma cor e receba cores que combinam com ela, com os códigos prontos para usar.

Este repositório tem os dois projetos da disciplina. Os dois são o **mesmo serviço** em versões diferentes: o Projeto Final reimplementa com um framework o que foi feito no Projeto Incremental 2.

| Parte | Pasta | Tecnologia | Status |
|---|---|---|---|
| Projeto Incremental 2 | [`projeto-incremental-2/`](projeto-incremental-2/) | HTML, CSS e JavaScript puro | Feito e publicado |
| Projeto Final | [`projeto-final/`](projeto-final/) | React (com Vite) | Feito; publicação na Cloudflare Pages a ligar |

## Serviço

- **Problema que resolve:** quem está montando um site precisa de cores que combinem entre si e dos códigos delas no formato certo.
- **Para quem:** estudantes e devs front-end.
- **Tarefa que alguém pesquisaria no Google:** "gerador de paleta de cores", "cores que combinam com azul".

## Estrutura

```
.
├── projeto-incremental-2/   # versão em JavaScript puro (site estático)
│   ├── incremento-1/        # cópia completa do site em cada incremento
│   ├── incremento-2/
│   ├── ...
│   └── incremento-7/
└── projeto-final/           # versão em React
    ├── incremento-1/        # cópia completa do projeto em cada incremento
    ├── incremento-2/
    ├── incremento-3/
    ├── incremento-4/
    ├── incremento-5/
    ├── incremento-6/
    └── incremento-7/        # versão final, publicada na Cloudflare Pages
```

## Publicação

O Projeto Incremental 2 é publicado no GitHub Pages, direto da branch `main`. O Projeto Final precisa de build e é publicado na Cloudflare Pages, que lê este mesmo repositório.

O endereço principal, https://anawebcatt.github.io/web1-servico-web-rentavel/, abre direto a versão em JavaScript puro do CombinaCor (o [`index.html`](index.html) da raiz redireciona).

- **Projeto Incremental 2 (publicado):** https://anawebcatt.github.io/web1-servico-web-rentavel/projeto-incremental-2/incremento-7/ (os incrementos anteriores ficam em `.../projeto-incremental-2/incremento-N/`)
- **Projeto Final (endereço previsto):** https://combinacor.pages.dev, a partir de [`projeto-final/incremento-7/`](projeto-final/incremento-7/). O [README do incremento](projeto-final/incremento-7/) tem o passo a passo da publicação e a comparação entre as duas versões.

Autoria: [Ana Cattani](https://anawebcatt.github.io/ana-portfolio/02-css/)
