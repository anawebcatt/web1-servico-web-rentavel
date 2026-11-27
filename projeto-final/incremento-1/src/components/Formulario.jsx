import { HARMONIAS } from '../lib/cores.js';
import { temContaGotas } from '../lib/recursos.js';

// Escolha da cor base e do tipo de paleta. Os campos são controlados:
// o valor vem do estado do App e cada mudança avisa o App por uma função.
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
      <div className="campo">
        <label htmlFor="seletor-cor">Cor base</label>
        <div className="campo-cor">
          {/* O seletor de cor só aceita letras minúsculas e o valor dele é sempre válido. */}
          <input
            type="color"
            id="seletor-cor"
            value={cor.toLowerCase()}
            onChange={(evento) => aoEscolherCor(evento.target.value.toUpperCase())}
          />
          <input
            type="text"
            id="campo-hex"
            value={textoHex}
            maxLength={7}
            aria-label="Código HEX da cor base"
            aria-describedby="erro-hex"
            aria-invalid={hexInvalido !== null ? 'true' : undefined}
            autoComplete="off"
            spellCheck={false}
            onChange={(evento) => aoDigitarHex(evento.target.value)}
            onBlur={aoConfirmarHex}
          />
          {/* Detecção de recurso: o botão só aparece onde o conta-gotas existe. */}
          {temContaGotas() && (
            <button type="button" className="botao" onClick={aoUsarContaGotas}>
              Conta-gotas
            </button>
          )}
        </div>
        {hexInvalido !== null && (
          <p id="erro-hex" className="mensagem erro" role="alert">
            "{hexInvalido}" não é um HEX válido. Use 6 dígitos de 0 a 9 e de A a F, como #0047AB.
          </p>
        )}
      </div>

      <fieldset className="campo">
        <legend>Tipo de paleta</legend>
        <div className="opcoes">
          {Object.entries(HARMONIAS).map(([valor, harmonia]) => (
            <label key={valor}>
              <input
                type="radio"
                name="tipo"
                value={valor}
                checked={tipo === valor}
                onChange={() => aoTrocarTipo(valor)}
              />{' '}
              {harmonia.nome}
            </label>
          ))}
        </div>
      </fieldset>
    </form>
  );
}

export default Formulario;
