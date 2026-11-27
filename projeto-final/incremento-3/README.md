# Incremento 3 — Estado da aplicação

**Status:** feito. Começou como uma cópia do [incremento 2](../incremento-2/).

**Foco:** `useState` e estado local.

**Objetivo:** substituir manipulações diretas do DOM por gerenciamento de estado.

## O que muda nesta versão

A ferramenta faz o mesmo que no incremento 2 e tem o mesmo visual. O que muda é onde cada informação fica guardada e como ela é atualizada.

1. **Cor e tipo viraram um estado só.** Antes eram dois `useState` (`corAtual` e `tipo`), sempre alterados e salvos juntos. Agora o `App` guarda um objeto `paletaAtual`, `{ cor, tipo }`, no mesmo formato das favoritas. Usar uma favorita passou a ser `trocarPaleta(favorita)`.
2. **O texto do campo de HEX virou estado local do `CampoCor`.** O `App` guardava o texto digitado e o erro, e passava os dois por propriedades. Só o campo usa essas informações, então elas foram para dentro dele. O `App` fica só com a cor válida.
3. **Menos propriedades.** O `Formulario` recebia 9 e agora recebe 3 (`paleta`, `aoTrocar` e `aoUsarContaGotas`). O `App` perdeu três funções (`usarCor`, `aoDigitarHex` e `aoConfirmarHex`).
4. **A busca de ideias tem uma fase só.** Em vez de `buscando`, `status` e `grupos` separados, a `Ideias` guarda um objeto `busca` com `fase` (`'parada'`, `'buscando'`, `'pronta'` ou `'erro'`), `texto` e `grupos`.

## Arquivos

- [`src/App.jsx`](src/App.jsx): estado `paletaAtual` e função `trocarPaleta`.
- [`src/components/Formulario.jsx`](src/components/Formulario.jsx): recebe a paleta e avisa o que mudou.
- [`src/components/CampoCor.jsx`](src/components/CampoCor.jsx): estado local `rascunho`.
- [`src/components/Ideias.jsx`](src/components/Ideias.jsx): estado `busca` com fases.
- O resto é igual ao incremento 2.

## Onde mora cada estado

| Estado | Componente | Por que fica aí |
|---|---|---|
| `paletaAtual` (`{ cor, tipo }`) | `App` | Formulário, paleta, ideias e favoritas usam |
| `favoritas` | `App` | A paleta (botão de salvar) e a lista de favoritas usam |
| `falhouAoGravar` | `App` | Tanto as preferências quanto as favoritas podem falhar ao gravar |
| `nomes` e `avisoNomes` | `App` | A paleta mostra; as ideias também trazem nomes |
| `avisoCopia` | `App` | Copiar e o conta-gotas mostram o mesmo aviso |
| `rascunho` (texto sendo digitado) | `CampoCor` | Só o campo de HEX usa |
| `modo` e `busca` | `Ideias` | Só a seção de ideias usa |

A regra: o estado fica no componente mais próximo que contém todos os que precisam dele. Se só um componente usa, é estado local. Se dois irmãos usam, sobe para o pai deles.

## O que não é estado

Alguns valores mudam na tela mas não estão em `useState`, porque dá para calcular a partir do que já está guardado:

| Valor | Calculado a partir de |
|---|---|
| `cores` (a paleta gerada) | `paletaAtual` |
| `salva` (se a paleta atual está nas favoritas) | `favoritas` e `paletaAtual` |
| Texto do botão "Salvar nas favoritas" e o `aria-pressed` | `salva` |
| CSS pronto | `cores` |
| Aviso de cor neutra | `paletaAtual` |
| `texto` e `invalido` do campo de HEX | `rascunho` e a propriedade `cor` |
| Botão "Buscar ideias" desativado | `busca.fase` |

Guardar esses valores em estado criaria duas cópias da mesma informação. No JavaScript puro era isso que acontecia: a cor estava na variável `corAtual`, no seletor, no campo de HEX e nos blocos da paleta, e a função `preencherCampos()` existia só para manter tudo igual.

## O campo de HEX sem "limpar o campo"

No JavaScript puro, toda vez que a cor mudava por outro caminho (favorita, ideia, conta-gotas), o código chamava `preencherCampos()` para escrever a cor nova no campo e esconder o erro. No incremento 1 isso continuou, com `setTextoHex` e `setHexInvalido` no `App`.

Agora o `CampoCor` guarda um `rascunho` que lembra para qual cor base ele foi digitado:

```js
const digitando = rascunho !== null && rascunho.cor === cor;
const texto = digitando ? rascunho.texto : cor;
```

Se a cor base muda por outro caminho, o rascunho deixa de valer e o campo mostra a cor nova. Ninguém precisa mandar limpar.

## Do JavaScript puro para o estado

| No JavaScript puro | Com estado |
|---|---|
| `corAtual = hex; preencherCampos(hex); mostrarPaleta();` | `trocarPaleta({ cor: hex })` |
| `formulario.elements.tipo.value = favorita.tipo` | `trocarPaleta(favorita)` |
| `botaoSalvar.getAttribute('aria-pressed') === 'true'` para saber se está salva | `salva`, calculado das favoritas |
| `botaoIdeias.disabled = true` ... `finally { disabled = false }` | `disabled={busca.fase === 'buscando'}` |
| `statusIdeias.classList.toggle('erro', ehErro)` | `tipo={busca.fase === 'erro' ? 'erro' : 'aviso'}` |
| `erroHex.hidden = false; campoHex.setAttribute('aria-invalid', 'true')` | `invalido`, calculado do rascunho |

## Onde aparece cada conceito

| Conceito | Onde |
|---|---|
| `useState` | `App`, `CampoCor` e `Ideias` |
| Valor inicial calculado uma vez só | `useState(paletaInicial)` e `useState(carregarFavoritas)` no `App`: a função é passada sem parênteses |
| Objeto no estado, trocado por um novo | `trocarPaleta` no `App` (`{ ...paletaAtual, ...mudancas }`); `setRascunho({ ...rascunho, confirmado: true })` |
| Lista no estado, trocada por uma nova | `adicionarFavorita` e `removerFavorita` devolvem outra lista |
| Atualização a partir do estado anterior | `setNomes((anteriores) => ...)` no `App`; `setBusca((anterior) => ...)` na `Ideias` |
| Estado local | `rascunho` no `CampoCor`; `modo` e `busca` na `Ideias` |
| Estado compartilhado no pai | `paletaAtual` e `favoritas` no `App` |
| Dados descem, eventos sobem | `Formulario` recebe `paleta` e chama `aoTrocar({ cor })` ou `aoTrocar({ tipo })` |
| Valores calculados em vez de estado | Tabela "O que não é estado" |
| Fases em vez de vários booleanos | `busca.fase` na `Ideias` |
| Campo controlado | `value` e `onChange` no seletor, no campo de HEX, nos rádios e no `<select>` |

## Um caso que mudou

Se a pessoa digita um HEX inválido e depois usa uma favorita que tem **a mesma cor base** que já estava na tela (só o tipo é diferente), o texto inválido e o erro continuam no campo, porque a cor base não mudou. Antes o campo era reescrito. Em qualquer outro caso (cor diferente), o campo mostra a cor nova, como antes.

## O que ainda não mudou

Os três `useEffect` do `App` (nomes das cores, evento `storage` e aviso de cópia) continuam como no incremento 1. Eles são o assunto do incremento 4.

## Como rodar

```bash
cd projeto-final/incremento-3
npm install
npm run dev
```

Acesse o endereço que aparecer no terminal (normalmente http://localhost:5173). `npm run lint` confere o código e `npm run build` gera a versão de produção.

## Como testar

- Digite `04a` no campo de HEX: a paleta muda na hora e o texto fica como você digitou. Ao sair do campo, vira `#0044AA`.
- Digite `xyz` e saia do campo: aparece o erro. Mude a cor pelo seletor: o campo mostra a cor nova e o erro some.
- Salve uma paleta, troque o tipo e clique em "Usar" na favorita: cor e tipo voltam juntos.
- Recarregue a página: a cor e o tipo continuam.
- Busque ideias, desligue a internet e busque de novo: aparece o erro e as ideias anteriores continuam na tela.

Com a extensão [React Developer Tools](https://react.dev/learn/react-developer-tools), a aba **Components** mostra o estado de cada componente (em "hooks") mudando enquanto você usa a página.
