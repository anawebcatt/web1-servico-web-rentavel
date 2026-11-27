// Botão com o visual padrão do CombinaCor.
// - pequeno: versão menor, para ficar dentro de listas e ao lado de títulos;
// - children: o texto do botão (o que vai entre <Botao> e </Botao>);
// - o resto das propriedades (onClick, disabled, aria-label...) vai direto para o <button>.
function Botao({ pequeno = false, type = 'button', children, ...resto }) {
  return (
    <button type={type} className={pequeno ? 'botao botao-pequeno' : 'botao'} {...resto}>
      {children}
    </button>
  );
}

export default Botao;
