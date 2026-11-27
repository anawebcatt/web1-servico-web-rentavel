import { Link, useLocation } from 'react-router';
import useTituloDaPagina from '../hooks/useTituloDaPagina.js';

// Aparece quando o endereço não bate com nenhuma rota (rota "*").
function PaginaNaoEncontrada() {
  const { pathname } = useLocation();
  useTituloDaPagina('Página não encontrada | CombinaCor');

  return (
    <main className="tool">
      <h2>Página não encontrada</h2>
      <p>
        Não existe nada em <code>{pathname}</code>.
      </p>
      <p className="ajuda-links">
        <Link to="/">Ir para o gerador</Link>
      </p>
    </main>
  );
}

export default PaginaNaoEncontrada;
