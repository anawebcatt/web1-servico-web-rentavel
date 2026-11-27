// Grupo de botões de rádio. opcoes é uma lista de { valor, rotulo };
// valor é a opção marcada e aoTrocar recebe o valor da opção clicada.
function GrupoDeOpcoes({ legenda, nome, opcoes, valor, aoTrocar }) {
  return (
    <fieldset className="campo">
      <legend>{legenda}</legend>
      <div className="opcoes">
        {opcoes.map((opcao) => (
          <label key={opcao.valor}>
            <input
              type="radio"
              name={nome}
              value={opcao.valor}
              checked={valor === opcao.valor}
              onChange={() => aoTrocar(opcao.valor)}
            />{' '}
            {opcao.rotulo}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export default GrupoDeOpcoes;
