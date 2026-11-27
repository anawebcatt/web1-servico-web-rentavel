import { useEffect, useState } from 'react';
import { CHAVE_FAVORITAS, carregarFavoritas, salvarFavoritas } from '../servicos/armazenamento.js';

// Lista de paletas favoritas, guardada no localStorage.
// Devolve a lista e uma função para trocá-la. A função devolve false se não deu para gravar.
function useFavoritas() {
  // Inicialização: ler o localStorage é rápido e não precisa esperar nada, então a lista
  // já nasce carregada. A função é passada sem parênteses e só roda na primeira renderização.
  // Se fosse carregada num efeito, a página piscaria: primeiro vazia, depois com as favoritas.
  const [favoritas, setFavoritas] = useState(carregarFavoritas);

  // Se as favoritas mudarem em outra aba do CombinaCor, esta aba se atualiza também.
  // O evento storage só dispara nas outras abas, não na que fez a mudança.
  // A lista de dependências vazia faz o efeito rodar só quando o componente entra na página;
  // a limpeza tira o ouvinte quando ele sai.
  useEffect(() => {
    function aoMudarArmazenamento(evento) {
      if (evento.key === CHAVE_FAVORITAS || evento.key === null) {
        setFavoritas(carregarFavoritas());
      }
    }
    window.addEventListener('storage', aoMudarArmazenamento);
    return () => window.removeEventListener('storage', aoMudarArmazenamento);
  }, []);

  function trocarFavoritas(novaLista) {
    setFavoritas(novaLista);
    return salvarFavoritas(novaLista);
  }

  return [favoritas, trocarFavoritas];
}

export default useFavoritas;
