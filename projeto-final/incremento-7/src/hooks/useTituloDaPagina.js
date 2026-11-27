import { useEffect } from 'react';

// Mantém o título da aba do navegador igual ao texto recebido.
// O título fica fora do que o React desenha (está no <head>), por isso precisa de um efeito.
function useTituloDaPagina(titulo) {
  useEffect(() => {
    const tituloOriginal = document.title;
    document.title = titulo;
    // Devolve o título que estava antes, para o efeito não deixar rastro.
    return () => {
      document.title = tituloOriginal;
    };
  }, [titulo]);
}

export default useTituloDaPagina;
