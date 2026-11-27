import { HARMONIAS } from '../lib/cores.js';
import CampoCor from './CampoCor.jsx';
import GrupoDeOpcoes from './comuns/GrupoDeOpcoes.jsx';

// As opções saem do objeto HARMONIAS: um tipo novo lá aparece aqui sozinho.
const TIPOS_DE_PALETA = Object.entries(HARMONIAS).map(([valor, harmonia]) => ({
  valor: valor,
  rotulo: harmonia.nome,
}));

// Formulário da ferramenta: junta a escolha da cor base e a do tipo de paleta.
function Formulario({
  cor,
  textoHex,
  hexInvalido,
  tipo,
  aoEscolherCor,
  aoDigitarHex,
  aoConfirmarHex,
  aoTrocarTipo,
  aoUsarContaGotas,
}) {
  // Enter no campo de HEX enviaria o formulário e recarregaria a página.
  // Aqui ele só confirma o que foi digitado.
  function aoEnviar(evento) {
    evento.preventDefault();
    aoConfirmarHex();
  }

  return (
    <form className="formulario" noValidate onSubmit={aoEnviar}>
      <CampoCor
        cor={cor}
        textoHex={textoHex}
        hexInvalido={hexInvalido}
        aoEscolherCor={aoEscolherCor}
        aoDigitarHex={aoDigitarHex}
        aoConfirmarHex={aoConfirmarHex}
        aoUsarContaGotas={aoUsarContaGotas}
      />
      <GrupoDeOpcoes
        legenda="Tipo de paleta"
        nome="tipo"
        opcoes={TIPOS_DE_PALETA}
        valor={tipo}
        aoTrocar={aoTrocarTipo}
      />
    </form>
  );
}

export default Formulario;
