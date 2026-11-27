// Aviso que aparece no canto da tela depois de copiar (ou de não conseguir copiar).
// aviso é { texto, ehErro } ou null quando não há nada para mostrar.
function AvisoDeCopia({ aviso }) {
  if (aviso === null) {
    return null;
  }

  return (
    <p className={aviso.ehErro ? 'aviso-copia aviso-copia-erro' : 'aviso-copia'} role="status">
      {aviso.texto}
    </p>
  );
}

export default AvisoDeCopia;
