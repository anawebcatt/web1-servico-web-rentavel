# Incremento 3 — Persistência

**Status:** feito. Começou como uma cópia do [incremento 2](../incremento-2/).

**Foco:** `localStorage`.

**Objetivo:** salvar preferências, histórico ou dados locais.

## O que o CombinaCor faz nesta versão

Tudo do incremento 2, e mais:

1. **Lembra a última escolha.** Ao voltar para o site, a cor base e o tipo de paleta são os mesmos da última visita.
2. **Paletas favoritas.** O botão "☆ Salvar nas favoritas" guarda a paleta atual (cor base + tipo). Se a paleta já estiver salva, o botão vira "★ Salva nas favoritas" e, ao clicar de novo, ela sai das favoritas.
3. **Lista de favoritas.** Cada favorita aparece com as cores em miniatura, o tipo e o HEX da cor base. "Usar" volta para aquela paleta; "Remover" tira da lista. A favorita que está na tela fica destacada.
4. **Limite de 12 favoritas.** Ao salvar a 13ª, a mais antiga sai. Salvar a mesma paleta duas vezes não repete: ela só vai para o topo.
5. **Sincroniza abas.** Com o CombinaCor aberto em duas abas, salvar ou remover uma favorita em uma atualiza a lista da outra.
6. **Funciona mesmo sem armazenamento.** Se o navegador bloquear o `localStorage` (modo anônimo de alguns navegadores, armazenamento cheio), aparece um aviso e o site continua funcionando, só que sem guardar nada ao fechar.

## Arquivos

- [`index.html`](index.html): ganhou o botão de salvar, a seção "Paletas favoritas" e o texto "O que fica salvo" nas instruções.
- [`css/style.css`](css/style.css): estilos do botão e da lista de favoritas.
- [`js/cores.js`](js/cores.js): igual ao do incremento 2.
- [`js/armazenamento.js`](js/armazenamento.js): **novo.** Lê e grava no `localStorage`. Não mexe na página.
- [`js/main.js`](js/main.js): carrega o que foi salvo ao abrir a página e liga os botões das favoritas.

## Como os dados ficam guardados

Duas chaves no `localStorage`, com o prefixo `combinacor:` para não misturar com outros sites no mesmo endereço (no GitHub Pages, todos os projetos de `anawebcatt.github.io` dividem o mesmo `localStorage`):

| Chave | Exemplo do valor |
|---|---|
| `combinacor:preferencias` | `{"cor":"#E07A5F","tipo":"analoga"}` |
| `combinacor:favoritas` | `[{"cor":"#E07A5F","tipo":"analoga"},{"cor":"#0047AB","tipo":"monocromatica"}]` |

Só a cor base e o tipo são guardados. As outras cores da paleta são calculadas de novo com `gerarPaleta`, então não há como as cores salvas ficarem diferentes das calculadas.

## Onde aparece cada conceito

| Conceito | Onde |
|---|---|
| `localStorage.getItem` / `setItem` / `removeItem` | `lerDoArmazenamento`, `gravarNoArmazenamento` e `removerDoArmazenamento` no `armazenamento.js` |
| `JSON.stringify` / `JSON.parse` | Na gravação e na leitura: o `localStorage` só guarda texto |
| Valor padrão quando não há nada salvo | `getItem` devolve `null`; `carregarPreferencias` devolve `null` e `carregarFavoritas` devolve `[]` |
| `try`/`catch` | Armazenamento bloqueado ou cheio, e JSON estragado, não quebram a página |
| Validação do que foi lido | `ehPaletaValida`: qualquer pessoa pode editar o `localStorage` pelo DevTools |
| Apagar a chave quando a lista fica vazia | `salvarFavoritas` com lista vazia chama `removeItem` |
| Evento `storage` | No `main.js`: atualiza a lista quando outra aba muda as favoritas |
| Delegação de eventos e `data-*` | Um ouvinte só na lista trata "Usar" e "Remover" de todas as favoritas, usando `data-acao` e `data-indice` |
| `aria-pressed` | O botão de salvar funciona como liga/desliga |

## Como testar

Na pasta do repositório:

```bash
python3 -m http.server 8000 --directory projeto-incremental-2
```

Acesse http://localhost:8000/incremento-3/ e:

- escolha uma cor e um tipo, recarregue a página e veja que continuam iguais;
- salve duas ou três paletas, recarregue e veja a lista;
- clique em "Usar" numa favorita e em "Remover" em outra;
- clique no botão "★ Salva nas favoritas" para tirar a paleta atual da lista;
- abra o site em duas abas, salve uma paleta numa delas e volte para a outra;
- no DevTools, em Application > Local Storage, veja as chaves `combinacor:` e experimente apagar ou estragar o valor;
- abra numa janela anônima para ver o site sem nada salvo.
