import { temContaGotas } from '../lib/recursos.js';
import Botao from './comuns/Botao.jsx';
import Mensagem from './comuns/Mensagem.jsx';

// Escolha da cor base: o seletor de cor, o campo de HEX e o conta-gotas.
// Os campos são controlados: o valor vem das propriedades e cada mudança avisa o pai por uma função.
function CampoCor({ cor, textoHex, hexInvalido, aoEscolherCor, aoDigitarHex, aoConfirmarHex, aoUsarContaGotas }) {
  return (
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
        {temContaGotas() && <Botao onClick={aoUsarContaGotas}>Conta-gotas</Botao>}
      </div>
      {hexInvalido !== null && (
        <Mensagem tipo="erro" id="erro-hex">
          "{hexInvalido}" não é um HEX válido. Use 6 dígitos de 0 a 9 e de A a F, como #0047AB.
        </Mensagem>
      )}
    </div>
  );
}

export default CampoCor;
