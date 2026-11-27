# Incremento 2 — Componentização

**Status:** feito. Começou como uma cópia do [incremento 1](../incremento-1/).

**Foco:** componentes, propriedades (props) e reutilização.

**Objetivo:** separar interface e funcionalidades em partes reutilizáveis.

## O que muda nesta versão

A ferramenta faz o mesmo que no incremento 1 e tem o mesmo visual. O que muda é o tamanho das peças.

No incremento 1 havia um componente para cada região da página, e cada um repetia o próprio JSX de botões, mensagens e amostras de cor. Agora essas partes repetidas são componentes pequenos, configurados por propriedades e usados em vários lugares:

1. **Componentes comuns** (pasta nova [`src/components/comuns/`](src/components/comuns/)): `Botao`, `Mensagem`, `Amostra`, `CodigoCopiavel`, `GrupoDeOpcoes` e `NomeDaCor`. Não sabem nada sobre a página em que estão: só recebem propriedades.
2. **Partes da ferramenta** que saíram de dentro das seções: `CampoCor`, `BlocoDeCor`, `CssPronto`, `GrupoDeIdeias`, `ItemFavorita` e `AvisoDeCopia`.
3. **As seções ficaram menores.** `Formulario`, `Paleta`, `Ideias` e `Favoritas` agora só juntam as partes e repassam dados e funções.

## Arquivos

```
src/components/
├── comuns/                 # reutilizáveis em qualquer parte da página
│   ├── Botao.jsx           # novo
│   ├── Mensagem.jsx        # novo
│   ├── Amostra.jsx         # novo
│   ├── CodigoCopiavel.jsx  # novo
│   ├── GrupoDeOpcoes.jsx   # novo
│   └── NomeDaCor.jsx       # veio de components/
├── Formulario.jsx          # agora junta CampoCor + GrupoDeOpcoes
├── CampoCor.jsx            # novo: seletor, campo de HEX e conta-gotas
├── Paleta.jsx              # agora junta BlocoDeCor + CssPronto
├── BlocoDeCor.jsx          # novo: uma cor da paleta
├── CssPronto.jsx           # novo: bloco de CSS com botão de copiar
├── Ideias.jsx              # agora usa GrupoDeIdeias
├── GrupoDeIdeias.jsx       # novo: um estilo e as cores sugeridas
├── Favoritas.jsx           # agora usa ItemFavorita
├── ItemFavorita.jsx        # novo: uma paleta salva
├── AvisoDeCopia.jsx        # novo: aviso no canto da tela
├── Cabecalho.jsx, Anuncio.jsx, Instrucoes.jsx, Rodape.jsx   # iguais
```

O `App.jsx` e a pasta `src/lib/` continuam como no incremento 1 (o `App` só passou a usar o `AvisoDeCopia`). No `style.css` entrou uma linha: a amostra da paleta virou um `<span>` e precisa de `display: block`.

## Componentes reutilizáveis

| Componente | Propriedades | Onde é usado |
|---|---|---|
| [`Botao`](src/components/comuns/Botao.jsx) | `pequeno`, `type`, `children` e o que mais um `<button>` aceita (`onClick`, `disabled`, `aria-*`) | 6 lugares: conta-gotas, salvar nas favoritas, copiar CSS, buscar ideias, usar e remover favorita |
| [`Mensagem`](src/components/comuns/Mensagem.jsx) | `tipo` (`'aviso'` ou `'erro'`), `id`, `children` | 5 lugares: erro do HEX, aviso de cor neutra, aviso dos nomes, status das ideias, falha ao salvar |
| [`Amostra`](src/components/comuns/Amostra.jsx) | `hex`, `className` | Paleta (grande), ideias (média) e favoritas (miniatura) |
| [`NomeDaCor`](src/components/comuns/NomeDaCor.jsx) | `cor`, `className` | Paleta e ideias |
| [`CodigoCopiavel`](src/components/comuns/CodigoCopiavel.jsx) | `texto`, `destaque`, `aoCopiar` | 3 vezes em cada `BlocoDeCor`: HEX, RGB e HSL |
| [`GrupoDeOpcoes`](src/components/comuns/GrupoDeOpcoes.jsx) | `legenda`, `nome`, `opcoes`, `valor`, `aoTrocar` | Tipo de paleta |

## Onde aparece cada conceito

| Conceito | Onde |
|---|---|
| Propriedades com dados | `BlocoDeCor` recebe `cor`, `nome` e `ehCorBase`; `ItemFavorita` recebe `favorita` e `atual` |
| Propriedades com funções (filho avisa o pai) | `aoCopiar` em `CodigoCopiavel`, `aoUsar` e `aoRemover` em `ItemFavorita`, `aoEscolherCor` em `GrupoDeIdeias`, `aoTrocar` em `GrupoDeOpcoes` |
| Valor padrão de propriedade | `pequeno = false` e `type = 'button'` no `Botao`; `tipo = 'aviso'` na `Mensagem`; `destaque = false` no `CodigoCopiavel` |
| Propriedade booleana sem valor | `<Botao pequeno>`, `<CodigoCopiavel destaque>` |
| `children` | `Botao` e `Mensagem` mostram o que vai entre a abertura e o fechamento da tag |
| Repassar o resto das propriedades | `{...resto}` no `Botao`, para ele aceitar `onClick`, `disabled` e `aria-pressed` sem listar cada um |
| Composição | `Paleta` = `Botao` + `Mensagem` + vários `BlocoDeCor` + `CssPronto`; `BlocoDeCor` = `Amostra` + `NomeDaCor` + 3 `CodigoCopiavel` |
| Listas de componentes com `key` | `paleta.map` em `Paleta`, `favoritas.map` em `Favoritas`, `grupos.map` em `Ideias` |
| Mesmo componente, aparência diferente | `Amostra` com `className` diferente em cada lugar; `Botao` normal e `pequeno` |
| Componente que não mostra nada | `AvisoDeCopia` devolve `null` quando não há aviso |
| Opções a partir de dados | `Formulario` monta as opções do `GrupoDeOpcoes` a partir de `HARMONIAS` |

## O que ainda não mudou

O estado continua concentrado no `App`, que passa muitas propriedades para o `Formulario` (e ele repassa quase todas para o `CampoCor`). Organizar o que fica em cada componente é o assunto do [incremento 3](../incremento-3/).

Uma diferença pequena de comportamento: a mensagem de erro das ideias passou a usar `role="alert"` (antes era `role="status"`), porque agora todo erro passa pelo componente `Mensagem`.

## Como rodar

```bash
cd projeto-final/incremento-2
npm install
npm run dev
```

Acesse o endereço que aparecer no terminal (normalmente http://localhost:5173). `npm run lint` confere o código e `npm run build` gera a versão de produção.

## Como testar

Tudo deve se comportar como no incremento 1: trocar a cor e o tipo, copiar códigos e o CSS, salvar, usar e remover favoritas, buscar ideias e clicar numa delas.

Para ver os componentes, instale a extensão [React Developer Tools](https://react.dev/learn/react-developer-tools) e abra a aba **Components** do DevTools: a árvore mostra cada `Botao`, `BlocoDeCor` e `Amostra` com as propriedades que recebeu.
