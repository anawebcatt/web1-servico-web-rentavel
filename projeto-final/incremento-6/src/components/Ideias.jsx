import { useState } from 'react';
import useIdeias from '../hooks/useIdeias.js';
import { MODOS_API } from '../servicos/colorApi.js';
import GrupoDeIdeias from './GrupoDeIdeias.jsx';
import Botao from './comuns/Botao.jsx';
import Mensagem from './comuns/Mensagem.jsx';

// Paletas montadas pela The Color API a partir da cor base.
// O componente só cuida da tela: quem fala com a API é o hook useIdeias, por meio do serviço.
function Ideias({ cor, aoEscolherCor, aoReceberCores }) {
  const [modo, setModo] = useState('todos');
  const { busca, buscar, cancelar } = useIdeias();
  const buscando = busca.fase === 'buscando';

  async function aoEnviar(evento) {
    evento.preventDefault();
    const cores = await buscar(cor, modo);
    if (cores !== null) {
      aoReceberCores(cores);
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
        <Botao type="submit" disabled={buscando}>
          Buscar ideias
        </Botao>
        {buscando && <Botao onClick={cancelar}>Cancelar</Botao>}
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
