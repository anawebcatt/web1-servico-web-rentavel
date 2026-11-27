// Textos de ajuda. Não recebe propriedades nem guarda estado: é só conteúdo.
function Instrucoes() {
  return (
    <section className="instructions">
      <h2>Como usar</h2>
      <ol>
        <li>
          Escolha a cor base no seletor ou digite o código HEX, como <code>#0047AB</code>. No Chrome e no
          Edge, o botão "Conta-gotas" pega a cor de qualquer ponto da tela.
        </li>
        <li>Escolha o tipo de paleta. As cores mudam na hora.</li>
        <li>
          Clique num código (HEX, RGB ou HSL) para copiá-lo, ou em "Copiar CSS" para levar a paleta
          inteira. Depois é só colar no seu arquivo CSS.
        </li>
        <li>Gostou da paleta? Salve nas favoritas para voltar a ela depois.</li>
        <li>
          Quer outras opções? Em "Ideias da The Color API", escolha um estilo e clique em "Buscar ideias".
        </li>
      </ol>

      <h2>De onde vêm os nomes das cores</h2>
      <p>
        Os nomes vêm da <a href="https://www.thecolorapi.com/">The Color API</a>, em inglês. Quando a cor
        não tem um nome próprio, aparece o nome da cor mais parecida, marcado com <strong>≈</strong>. Sem
        internet, a paleta continua funcionando, só sem os nomes.
      </p>

      <h2>Privacidade e o que fica salvo</h2>
      <p>
        O CombinaCor lembra a última cor e o último tipo de paleta que você usou, e guarda até 12 paletas
        favoritas (as mais recentes ficam). Isso fica só neste navegador, no seu computador ou celular.
        Limpar os dados do site no navegador apaga as favoritas.
      </p>
      <p>
        Para mostrar os nomes e as ideias, os códigos das cores (só eles) são enviados à The Color API. O
        CombinaCor não tem login, não usa cookies e não coleta dados pessoais.
      </p>

      <h2>Tipos de paleta</h2>
      <dl>
        <dt>Complementar</dt>
        <dd>
          A cor base e a cor do lado oposto do círculo cromático. Dá bastante contraste: boa para destacar
          um botão ou um link.
        </dd>
        <dt>Análoga</dt>
        <dd>
          A cor base e as duas vizinhas dela no círculo cromático. As cores são parecidas, e o resultado é
          suave.
        </dd>
        <dt>Tríade</dt>
        <dd>Três cores com a mesma distância entre si no círculo cromático. Fica colorido e equilibrado.</dd>
        <dt>Monocromática</dt>
        <dd>
          A mesma cor em versões mais escuras e mais claras. Boa para fundos, bordas e textos de um mesmo
          tema.
        </dd>
      </dl>

      <h2>Como usar as cores no CSS</h2>
      <p>
        Cole o bloco de CSS pronto no começo do seu arquivo. Cada cor vira uma variável, que você usa com{' '}
        <code>var()</code>:
      </p>
      <pre>
        <code>{`button {
  background-color: var(--cor-1);
}`}</code>
      </pre>
      <p>HEX, RGB e HSL são três jeitos de escrever a mesma cor. Qualquer um dos três funciona no CSS.</p>
    </section>
  );
}

export default Instrucoes;
