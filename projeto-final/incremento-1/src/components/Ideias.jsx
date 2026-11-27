import { useState } from 'react';
import { MODOS_API, buscarPaletaDaApi, explicarErroDaApi } from '../lib/api.js';
import NomeDaCor from './NomeDaCor.jsx';

const CORES_POR_IDEIA = 5;

// Paletas montadas pela The Color API a partir da cor base.
// O estado desta parte (estilo escolhido, resultado e mensagem) só interessa a ela, então fica aqui.
function Ideias({ cor, aoEscolherCor, aoReceberCores }) {
  const [modo, setModo] = useState('todos');
  const [buscando, setBuscando] = useState(false);
  const [status, setStatus] = useState(null);
  // Cada grupo é { modo, cores }.
  const [grupos, setGrupos] = useState([]);

  // Todos os estilos ao mesmo tempo. Com allSettled, um estilo que falha
  // não esconde os que deram certo (o Promise.all rejeitaria tudo).
  async function buscarTodosOsEstilos() {
    const modos = Object.keys(MODOS_API);
    const resultados = await Promise.allSettled(
      modos.map((umModo) => buscarPaletaDaApi(cor, umModo, CORES_POR_IDEIA))
    );

    const novosGrupos = [];
    resultados.forEach((resultado, i) => {
      if (resultado.status === 'fulfilled') {
        novosGrupos.push({ modo: modos[i], cores: resultado.value });
      }
    });
    if (novosGrupos.length === 0) {
      throw resultados[0].reason;
    }

    const falhas = modos.length - novosGrupos.length;
    const aviso = falhas > 0 ? ` ${falhas} não ${falhas === 1 ? 'veio' : 'vieram'} (falha na API).` : '';
    return {
      grupos: novosGrupos,
      texto: `${novosGrupos.length} estilos da The Color API para ${cor}.${aviso}`,
    };
  }

  async function buscarUmEstilo() {
    const cores = await buscarPaletaDaApi(cor, modo, CORES_POR_IDEIA);
    return {
      grupos: [{ modo: modo, cores: cores }],
      texto: `Paleta ${MODOS_API[modo].toLowerCase()} da The Color API para ${cor}:`,
    };
  }

  // Pede ao endpoint /scheme paletas de 5 cores no estilo escolhido.
  async function aoEnviar(evento) {
    evento.preventDefault();
    setBuscando(true);
    setStatus({ texto: `Buscando ideias para ${cor}…`, ehErro: false });
    try {
      const resultado = modo === 'todos' ? await buscarTodosOsEstilos() : await buscarUmEstilo();
      setGrupos(resultado.grupos);
      setStatus({ texto: resultado.texto, ehErro: false });
      aoReceberCores(resultado.grupos.flatMap((grupo) => grupo.cores));
    } catch (erro) {
      setStatus({ texto: explicarErroDaApi(erro), ehErro: true });
    } finally {
      setBuscando(false);
    }
  }

  return (
    <section className="ideias" aria-labelledby="titulo-ideias">
      <h2 id="titulo-ideias">Ideias da The Color API</h2>
      <p className="secao-texto">
        Paletas montadas pela The Color API a partir da sua cor base. Escolha um estilo ou veja todos de
        uma vez. Clique numa cor para usá-la como nova cor base.
      </p>

      <form className="ideias-form" onSubmit={aoEnviar}>
        <label htmlFor="modo-api">Estilo</label>
        <select id="modo-api" name="modo" value={modo} onChange={(evento) => setModo(evento.target.value)}>
          <option value="todos">Todos os estilos</option>
          {Object.entries(MODOS_API).map(([valor, nome]) => (
            <option key={valor} value={valor}>
              {nome}
            </option>
          ))}
        </select>
        <button type="submit" className="botao" disabled={buscando}>
          Buscar ideias
        </button>
      </form>

      {status !== null && (
        <p className={`mensagem ${status.ehErro ? 'erro' : 'aviso'}`} role="status">
          {status.texto}
        </p>
      )}

      <div className="ideias-resultado">
        {grupos.map((grupo) => (
          <div className="grupo-ideias" key={grupo.modo}>
            <h3>{MODOS_API[grupo.modo]}</h3>
            <ul className="lista-ideias">
              {/* A API pode repetir uma cor no mesmo grupo, então a posição entra na key. */}
              {grupo.cores.map((ideia, i) => (
                <li key={`${i}-${ideia.hex}`}>
                  <button
                    type="button"
                    className="ideia"
                    aria-label={`Usar ${ideia.nome} (${ideia.hex}) como cor base`}
                    onClick={() => aoEscolherCor(ideia.hex)}
                  >
                    <span className="ideia-amostra" style={{ backgroundColor: ideia.hex }} />
                    <code className="ideia-hex">{ideia.hex}</code>
                    <NomeDaCor cor={ideia} className="ideia-nome" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Ideias;
