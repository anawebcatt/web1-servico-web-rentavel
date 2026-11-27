import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router';
import Anuncio from '../components/Anuncio.jsx';
import AvisoDeCopia from '../components/AvisoDeCopia.jsx';
import Cabecalho from '../components/Cabecalho.jsx';
import Rodape from '../components/Rodape.jsx';

// A moldura que aparece em todas as páginas: cabeçalho com o menu, anúncio e rodapé.
// O Outlet é o lugar onde entra a página da rota atual.
function Layout({ quantasFavoritas, avisoCopia }) {
  const { pathname } = useLocation();

  // Ao trocar de página, volta para o topo (o navegador faz isso sozinho quando
  // carrega uma página nova, mas aqui a página não é recarregada).
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <>
      <Cabecalho quantasFavoritas={quantasFavoritas} />
      <Outlet />
      <Anuncio />
      <AvisoDeCopia aviso={avisoCopia} />
      <Rodape />
    </>
  );
}

export default Layout;
