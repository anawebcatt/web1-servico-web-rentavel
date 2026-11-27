import { useRef } from 'react';
import { HARMONIAS, criarCor, ehCorNeutra, formatarHsl, formatarRgb, gerarCss } from '../lib/cores.js';
import NomeDaCor from './NomeDaCor.jsx';

// A paleta gerada: um bloco para cada cor, com a amostra e os três códigos,
// e o CSS pronto para copiar.
function Paleta({ paleta, corBase, tipo, nomes, avisoNomes, salva, refTitulo, aoAlternarFavorita, aoCopiar }) {
  const cssPronto = useRef(null);
  const css = gerarCss(paleta);
  const mostrarAvisoNeutra = tipo !== 'monocromatica' && ehCorNeutra(criarCor(corBase));

  // Cada código é um botão que copia o próprio texto.
  function botaoCodigo(texto, classe) {
    return (
      <button
        type="button"
        className={`codigo ${classe}`}
        title="Clique para copiar"
        aria-label={`Copiar ${texto}`}
        onClick={(evento) => aoCopiar(texto, texto, evento.currentTarget)}
      >
        <code>{texto}</code>
      </button>
    );
  }

  return (
    <section className="resultado" aria-labelledby="titulo-paleta">
      <div className="resultado-topo">
        <h2 id="titulo-paleta" ref={refTitulo}>
          Paleta {HARMONIAS[tipo].nome.toLowerCase()}
        </h2>
        {/* O botão funciona como um liga/desliga: aria-pressed diz se a paleta atual já está salva. */}
        <button type="button" className="botao" aria-pressed={salva} onClick={aoAlternarFavorita}>
          {salva ? '★ Salva nas favoritas' : '☆ Salvar nas favoritas'}
        </button>
      </div>

      {mostrarAvisoNeutra && (
        <p className="mensagem aviso" role="status">
          Cinza, branco e preto não têm matiz, então só a paleta monocromática gera variações dessa cor.
        </p>
      )}
      {avisoNomes !== null && (
        <p className="mensagem aviso" role="status">
          {avisoNomes}
        </p>
      )}

      <ul className="paleta">
        {paleta.map((cor) => (
          <li className="cor" key={cor.hex}>
            <div className="cor-amostra" style={{ backgroundColor: cor.hex }} />
            <div className="cor-codigos">
              {cor.hex === corBase && <span className="cor-base">Cor base</span>}
              <NomeDaCor cor={nomes[cor.hex]} className="cor-nome" />
              {botaoCodigo(cor.hex, 'cor-hex')}
              {botaoCodigo(formatarRgb(cor.rgb), '')}
              {botaoCodigo(formatarHsl(cor.hsl), '')}
            </div>
          </li>
        ))}
      </ul>

      <div className="css-topo">
        <h3>CSS pronto</h3>
        <button
          type="button"
          className="botao botao-pequeno"
          onClick={() => aoCopiar(css, 'CSS da paleta', cssPronto.current)}
        >
          Copiar CSS
        </button>
      </div>
      <pre className="css-pronto">
        <code ref={cssPronto}>{css}</code>
      </pre>
    </section>
  );
}

export default Paleta;
