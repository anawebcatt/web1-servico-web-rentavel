# Incremento 2 — DOM e eventos

**Status:** feito. Começou como uma cópia do [incremento 1](../incremento-1/).

**Foco:** DOM, formulários e eventos.

**Objetivo:** permitir interação sem recarregar a página.

## O que o CombinaCor faz nesta versão

1. A pessoa escolhe a cor base no seletor de cor ou digita o HEX. Os dois campos se atualizam juntos.
2. Escolhe o tipo de paleta: complementar, análoga, tríade ou monocromática.
3. A paleta aparece na página em blocos de cor, com os códigos HEX, RGB e HSL, e o CSS pronto logo abaixo.
4. Quando a cor ou o tipo muda, a paleta se atualiza na hora, sem recarregar a página.
5. Se o HEX digitado for inválido, um aviso aparece abaixo do campo ao sair dele (ou ao apertar Enter). A paleta continua na última cor válida.
6. Para cinza, branco e preto, a página avisa que só a paleta monocromática gera variações.

Não há mais `prompt`, `alert` nem saída no console.

## Arquivos

- [`index.html`](index.html): formulário, área da paleta, espaço do anúncio e texto das instruções.
- [`css/style.css`](css/style.css): layout e visual. Tudo empilhado no celular; a partir de 900px de largura, o anúncio de 300x250 fica ao lado.
- [`js/cores.js`](js/cores.js): igual ao do incremento 1. Faz as contas de cor e não mexe na página.
- [`js/main.js`](js/main.js): lê o formulário, escuta os eventos e monta a paleta na página.

## Onde aparece cada conceito

| Conceito | Onde |
|---|---|
| Selecionar elementos | `document.querySelector` no topo do `main.js` |
| Criar elementos | `document.createElement` em `criarElemento`; `append` em `criarBloco` |
| Alterar conteúdo | `textContent` no título, nos códigos e no CSS pronto; `replaceChildren` troca os blocos da paleta |
| Alterar estilo e atributos | `style.backgroundColor` na amostra; `hidden` nos avisos; `aria-invalid` no campo de HEX |
| Formulário | `<input type="color">`, campo de texto e botões de rádio; leitura com `formulario.elements.tipo.value` |
| Evento `input` | Seletor de cor e campo de HEX: atualiza a cada mudança |
| Evento `change` | Campo de HEX (valida ao sair do campo) e tipo de paleta |
| Delegação de eventos | Um ouvinte só no formulário trata os quatro botões de rádio, usando `evento.target` |
| `preventDefault` | No `submit`, para o Enter não recarregar a página |

## Como testar

Na pasta do repositório:

```bash
python3 -m http.server 8000 --directory projeto-incremental-2
```

Acesse http://localhost:8000/incremento-2/ e:

- mude a cor no seletor e veja o campo de HEX e a paleta acompanharem;
- digite `#ff0000` ou `04a` no campo de HEX;
- digite `xyz` e saia do campo para ver o aviso;
- troque o tipo de paleta;
- escolha um cinza (`#808080`) com um tipo que não seja monocromática;
- diminua a largura da janela para ver o layout de celular.
