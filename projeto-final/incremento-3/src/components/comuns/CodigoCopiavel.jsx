// Um código de cor (HEX, RGB ou HSL) que é copiado ao clicar.
// aoCopiar recebe o texto e o elemento do botão: se a cópia falhar, o texto fica selecionado.
function CodigoCopiavel({ texto, destaque = false, aoCopiar }) {
  return (
    <button
      type="button"
      className={destaque ? 'codigo cor-hex' : 'codigo'}
      title="Clique para copiar"
      aria-label={`Copiar ${texto}`}
      onClick={(evento) => aoCopiar(texto, evento.currentTarget)}
    >
      <code>{texto}</code>
    </button>
  );
}

export default CodigoCopiavel;
