import { useEffect, useState } from 'react';
import { buscarNomeDaCor, explicarErroDaApi } from '../lib/api.js';

// Espera a pessoa parar de mexer na cor antes de pedir os nomes, para não fazer
// um pedido a cada movimento do seletor.
const ESPERA_ANTES_DOS_NOMES = 400;

// Busca na The Color API os nomes das cores da paleta.
// Devolve:
// - nomes: { '#0047AB': { hex, nome, exato } }, com null nas cores em que a busca falhou;
// - aviso: texto para mostrar se alguma busca falhou, ou null;
// - guardarNomes: junta nomes que vieram por outro caminho (as ideias já vêm com nome).
function useNomesDasCores(cores, online) {
  const [nomes, setNomes] = useState({});
  const [aviso, setAviso] = useState(null);

  // Roda depois que a página é desenhada, na primeira vez e sempre que cores ou online mudam:
  // - cores muda quando a pessoa troca a cor ou o tipo;
  // - online muda quando a internet cai ou volta, e aí as buscas que falharam são refeitas.
  useEffect(() => {
    const controle = new AbortController();
    const sinal = controle.signal;

    // Nunca rejeita: devolve null se deu certo ou o erro se falhou,
    // para um erro não derrubar o Promise.all.
    async function buscarNome(hex) {
      try {
        const cor = await buscarNomeDaCor(hex, sinal);
        // A resposta pode chegar depois que a paleta já mudou. Aí ela é ignorada.
        if (!sinal.aborted) {
          setNomes((anteriores) => ({ ...anteriores, [hex]: cor }));
        }
        return null;
      } catch (erro) {
        if (!sinal.aborted) {
          setNomes((anteriores) => ({ ...anteriores, [hex]: null }));
        }
        return erro;
      }
    }

    // Todos os pedidos saem ao mesmo tempo e cada nome aparece assim que chega.
    async function buscarNomes() {
      const erros = await Promise.all(cores.map((cor) => buscarNome(cor.hex)));
      if (sinal.aborted) {
        return;
      }
      const primeiroErro = erros.find((erro) => erro !== null);
      setAviso(
        primeiroErro === undefined
          ? null
          : `${explicarErroDaApi(primeiroErro)} A paleta continua funcionando, só sem os nomes.`
      );
    }

    const temporizador = setTimeout(buscarNomes, ESPERA_ANTES_DOS_NOMES);

    // Limpeza: roda antes da próxima execução do efeito e quando o componente sai da página.
    // Cancela a espera e os pedidos da paleta anterior, que não serve mais.
    return () => {
      clearTimeout(temporizador);
      controle.abort();
    };
  }, [cores, online]);

  function guardarNomes(lista) {
    setNomes((anteriores) => {
      const novos = { ...anteriores };
      for (const cor of lista) {
        novos[cor.hex] = cor;
      }
      return novos;
    });
  }

  return { nomes, aviso, guardarNomes };
}

export default useNomesDasCores;
