import Navegacao from './Navegacao.jsx';

function Cabecalho({ quantasFavoritas }) {
  return (
    <header className="site-header">
      <h1>CombinaCor</h1>
      <p>Escolha uma cor e veja cores que combinam com ela.</p>
      <Navegacao quantasFavoritas={quantasFavoritas} />
    </header>
  );
}

export default Cabecalho;
