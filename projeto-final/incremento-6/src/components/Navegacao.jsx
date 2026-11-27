import { NavLink } from 'react-router';

// Menu do site. O NavLink troca de página sem recarregar e marca o link da página atual
// com aria-current="page", que o CSS usa para destacar.
function Navegacao({ quantasFavoritas }) {
  return (
    <nav className="navegacao" aria-label="Páginas">
      {/* end: o link "/" só fica marcado na página inicial, não em todas as que começam com "/". */}
      <NavLink to="/" end>
        Gerador
      </NavLink>
      <NavLink to="/favoritas">Favoritas ({quantasFavoritas})</NavLink>
      <NavLink to="/como-usar">Como usar</NavLink>
    </nav>
  );
}

export default Navegacao;
