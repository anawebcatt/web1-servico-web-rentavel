import { HARMONIAS, gerarPaleta } from '../lib/cores.js';
import Amostra from './comuns/Amostra.jsx';
import Botao from './comuns/Botao.jsx';

// Uma paleta salva: as cores em miniatura, o nome e os botões.
// favorita é { cor, tipo }; atual diz se é a paleta que está na tela.
function ItemFavorita({ favorita, atual, aoUsar, aoRemover }) {
  const nome = HARMONIAS[favorita.tipo].nome;
  const descricao = `${nome} de ${favorita.cor}`;

  return (
    <li className={atual ? 'favorita favorita-atual' : 'favorita'}>
      <div className="favorita-cores">
        {gerarPaleta(favorita.cor, favorita.tipo).map((cor) => (
          <Amostra key={cor.hex} hex={cor.hex} />
        ))}
      </div>
      <div className="favorita-texto">
        <strong>{nome}</strong>
        <code>{favorita.cor}</code>
      </div>
      <div className="favorita-acoes">
        <Botao pequeno aria-label={`Usar a paleta ${descricao}`} onClick={() => aoUsar(favorita)}>
          Usar
        </Botao>
        <Botao pequeno aria-label={`Remover a paleta ${descricao}`} onClick={() => aoRemover(favorita)}>
          Remover
        </Botao>
      </div>
    </li>
  );
}

export default ItemFavorita;
