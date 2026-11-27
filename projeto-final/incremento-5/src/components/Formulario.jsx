import { HARMONIAS } from '../lib/cores.js';
import CampoCor from './CampoCor.jsx';
import GrupoDeOpcoes from './comuns/GrupoDeOpcoes.jsx';

// As opções saem do objeto HARMONIAS: um tipo novo lá aparece aqui sozinho.
const TIPOS_DE_PALETA = Object.entries(HARMONIAS).map(([valor, harmonia]) => ({
  valor: valor,
  rotulo: harmonia.nome,
}));

// Formulário da ferramenta: a escolha da cor base e a do tipo de paleta.
// Não guarda estado: mostra a paleta que recebe ({ cor, tipo }) e avisa o App do que mudou.
function Formulario({ paleta, aoTrocar, aoUsarContaGotas }) {
  return (
    // Sem isso, Enter num campo enviaria o formulário e recarregaria a página.
    <form className="formulario" noValidate onSubmit={(evento) => evento.preventDefault()}>
      <CampoCor
        cor={paleta.cor}
        aoEscolherCor={(cor) => aoTrocar({ cor: cor })}
        aoUsarContaGotas={aoUsarContaGotas}
      />
      <GrupoDeOpcoes
        legenda="Tipo de paleta"
        nome="tipo"
        opcoes={TIPOS_DE_PALETA}
        valor={paleta.tipo}
        aoTrocar={(tipo) => aoTrocar({ tipo: tipo })}
      />
    </form>
  );
}

export default Formulario;
