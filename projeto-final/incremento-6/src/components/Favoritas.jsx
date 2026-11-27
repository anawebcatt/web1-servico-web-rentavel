import { Link } from 'react-router';
import { mesmaPaleta } from '../servicos/armazenamento.js';
import ItemFavorita from './ItemFavorita.jsx';
import Mensagem from './comuns/Mensagem.jsx';

// Lista das paletas salvas, com um ItemFavorita para cada uma.
function Favoritas({ favoritas, paletaAtual, falhouAoGravar, aoUsar, aoRemover }) {
  return (
    <section className="favoritas" aria-labelledby="titulo-favoritas">
      <h2 id="titulo-favoritas">Paletas favoritas</h2>

      {falhouAoGravar && (
        <Mensagem tipo="erro">
          Este navegador não deixou salvar. No modo anônimo, ou com o armazenamento de sites bloqueado, as
          favoritas e a última cor somem ao fechar a página.
        </Mensagem>
      )}
      {favoritas.length === 0 && (
        <p className="vazio">
          Nenhuma paleta salva ainda. No <Link to="/">gerador</Link>, use o botão "Salvar nas favoritas"
          para guardar a paleta atual.
        </p>
      )}

      <ul className="lista-favoritas">
        {favoritas.map((favorita) => (
          <ItemFavorita
            key={`${favorita.tipo}-${favorita.cor}`}
            favorita={favorita}
            atual={mesmaPaleta(favorita, paletaAtual)}
            aoUsar={aoUsar}
            aoRemover={aoRemover}
          />
        ))}
      </ul>
    </section>
  );
}

export default Favoritas;
