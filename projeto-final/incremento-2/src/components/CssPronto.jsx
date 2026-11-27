import { useRef } from 'react';
import Botao from './comuns/Botao.jsx';

// O CSS da paleta, com um botão para copiar tudo.
// A referência ao <code> serve para selecionar o texto se a cópia falhar.
function CssPronto({ css, aoCopiar }) {
  const codigo = useRef(null);

  return (
    <>
      <div className="css-topo">
        <h3>CSS pronto</h3>
        <Botao pequeno onClick={() => aoCopiar(css, codigo.current)}>
          Copiar CSS
        </Botao>
      </div>
      <pre className="css-pronto">
        <code ref={codigo}>{css}</code>
      </pre>
    </>
  );
}

export default CssPronto;
