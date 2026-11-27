import { formatarHsl, formatarRgb } from '../lib/cores.js';
import Amostra from './comuns/Amostra.jsx';
import CodigoCopiavel from './comuns/CodigoCopiavel.jsx';
import NomeDaCor from './comuns/NomeDaCor.jsx';

// Um bloco da paleta: a amostra da cor, o nome e os três códigos.
// cor é { hex, rgb, hsl }; nome é o que veio da API (veja NomeDaCor).
function BlocoDeCor({ cor, nome, ehCorBase, aoCopiar }) {
  return (
    <li className="cor">
      <Amostra hex={cor.hex} className="cor-amostra" />
      <div className="cor-codigos">
        {ehCorBase && <span className="cor-base">Cor base</span>}
        <NomeDaCor cor={nome} className="cor-nome" />
        <CodigoCopiavel texto={cor.hex} destaque aoCopiar={aoCopiar} />
        <CodigoCopiavel texto={formatarRgb(cor.rgb)} aoCopiar={aoCopiar} />
        <CodigoCopiavel texto={formatarHsl(cor.hsl)} aoCopiar={aoCopiar} />
      </div>
    </li>
  );
}

export default BlocoDeCor;
