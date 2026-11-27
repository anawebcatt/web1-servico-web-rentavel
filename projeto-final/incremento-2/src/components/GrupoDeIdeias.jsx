import Amostra from './comuns/Amostra.jsx';
import NomeDaCor from './comuns/NomeDaCor.jsx';

// Um grupo de ideias: o nome do estilo e as cores que a API sugeriu.
// Cada cor é um botão que avisa o pai qual HEX foi escolhido.
function GrupoDeIdeias({ titulo, cores, aoEscolherCor }) {
  return (
    <div className="grupo-ideias">
      <h3>{titulo}</h3>
      <ul className="lista-ideias">
        {/* A API pode repetir uma cor no mesmo grupo, então a posição entra na key. */}
        {cores.map((cor, i) => (
          <li key={`${i}-${cor.hex}`}>
            <button
              type="button"
              className="ideia"
              aria-label={`Usar ${cor.nome} (${cor.hex}) como cor base`}
              onClick={() => aoEscolherCor(cor.hex)}
            >
              <Amostra hex={cor.hex} className="ideia-amostra" />
              <code className="ideia-hex">{cor.hex}</code>
              <NomeDaCor cor={cor} className="ideia-nome" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default GrupoDeIdeias;
