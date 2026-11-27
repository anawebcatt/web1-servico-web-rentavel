import { useState } from 'react';
import { MODOS_API, buscarPaletaDaApi, explicarErroDaApi } from '../lib/api.js';
import GrupoDeIdeias from './GrupoDeIdeias.jsx';
import Botao from './comuns/Botao.jsx';
import Mensagem from './comuns/Mensagem.jsx';

const CORES_POR_IDEIA = 5;

// Como a busca começa: nada foi pedido ainda.
const BUSCA_INICIAL = { fase: 'parada', texto: '', grupos: [] };

// Paletas montadas pela The Color API a partir da cor base.
// O estado desta parte só interessa a ela, então fica aqui e não no App.
function Ideias({ cor, aoEscolherCor, aoReceberCores }) {
  const [modo, setModo] = useState('todos');

  // A busca tem uma fase só de cada vez: 'parada', 'buscando', 'pronta' ou 'erro'.
  // Com um booleano para cada coisa (buscando, deuErro...) daria para montar combinações
  // que não existem, como "buscando" e "erro" ao mesmo tempo.
  // texto é a mensagem da fase e grupos é o último resultado: uma lista de { modo, cores }.
  const [busca, setBusca] = useState(BUSCA_INICIAL);

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
    // Enquanto busca (e se der erro), as ideias anteriores continuam na tela.
    setBusca((anterior) => ({ ...anterior, fase: 'buscando', texto: `Buscando ideias para ${cor}…` }));
    try {
      const resultado = modo === 'todos' ? await buscarTodosOsEstilos() : await buscarUmEstilo();
      setBusca({ fase: 'pronta', texto: resultado.texto, grupos: resultado.grupos });
      aoReceberCores(resultado.grupos.flatMap((grupo) => grupo.cores));
    } catch (erro) {
      setBusca((anterior) => ({ ...anterior, fase: 'erro', texto: explicarErroDaApi(erro) }));
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
        <Botao type="submit" disabled={busca.fase === 'buscando'}>
          Buscar ideias
        </Botao>
      </form>

      {busca.fase !== 'parada' && <Mensagem tipo={busca.fase === 'erro' ? 'erro' : 'aviso'}>{busca.texto}</Mensagem>}

      <div className="ideias-resultado">
        {busca.grupos.map((grupo) => (
          <GrupoDeIdeias
            key={grupo.modo}
            titulo={MODOS_API[grupo.modo]}
            cores={grupo.cores}
            aoEscolherCor={aoEscolherCor}
          />
        ))}
      </div>
    </section>
  );
}

export default Ideias;
