import { useEffect, useRef, useState } from 'react';
import { MODOS_API, buscarPaleta, buscarPaletasDeTodosOsEstilos, explicarErro } from '../servicos/colorApi.js';

const CORES_POR_IDEIA = 5;

// Como a busca começa: nada foi pedido ainda.
const BUSCA_INICIAL = { fase: 'parada', texto: '', grupos: [] };

// Busca de ideias de paleta na The Color API.
// Devolve:
// - busca: { fase, texto, grupos }. fase é 'parada', 'buscando', 'pronta', 'cancelada' ou 'erro';
//   texto é a mensagem da fase; grupos é o último resultado, uma lista de { modo, cores };
// - buscar(cor, modo): faz a busca e devolve as cores que vieram (ou null se não vieram);
// - cancelar(): interrompe a busca em andamento.
function useIdeias() {
  const [busca, setBusca] = useState(BUSCA_INICIAL);

  // O AbortController da busca em andamento. Fica numa ref porque não aparece na tela:
  // trocá-lo não precisa redesenhar nada.
  const controle = useRef(null);

  // Se o componente sair da página no meio de uma busca, o pedido é cancelado.
  useEffect(() => {
    return () => controle.current?.abort();
  }, []);

  // modo é um dos estilos de MODOS_API ou 'todos'.
  async function buscar(cor, modo) {
    // Uma busca nova cancela a anterior, se ainda estiver em andamento.
    controle.current?.abort();
    const meuControle = new AbortController();
    controle.current = meuControle;
    const sinal = meuControle.signal;

    // Enquanto busca (e se der erro), as ideias anteriores continuam na tela.
    setBusca((anterior) => ({ ...anterior, fase: 'buscando', texto: `Buscando ideias para ${cor}…` }));
    try {
      let grupos;
      let texto;
      if (modo === 'todos') {
        const resultado = await buscarPaletasDeTodosOsEstilos(cor, CORES_POR_IDEIA, sinal);
        const falhas = resultado.falhas;
        const aviso = falhas > 0 ? ` ${falhas} não ${falhas === 1 ? 'veio' : 'vieram'} (falha na API).` : '';
        grupos = resultado.grupos;
        texto = `${grupos.length} estilos da The Color API para ${cor}.${aviso}`;
      } else {
        const cores = await buscarPaleta(cor, modo, CORES_POR_IDEIA, sinal);
        grupos = [{ modo: modo, cores: cores }];
        texto = `Paleta ${MODOS_API[modo].toLowerCase()} da The Color API para ${cor}:`;
      }
      setBusca({ fase: 'pronta', texto: texto, grupos: grupos });
      return grupos.flatMap((grupo) => grupo.cores);
    } catch (erro) {
      // Um pedido cancelado também cai aqui, mas não é um erro para mostrar.
      if (!sinal.aborted) {
        setBusca((anterior) => ({ ...anterior, fase: 'erro', texto: explicarErro(erro) }));
      }
      return null;
    }
  }

  function cancelar() {
    controle.current?.abort();
    setBusca((anterior) => ({ ...anterior, fase: 'cancelada', texto: 'Busca cancelada.' }));
  }

  return { busca, buscar, cancelar };
}

export default useIdeias;
