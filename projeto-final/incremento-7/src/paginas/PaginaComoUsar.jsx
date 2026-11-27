import { Link } from 'react-router';
import Instrucoes from '../components/Instrucoes.jsx';
import useTituloDaPagina from '../hooks/useTituloDaPagina.js';

// Página de ajuda (rota "/como-usar").
function PaginaComoUsar() {
  useTituloDaPagina('Como usar | CombinaCor');

  return (
    <main className="instructions">
      <Instrucoes />
      <p>
        <Link to="/">Voltar para o gerador</Link>
      </p>
    </main>
  );
}

export default PaginaComoUsar;
