import { useEffect, useState } from 'react';

// Diz se o navegador está conectado à internet. O valor muda sozinho quando a conexão cai ou volta.
function useConexao() {
  const [online, setOnline] = useState(() => navigator.onLine);

  // Liga os ouvintes quando o componente entra na página e desliga quando ele sai.
  useEffect(() => {
    function aoMudar() {
      setOnline(navigator.onLine);
    }
    window.addEventListener('online', aoMudar);
    window.addEventListener('offline', aoMudar);
    return () => {
      window.removeEventListener('online', aoMudar);
      window.removeEventListener('offline', aoMudar);
    };
  }, []);

  return online;
}

export default useConexao;
