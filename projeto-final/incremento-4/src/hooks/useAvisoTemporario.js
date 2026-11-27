import { useEffect, useState } from 'react';

// Um aviso que some sozinho depois de duracao milissegundos.
// Devolve o aviso atual (ou null) e a função que mostra um aviso novo.
function useAvisoTemporario(duracao) {
  const [aviso, setAviso] = useState(null);

  // Cada aviso novo é um objeto novo, então o efeito roda de novo: a limpeza cancela
  // o temporizador do aviso anterior e a contagem recomeça.
  useEffect(() => {
    if (aviso === null) {
      return undefined;
    }
    const temporizador = setTimeout(() => setAviso(null), duracao);
    return () => clearTimeout(temporizador);
  }, [aviso, duracao]);

  return [aviso, setAviso];
}

export default useAvisoTemporario;
