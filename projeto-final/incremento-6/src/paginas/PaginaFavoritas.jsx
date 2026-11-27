import { useNavigate } from 'react-router';
import Favoritas from '../components/Favoritas.jsx';
import useTituloDaPagina from '../hooks/useTituloDaPagina.js';

// Página das paletas salvas (rota "/favoritas").
function PaginaFavoritas({ favoritas, paletaAtual, falhouAoGravar, aoTrocarPaleta, aoRemover }) {
  const navegar = useNavigate();
  useTituloDaPagina('Paletas favoritas | CombinaCor');

  // Usar uma favorita troca a paleta e leva para o gerador. A troca de página é feita
  // pelo código (useNavigate), porque acontece depois de um clique num botão, não num link.
  function aoUsar(favorita) {
    aoTrocarPaleta(favorita);
    navegar('/');
  }

  return (
    <main className="tool">
      <Favoritas
        favoritas={favoritas}
        paletaAtual={paletaAtual}
        falhouAoGravar={falhouAoGravar}
        aoUsar={aoUsar}
        aoRemover={aoRemover}
      />
    </main>
  );
}

export default PaginaFavoritas;
