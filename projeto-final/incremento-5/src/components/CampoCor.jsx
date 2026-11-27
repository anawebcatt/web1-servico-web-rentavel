import { useState } from 'react';
import { normalizarHex } from '../lib/cores.js';
import { temContaGotas } from '../servicos/navegador.js';
import Botao from './comuns/Botao.jsx';
import Mensagem from './comuns/Mensagem.jsx';

// Escolha da cor base: o seletor de cor, o campo de HEX e o conta-gotas.
//
// A cor válida mora no App e chega pela propriedade cor. O que a pessoa está digitando
// (que pode estar incompleto ou errado) só interessa a este componente: é estado local.
function CampoCor({ cor, aoEscolherCor, aoUsarContaGotas }) {
  // null quando não há nada sendo digitado. Senão, { texto, cor, confirmado }:
  // - texto: o que está no campo;
  // - cor: a cor base que estava valendo quando o texto foi digitado;
  // - confirmado: true depois que a pessoa sai do campo ou aperta Enter.
  const [rascunho, setRascunho] = useState(null);

  // Se a cor base mudou por outro caminho (seletor, conta-gotas, favorita, ideia),
  // o rascunho ficou velho e é ignorado. Nada precisa "limpar" o campo.
  const digitando = rascunho !== null && rascunho.cor === cor;
  const texto = digitando ? rascunho.texto : cor;
  const invalido = digitando && rascunho.confirmado && normalizarHex(texto) === null;

  // A cada tecla: a cor base muda assim que o texto vira um HEX válido.
  // Enquanto a pessoa ainda está digitando, não mostra erro.
  function aoDigitar(novoTexto) {
    const hex = normalizarHex(novoTexto);
    if (hex === null) {
      setRascunho({ texto: novoTexto, cor: cor, confirmado: invalido });
    } else {
      setRascunho({ texto: novoTexto, cor: hex, confirmado: false });
      aoEscolherCor(hex);
    }
  }

  // Ao sair do campo ou apertar Enter: avisa se ficou inválido,
  // ou arruma o texto (ex.: "04a" vira "#0044AA").
  function aoConfirmar() {
    if (!digitando) {
      return;
    }
    if (normalizarHex(texto) === null) {
      setRascunho({ ...rascunho, confirmado: true });
    } else {
      setRascunho(null);
    }
  }

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
          value={texto}
          maxLength={7}
          aria-label="Código HEX da cor base"
          aria-describedby="erro-hex"
          aria-invalid={invalido ? 'true' : undefined}
          autoComplete="off"
          spellCheck={false}
          onChange={(evento) => aoDigitar(evento.target.value)}
          onBlur={aoConfirmar}
          onKeyDown={(evento) => {
            if (evento.key === 'Enter') {
              aoConfirmar();
            }
          }}
        />
        {/* Detecção de recurso: o botão só aparece onde o conta-gotas existe. */}
        {temContaGotas() && <Botao onClick={aoUsarContaGotas}>Conta-gotas</Botao>}
      </div>
      {invalido && (
        <Mensagem tipo="erro" id="erro-hex">
          "{texto}" não é um HEX válido. Use 6 dígitos de 0 a 9 e de A a F, como #0047AB.
        </Mensagem>
      )}
    </div>
  );
}

export default CampoCor;
