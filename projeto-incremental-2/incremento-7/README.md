# Incremento 7 — Publicação e monetização

**Status:** feito. Começou como uma cópia do [incremento 6](../incremento-6/).

**Foco:** GitHub Pages (SEO e publicidade são opcionais).

**Objetivo:** publicar o serviço, prever espaços para anúncios e documentar uma estratégia opcional de monetização.

**Versão publicada:** https://anawebcatt.github.io/web1-servico-web-rentavel/projeto-incremental-2/incremento-7/

## O que muda nesta versão

A ferramenta é a mesma do incremento 6. O que muda é o que está em volta dela para o site ir ao ar:

1. **Publicação no GitHub Pages**, direto da branch `main` (passo a passo abaixo).
2. **SEO e prévia de link:** endereço canônico, Open Graph (título, descrição e imagem que aparecem ao compartilhar o link), dados estruturados (`WebApplication`) e favicon.
3. **Privacidade:** o texto da página agora diz que os códigos das cores são enviados à The Color API. Antes dizia que "nada é enviado para um servidor", o que deixou de ser verdade no incremento 4.
4. **Rodapé:** links para o código no GitHub e para a The Color API, além do site pessoal.
5. **Espaço de anúncio:** o retângulo de 300x250 continua reservado, com um comentário no HTML indicando onde o código do anúncio entra.

## Arquivos

- [`index.html`](index.html): metatags de SEO e Open Graph, dados estruturados, texto de privacidade e rodapé.
- [`img/favicon.svg`](img/favicon.svg): **novo.** Ícone da aba, com três cores de uma paleta análoga.
- [`img/og-imagem.png`](img/og-imagem.png): **novo.** Imagem de 1200x630 que aparece ao compartilhar o link.
- [`css/`](css/) e [`js/`](js/): iguais aos do incremento 6.

## Publicação no GitHub Pages

O repositório inteiro é publicado, então cada pasta vira um endereço:

| O quê | Endereço |
|---|---|
| Endereço principal (redireciona para a versão final) | https://anawebcatt.github.io/web1-servico-web-rentavel/ |
| Projeto Incremental 2 (README com a lista dos incrementos) | https://anawebcatt.github.io/web1-servico-web-rentavel/projeto-incremental-2/ |
| **CombinaCor, versão final** | https://anawebcatt.github.io/web1-servico-web-rentavel/projeto-incremental-2/incremento-7/ |
| Incrementos anteriores | `.../projeto-incremental-2/incremento-1/` até `.../incremento-6/` |

Os READMEs viram páginas porque o GitHub Pages usa o Jekyll, que transforma o `README.md` de cada pasta sem `index.html` na página inicial dela.

A raiz do repositório tem um [`index.html`](../../index.html) que redireciona para a versão final, então quem abre o endereço principal cai direto no CombinaCor. Por isso o README da raiz não aparece como página; ele continua aparecendo no GitHub.

### Como ativar

1. No GitHub, abra o repositório e vá em **Settings → Pages**.
2. Em **Build and deployment → Source**, escolha **Deploy from a branch**.
3. Em **Branch**, escolha `main` e a pasta `/ (root)`, e clique em **Save**.
4. Espere 1 ou 2 minutos. O andamento aparece na aba **Actions** ("pages build and deployment").
5. Abra o endereço da versão final e confira.

Cada merge na `main` publica de novo sozinho.

### Por que funciona sem configurar nada

- Todos os caminhos de CSS, JS e imagens são relativos (`css/style.css`, `img/favicon.svg`), então funcionam dentro da subpasta `/web1-servico-web-rentavel/`.
- O GitHub Pages usa HTTPS, que a Clipboard API exige (incremento 6).
- A The Color API tem CORS liberado e também usa HTTPS, então o navegador não bloqueia os pedidos.

## SEO

| O quê | Onde | Para quê |
|---|---|---|
| `<title>` e `<meta name="description">` | `<head>` | Título e resumo que aparecem no Google |
| `<link rel="canonical">` | `<head>` | Diz que esta é a versão principal. Os incrementos 1 a 6 continuam publicados como histórico e têm conteúdo parecido |
| Open Graph (`og:*`) e `twitter:card` | `<head>` | Título, descrição e imagem na prévia do link |
| Dados estruturados (`application/ld+json`) | `<head>` | Dizem aos buscadores que a página é uma ferramenta gratuita (`WebApplication`) |
| HTML semântico | `header`, `main`, `aside`, `section`, `footer`, títulos em ordem | Os buscadores entendem melhor a página |
| Texto útil na página | Seções "Como usar", "Tipos de paleta" e "Como usar as cores no CSS" | Responde às buscas do público ("cores que combinam com azul", "o que é paleta complementar") |

**Depois de publicar:** cadastrar o endereço no [Google Search Console](https://search.google.com/search-console) para pedir a indexação e acompanhar as buscas.

**Limitação:** `robots.txt` e `sitemap.xml` só valem na raiz do domínio (`anawebcatt.github.io/`), que é outro repositório. Num site de projeto do GitHub Pages eles não têm efeito, por isso não foram criados.

## Monetização

O público são estudantes e devs front-end, e o serviço é gratuito e não tem login. A estratégia vai do mais simples ao mais trabalhoso:

### 1. Apoio voluntário

Um link "Apoie o CombinaCor" (GitHub Sponsors ou uma chave Pix) no rodapé.

- **Prós:** nenhum script de terceiros, nenhum cookie, nada muda na privacidade.
- **Contras:** a renda depende só da boa vontade de quem usa.

### 2. Patrocínio direto no espaço de 300x250

Vender o espaço reservado para uma marca que fala com o mesmo público (ferramentas de design, cursos de front-end, hospedagem), por um valor fixo por mês. O anúncio é uma imagem com link, no próprio HTML:

```html
<a class="ad-box" href="https://exemplo.com/?utm_source=combinacor" rel="sponsored">
  <img src="img/patrocinio.png" alt="Nome do patrocinador: o que ele oferece" width="300" height="250">
</a>
```

- **Prós:** sem script de terceiros e sem cookies; o anúncio tem tudo a ver com o público.
- **Contras:** é preciso ter tráfego para mostrar e negociar cada patrocínio.
- `rel="sponsored"` avisa o Google que o link é pago, como pedem as regras dele.

### 3. Links de afiliado nas instruções

Indicar cursos ou livros de CSS e design nas seções de instruções, com link de afiliado e um aviso claro ("link de afiliado: se você comprar, o CombinaCor recebe uma comissão").

- **Prós:** combina com o conteúdo que já existe na página.
- **Contras:** só rende se o texto for útil por si só; recomendação forçada afasta o público.

### 4. Anúncios automáticos (Google AdSense) no espaço de 300x250

O código do AdSense entra no lugar da `div .ad-box`, que já tem o tamanho certo. É o caminho mais conhecido, mas o que mais pede preparo:

- **Domínio próprio.** O arquivo `ads.txt` precisa ficar na raiz do domínio, e o AdSense dificilmente aprova uma subpasta de `github.io`. A saída é registrar um domínio (ex.: `combinacor.com.br` no Registro.br) e apontá-lo para o GitHub Pages em Settings → Pages → Custom domain.
- **Cookies e LGPD.** O AdSense usa cookies de terceiros. A página passaria a precisar de uma política de privacidade e de um aviso de consentimento, e o texto "não usa cookies" teria que mudar.
- **Tráfego.** Anúncio por impressão só rende com muitas visitas.

### Recomendação

Começar pelo **apoio voluntário (1)** e, com tráfego, pelo **patrocínio direto (2)**. Os dois usam o espaço que já está no layout e mantêm a página sem cookies e sem scripts de terceiros. O **AdSense (4)** só vale a pena com domínio próprio e tráfego constante, e mesmo assim exige o aviso de cookies.

## Como testar

Antes de publicar, na pasta do repositório:

```bash
python3 -m http.server 8000 --directory projeto-incremental-2
```

Acesse http://localhost:8000/incremento-7/ e confira o favicon na aba, o rodapé e o texto de privacidade.

Depois de publicar:

- abra a versão final pelo endereço do GitHub Pages e use tudo: nomes, ideias, copiar, favoritas;
- cole o link numa conversa do WhatsApp ou do Discord e veja a prévia com a imagem;
- teste os dados estruturados no [Teste de pesquisa aprimorada do Google](https://search.google.com/test/rich-results) com o endereço publicado.
