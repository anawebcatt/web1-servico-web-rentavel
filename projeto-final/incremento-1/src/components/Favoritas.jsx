import { mesmaPaleta } from '../lib/armazenamento.js';
import { HARMONIAS, gerarPaleta } from '../lib/cores.js';

// Lista das paletas salvas: as cores em miniatura, o nome e os botões de cada uma.
function Favoritas({ favoritas, paletaAtual, falhouAoGravar, aoUsar, aoRemover }) {
  return (
    <section className="favoritas" aria-labelledby="titulo-favoritas">
      <h2 id="titulo-favoritas">Paletas favoritas</h2>

      {falhouAoGravar && (
        <p className="mensagem erro" role="alert">
          Este navegador não deixou salvar. No modo anônimo, ou com o armazenamento de sites bloqueado, as
          favoritas e a última cor somem ao fechar a página.
        </p>
      )}
      {favoritas.length === 0 && (
        <p className="vazio">
          Nenhuma paleta salva ainda. Use o botão "Salvar nas favoritas" para guardar a paleta atual.
        </p>
      )}

      <ul className="lista-favoritas">
        {favoritas.map((favorita) => {
          const nome = HARMONIAS[favorita.tipo].nome;
          const descricao = `${nome} de ${favorita.cor}`;
          const atual = mesmaPaleta(favorita, paletaAtual);

          return (
            <li className={atual ? 'favorita favorita-atual' : 'favorita'} key={`${favorita.tipo}-${favorita.cor}`}>
              <div className="favorita-cores">
                {gerarPaleta(favorita.cor, favorita.tipo).map((cor) => (
                  <span key={cor.hex} style={{ backgroundColor: cor.hex }} />
                ))}
              </div>
              <div className="favorita-texto">
                <strong>{nome}</strong>
                <code>{favorita.cor}</code>
              </div>
              <div className="favorita-acoes">
                <button
                  type="button"
                  className="botao botao-pequeno"
                  aria-label={`Usar a paleta ${descricao}`}
                  onClick={() => aoUsar(favorita)}
                >
                  Usar
                </button>
                <button
                  type="button"
                  className="botao botao-pequeno"
                  aria-label={`Remover a paleta ${descricao}`}
                  onClick={() => aoRemover(favorita)}
                >
                  Remover
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export default Favoritas;
