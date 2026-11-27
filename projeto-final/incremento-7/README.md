# Incremento 7 — Qualidade e publicação

**Status:** feito e publicado. Começou como uma cópia do [incremento 6](../incremento-6/).

**Foco:** organização, build e deploy.

**Objetivo:** publicar a nova versão e comparar com a implementação anterior em JavaScript puro.

**Endereço:** https://combinacor.pages.dev

## O que muda nesta versão

1. **Publicação na Cloudflare Pages.** O projeto ganhou o que falta para ir ao ar: endereço do site num lugar só, cabeçalhos HTTP e versão do Node para o build.
2. **Rotas sem `#`.** O `HashRouter` deu lugar ao `BrowserRouter`: os endereços agora são `/favoritas` e `/como-usar`. Isso é possível porque a Cloudflare Pages entrega o `index.html` para qualquer caminho.
3. **SEO de volta.** Endereço canônico, Open Graph, dados estruturados e a imagem de prévia do link, que existiam no Projeto Incremental 2 e tinham ficado de fora desde o incremento 1. Como o site agora fica na raiz de um domínio, entraram também o `robots.txt` e o `sitemap.xml`.
4. **Testes automáticos.** 17 testes com [Vitest](https://vitest.dev/) para as contas de cor e para a lista de favoritas.
5. **Um comando para conferir tudo:** `npm run verificar` roda o lint, os testes e o build.
6. **Comparação com o JavaScript puro**, no fim deste README.

A ferramenta em si é a mesma do incremento 6.

## Arquivos

- [`vite.config.js`](vite.config.js): `URL_DO_SITE` e o plugin que preenche o `index.html` e gera `robots.txt` e `sitemap.xml`.
- [`index.html`](index.html): metatags de SEO e dados estruturados.
- [`public/_headers`](public/_headers): **novo.** Cabeçalhos HTTP para a Cloudflare Pages (cache dos arquivos e segurança).
- [`public/og-imagem.png`](public/og-imagem.png): **novo.** Imagem da prévia do link, a mesma do Projeto Incremental 2.
- [`.nvmrc`](.nvmrc): **novo.** Versão do Node usada no build.
- [`src/main.jsx`](src/main.jsx): `BrowserRouter` no lugar do `HashRouter`.
- [`src/lib/cores.test.js`](src/lib/cores.test.js) e [`src/servicos/armazenamento.test.js`](src/servicos/armazenamento.test.js): **novos.** Testes.
- [`package.json`](package.json): comandos `test` e `verificar`; o projeto passou a se chamar `combinacor`.

## Como rodar

É preciso ter o [Node.js](https://nodejs.org/) 20.19 ou mais novo.

```bash
cd projeto-final/incremento-7
npm install
npm run dev
```

| Comando | O que faz |
|---|---|
| `npm run dev` | Servidor de desenvolvimento, que atualiza a página ao salvar um arquivo |
| `npm run lint` | Confere o código com o oxlint |
| `npm test` | Roda os testes |
| `npm run build` | Gera a versão de produção na pasta `dist/` |
| `npm run preview` | Abre a versão de produção gerada, como ela vai ao ar |
| `npm run verificar` | Lint, testes e build, um depois do outro |

## Build

O `npm run build` transforma os 39 arquivos de `src/` em três arquivos prontos para o navegador, na pasta `dist/`:

| Arquivo | Tamanho | Comprimido (gzip) |
|---|---|---|
| `index.html` | 2,7 kB | 1,1 kB |
| `assets/index-….css` | 7,6 kB | 2,1 kB |
| `assets/index-….js` (o app, o React e o React Router) | 282 kB | 89 kB |

O Vite junta os módulos, converte o JSX em JavaScript, tira espaços e comentários e põe um código no nome dos arquivos (ex.: `index-D9y64zKX.js`). O código muda quando o conteúdo muda, então o navegador pode guardar o arquivo por muito tempo sem risco de mostrar uma versão velha.

A pasta `dist/` não vai para o repositório (está no `.gitignore`): quem faz o build é a Cloudflare, a cada publicação.

## Publicação na Cloudflare Pages

A Cloudflare Pages lê o repositório no GitHub, roda o build e publica a pasta `dist/`. Depois de configurada, cada merge na `main` publica de novo sozinho.

O projeto na Cloudflare usa a pasta `projeto-final/incremento-7` como raiz, o comando `npm run build` e publica a pasta `dist`.

O endereço do site fica na constante `URL_DO_SITE`, no começo do [`vite.config.js`](vite.config.js). O endereço canônico, a prévia do link, o `robots.txt` e o `sitemap.xml` são preenchidos a partir dela.

### Por que funciona

- **Rotas:** quando o endereço não corresponde a um arquivo (como `/favoritas`) e o site não tem um `404.html`, a Cloudflare Pages entrega o `index.html`. O React Router lê o endereço e mostra a página certa. Por isso recarregar em `/favoritas` funciona.
- **Pasta do projeto:** o repositório tem vários projetos, então a Cloudflare é configurada para rodar o `npm install` e o build só nesta pasta.
- **Versão do Node:** o arquivo `.nvmrc` pede o Node 20, que o Vite 8 exige.
- **HTTPS:** vem ligado, o que a Clipboard API exige.

### O que continua no GitHub Pages

O Projeto Incremental 2 continua publicado como estava, em https://anawebcatt.github.io/web1-servico-web-rentavel/projeto-incremental-2/incremento-7/. O endereço principal do repositório (o [`index.html`](../../index.html) da raiz) agora redireciona para a versão React.

## SEO

| O quê | Onde | Observação |
|---|---|---|
| `<title>` e `<meta name="description">` | `index.html` | O título muda em cada página pelo `useTituloDaPagina` |
| `<link rel="canonical">`, Open Graph e `twitter:card` | `index.html` | O endereço vem de `URL_DO_SITE` |
| Dados estruturados (`WebApplication`) | `index.html` | Iguais aos do Projeto Incremental 2 |
| `robots.txt` e `sitemap.xml` | Gerados no build | No GitHub Pages em subpasta não tinham efeito; na raiz de um domínio têm |

**Limitação de um app feito no navegador:** o `index.html` que o servidor entrega só tem a `div#root` vazia; o texto da página aparece depois que o JavaScript roda. O Google executa JavaScript e consegue ler o conteúdo, mas outros buscadores e as prévias de link só veem o que está no `<head>`. No JavaScript puro, o texto das instruções estava direto no HTML. Para resolver isso num projeto React seria preciso gerar o HTML no servidor ou no build, o que está fora do escopo deste trabalho.

## Qualidade

| Verificação | Como | O que pega |
|---|---|---|
| Lint | `npm run lint` (oxlint) | Variáveis sem uso, regras dos hooks, dependências de efeito faltando |
| Testes | `npm test` (Vitest) | Erros nas contas de cor e na lista de favoritas |
| Build | `npm run build` | Imports quebrados e erros de sintaxe |

Os testes cobrem o que é função pura, sem tela e sem rede:

- `normalizarHex`: formatos aceitos, forma curta e entradas inválidas;
- conversões entre HEX, RGB e HSL e os textos para o CSS;
- `gerarPaleta` nos quatro tipos e perto do branco;
- `gerarCss`;
- `adicionarFavorita` e `removerFavorita`: ordem, repetição, limite de 12 e lista original intacta.

Os componentes e o serviço da API não têm testes automáticos; foram testados à mão e com um roteiro num navegador automatizado durante o desenvolvimento.

## Comparação com o JavaScript puro

As duas versões fazem a mesma coisa. A de JavaScript puro é o [incremento 7 do Projeto Incremental 2](../../projeto-incremental-2/incremento-7/); a de React é esta pasta.

### Em números

| | JavaScript puro | React |
|---|---|---|
| Arquivos de código (JS/JSX, sem testes) | 5 | 39 |
| Linhas de JavaScript | 903 | 1.772 |
| Maior arquivo | `main.js`, 496 linhas | `colorApi.js`, 162 linhas |
| Linhas de HTML | 199 | 60 (só o `<head>` e a `div#root`) |
| Linhas de CSS | 604 | 669 |
| Chamadas diretas ao DOM (`querySelector`, `createElement`, `textContent`, `classList`...) | 99, todas no `main.js` | 0 (só 4 `addEventListener` em `window`, dentro de efeitos) |
| JavaScript que o navegador baixa | 29 kB (10 kB comprimido) | 282 kB (89 kB comprimido) |
| Total baixado na primeira visita, comprimido | 16 kB em 7 arquivos | 92 kB em 3 arquivos |
| Dependências | Nenhuma | `react`, `react-dom`, `react-router` (mais as de desenvolvimento: 122 MB em `node_modules`) |
| Passo de build | Não tem: o que está no repositório é o que vai ao ar | `npm run build` |
| Onde pode ser publicado | Qualquer servidor de arquivos, em qualquer pasta | Precisa de build; as rotas sem `#` precisam de um servidor que entregue o `index.html` em qualquer caminho |
| Testes automáticos | Nenhum | 17 |

A versão React tem quase o dobro de linhas, mas também faz mais: páginas, link de paleta, aviso de conexão, nova tentativa e cancelamento da busca não existiam no JavaScript puro.

### Como cada versão atualiza a tela

**JavaScript puro:** o código diz *como* mudar a página. Quando a cor muda, o `main.js` precisa lembrar de tudo o que depende dela:

```js
corAtual = hex;
preencherCampos(corAtual);   // seletor, campo de HEX e erro
mostrarPaleta();             // título, blocos, CSS, aviso, nomes, botão de salvar, favoritas, localStorage
```

Esquecer uma dessas chamadas deixa a página com informação velha. Foi o que aconteceu com o texto de privacidade no incremento 4 do Projeto Incremental 2.

**React:** o código diz *como a página deve ficar* para um dado estado. Quando a cor muda, basta mudar o estado:

```js
trocarPaleta({ cor: hex });
```

Tudo o que usa `paletaAtual` é redesenhado, e o efeito que busca os nomes roda de novo porque depende das cores.

### O que ficou melhor com o React

- **Não existe mais "esquecer de atualizar".** A tela é calculada a partir do estado; não há duas cópias da mesma informação para manter iguais.
- **Arquivos pequenos e com um assunto só.** O `main.js` de 496 linhas virou 28 componentes e páginas (contando o `App`), a maioria com menos de 60 linhas. Achar onde mexer ficou mais fácil.
- **Reutilização.** O `Botao` é usado em 8 lugares e a `Mensagem` em 7. No JavaScript puro, cada botão era criado com `createElement` e as classes repetidas à mão.
- **Limpeza junto do efeito.** O cancelamento dos pedidos e a remoção dos ouvintes ficam na função de limpeza do próprio `useEffect`. Antes eram variáveis globais (`temporizadorNomes`, `controleNomes`) que qualquer função podia alterar.
- **Páginas.** Com o React Router, separar em rotas e criar o link de paleta foi pouco código. No JavaScript puro seria preciso escrever um roteador ou criar vários arquivos HTML repetindo cabeçalho e rodapé.
- **Módulos.** `import` e `export` deixam claro o que cada arquivo usa. Antes, tudo era global e a ordem das tags `<script>` importava.

### O que ficou pior ou mais difícil

- **Peso.** O navegador baixa quase 6 vezes mais (92 kB contra 16 kB comprimidos), e a maior parte é o React e o React Router, não o app. Para uma ferramenta deste tamanho, é muito.
- **Página em branco sem JavaScript.** No JavaScript puro, o HTML já tinha o formulário e as instruções. No React, o HTML vem vazio e tudo depende do JavaScript carregar. Isso também pesa no SEO (veja acima).
- **Ferramentas.** É preciso ter Node, instalar 122 MB de dependências e fazer build. A versão em JavaScript puro abre com dois cliques no `index.html`.
- **Publicação.** O JavaScript puro foi publicado só ligando o GitHub Pages. O React exigiu um serviço que faz build e uma configuração de pasta, comando e versão do Node.
- **Mais conceitos.** Para entender o código é preciso saber JSX, props, estado, efeitos, dependências de efeito, hooks próprios e rotas. Alguns erros são sutis, como um efeito que roda mais vezes do que deveria ou um rascunho de campo que não acompanha a propriedade.
- **Manutenção das dependências.** React, Vite e React Router lançam versões novas e, com o tempo, o projeto precisa acompanhar. O JavaScript puro só depende do navegador.

### Conclusão

Para o CombinaCor do tamanho que ele tinha no Projeto Incremental 2 (uma página, quatro seções), o JavaScript puro dava conta, com menos peso e sem ferramentas. O limite aparecia no `main.js`: cada função nova precisava saber quais outras chamar para manter a página coerente, e o arquivo já estava perto de 500 linhas.

O React cobra um preço fixo (peso, build, conceitos) e devolve em organização. Esse preço começou a compensar quando o app cresceu: as páginas, o link de paleta e a busca cancelável entraram mexendo em poucos arquivos e sem quebrar o resto. Quanto mais estado compartilhado e mais telas, mais o framework ajuda; para uma página simples e estática, ele sobra.

## Como testar

Antes de publicar:

```bash
cd projeto-final/incremento-7
npm install
npm run verificar
npm run preview
```

Acesse o endereço que aparecer (normalmente http://localhost:4173) e confira:

- as páginas pelo menu, e recarregar (F5) em `/favoritas` e `/como-usar`;
- "Copiar link" e abrir o endereço copiado em outra aba;
- um endereço que não existe, como `/qualquer-coisa`.

Depois de publicar:

- repita os testes acima no endereço da Cloudflare;
- cole o link numa conversa do WhatsApp ou do Discord e veja a prévia com a imagem;
- abra `/robots.txt` e `/sitemap.xml`;
- teste os dados estruturados no [Teste de pesquisa aprimorada do Google](https://search.google.com/test/rich-results).
