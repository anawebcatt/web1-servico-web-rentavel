# Incremento 6 — Web APIs

**Status:** feito. Começou como uma cópia do [incremento 5](../incremento-5/).

**Foco:** Geolocation, Clipboard, File, Share etc.

**Objetivo:** incorporar pelo menos um recurso nativo do navegador que agregue valor.

## O que o CombinaCor faz nesta versão

Tudo do incremento 5, e mais:

1. **Copiar com um clique (Clipboard API).** Cada código da paleta (HEX, RGB e HSL) é um botão: clicar copia o código. O botão "Copiar CSS" copia o bloco de CSS pronto inteiro. Uma mensagem na parte de baixo da tela confirma o que foi copiado.
2. **Se não der para copiar,** o texto fica selecionado e a mensagem pede para usar Ctrl+C. Isso acontece quando a pessoa nega a permissão ou quando a página não está em HTTPS nem em `localhost`.
3. **Conta-gotas (EyeDropper API).** No Chrome e no Edge para computador, o botão "Conta-gotas" ao lado do campo de HEX deixa pegar a cor de qualquer ponto da tela, até fora do navegador, e ela vira a cor base. Nos outros navegadores o botão não aparece.

Os dois recursos resolvem o problema do CombinaCor: pegar a cor certa e levar o código para o CSS sem copiar à mão.

## Arquivos

- [`js/recursos.js`](js/recursos.js): **novo.** Usa a Clipboard API e o EyeDropper e devolve o resultado. Não mexe na página.
- [`js/main.js`](js/main.js): códigos viram botões de copiar, botão "Copiar CSS", mensagem de confirmação e conta-gotas.
- [`index.html`](index.html): botões do conta-gotas e de copiar o CSS, mensagem de confirmação e instruções atualizadas.
- [`css/style.css`](css/style.css): botões de código, mensagem de confirmação e a linha da cor base, que agora quebra no celular.
- [`js/cores.js`](js/cores.js), [`js/armazenamento.js`](js/armazenamento.js) e [`js/api.js`](js/api.js): iguais aos do incremento 5.

## Recursos usados e onde funcionam

| Recurso | Para quê | Onde funciona | Se não houver |
|---|---|---|---|
| [Clipboard API](https://developer.mozilla.org/pt-BR/docs/Web/API/Clipboard_API) (`navigator.clipboard.writeText`) | Copiar códigos e o CSS | Todos os navegadores atuais, só em HTTPS ou `localhost` | O texto fica selecionado para Ctrl+C |
| [EyeDropper API](https://developer.mozilla.org/en-US/docs/Web/API/EyeDropper_API) (`new EyeDropper().open()`) | Pegar uma cor da tela | Chrome e Edge para computador | O botão não aparece |

Por isso o site precisa ser aberto pelo servidor local (`localhost`) ou, depois de publicado, pelo GitHub Pages (HTTPS). Abrindo o `index.html` direto do disco a cópia pode não funcionar em todos os navegadores.

## Onde aparece cada conceito

| Conceito | Onde |
|---|---|
| Contexto seguro | `podeCopiar` confere `window.isSecureContext` antes de usar a Clipboard API |
| Detecção de recurso | `temContaGotas` (`'EyeDropper' in window`) decide se o botão aparece |
| Web API que devolve Promise | `writeText` e `EyeDropper.open()` são esperados com `await` |
| Gesto da pessoa | As duas APIs só funcionam dentro de um clique; por isso são chamadas direto no ouvinte de `click` |
| Cancelamento pela pessoa | Apertar Esc no conta-gotas dá `AbortError`, que `pegarCorDaTela` transforma em `null` (sem aviso) |
| Alternativa quando falha | `selecionarTexto` usa `document.createRange` e `getSelection` para deixar o texto pronto para Ctrl+C |
| Delegação de eventos | Um ouvinte só na paleta trata todos os botões de código, pelo `data-copiar` |
| Região de status | A mensagem de "copiado" tem `role="status"`, então leitores de tela também a anunciam |

## Como testar

Na pasta do repositório:

```bash
python3 -m http.server 8000 --directory projeto-incremental-2
```

Acesse http://localhost:8000/incremento-6/ e:

- clique num HEX, num RGB e num HSL e cole (Ctrl+V) num editor;
- clique em "Copiar CSS" e cole num arquivo `.css`;
- no Chrome ou no Edge, clique em "Conta-gotas" e depois em qualquer ponto da tela (até fora do navegador); aperte Esc para desistir;
- abra no Firefox ou no Safari e veja que o botão do conta-gotas não aparece;
- abra pelo IP da máquina (ex.: `http://192.168.0.10:8000/incremento-6/`, que não é contexto seguro) e veja o texto ficar selecionado em vez de copiado.
