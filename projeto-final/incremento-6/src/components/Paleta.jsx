import { HARMONIAS, criarCor, ehCorNeutra, gerarCss } from '../lib/cores.js';
import BlocoDeCor from './BlocoDeCor.jsx';
import CssPronto from './CssPronto.jsx';
import Botao from './comuns/Botao.jsx';
import Mensagem from './comuns/Mensagem.jsx';

// A paleta gerada: um BlocoDeCor para cada cor e o CSS pronto para copiar.
function Paleta({ paleta, corBase, tipo, nomes, avisoNomes, salva, refTitulo, aoAlternarFavorita, aoCopiar, aoCopiarLink }) {
  const mostrarAvisoNeutra = tipo !== 'monocromatica' && ehCorNeutra(criarCor(corBase));

  return (
    <section className="resultado" aria-labelledby="titulo-paleta">
      <div className="resultado-topo">
        <h2 id="titulo-paleta" ref={refTitulo}>
          Paleta {HARMONIAS[tipo].nome.toLowerCase()}
        </h2>
        {/* O botão funciona como um liga/desliga: aria-pressed diz se a paleta atual já está salva. */}
        <div className="resultado-acoes">
          <Botao onClick={aoCopiarLink}>Copiar link</Botao>
          <Botao aria-pressed={salva} onClick={aoAlternarFavorita}>
            {salva ? '★ Salva nas favoritas' : '☆ Salvar nas favoritas'}
          </Botao>
        </div>
      </div>

      {mostrarAvisoNeutra && (
        <Mensagem>
          Cinza, branco e preto não têm matiz, então só a paleta monocromática gera variações dessa cor.
        </Mensagem>
      )}
      {avisoNomes !== null && <Mensagem>{avisoNomes}</Mensagem>}

      <ul className="paleta">
        {paleta.map((cor) => (
          <BlocoDeCor
            key={cor.hex}
            cor={cor}
            nome={nomes[cor.hex]}
            ehCorBase={cor.hex === corBase}
            aoCopiar={(texto, elemento) => aoCopiar(texto, texto, elemento)}
          />
        ))}
      </ul>

      <CssPronto css={gerarCss(paleta)} aoCopiar={(css, elemento) => aoCopiar(css, 'CSS da paleta', elemento)} />
    </section>
  );
}

export default Paleta;
