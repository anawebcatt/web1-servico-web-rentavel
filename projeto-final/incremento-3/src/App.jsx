import { useEffect, useMemo, useRef, useState } from 'react';
import Anuncio from './components/Anuncio.jsx';
import AvisoDeCopia from './components/AvisoDeCopia.jsx';
import Cabecalho from './components/Cabecalho.jsx';
import Favoritas from './components/Favoritas.jsx';
import Formulario from './components/Formulario.jsx';
import Ideias from './components/Ideias.jsx';
import Instrucoes from './components/Instrucoes.jsx';
import Paleta from './components/Paleta.jsx';
import Rodape from './components/Rodape.jsx';
import { buscarNomeDaCor, explicarErroDaApi } from './lib/api.js';
import {
  CHAVE_FAVORITAS,
  adicionarFavorita,
  carregarFavoritas,
  carregarPreferencias,
  mesmaPaleta,
  removerFavorita,
  salvarFavoritas,
  salvarPreferencias,
} from './lib/armazenamento.js';
import { gerarPaleta } from './lib/cores.js';
import { copiarTexto, pegarCorDaTela, selecionarTexto } from './lib/recursos.js';

const COR_INICIAL = '#0047AB';
const TIPO_INICIAL = 'complementar';
const TEMPO_AVISO_COPIA = 2500;

// Espera a pessoa parar de mexer na cor antes de pedir os nomes, para não fazer
// um pedido a cada movimento do seletor.
const ESPERA_ANTES_DOS_NOMES = 400;

// Volta para a última cor e o último tipo usados, se houver algo salvo.
// É passada para o useState sem os parênteses, então só roda na primeira renderização.
function paletaInicial() {
  return carregarPreferencias() ?? { cor: COR_INICIAL, tipo: TIPO_INICIAL };
}

// Componente principal: guarda o estado que mais de uma parte da página usa
// e passa os dados e as funções para os componentes.
function App() {
  // A paleta que está na tela: { cor, tipo }. A cor e o tipo mudam juntos, são salvos
  // juntos e têm o mesmo formato das favoritas, então ficam num estado só.
  const [paletaAtual, setPaletaAtual] = useState(paletaInicial);

  const [favoritas, setFavoritas] = useState(carregarFavoritas);
  const [falhouAoGravar, setFalhouAoGravar] = useState(false);

  // Nomes que já vieram da API: { '#0047AB': { hex, nome, exato } }. null se a busca falhou.
  const [nomes, setNomes] = useState({});
  const [avisoNomes, setAvisoNomes] = useState(null);
  const [avisoCopia, setAvisoCopia] = useState(null);

  const tituloPaleta = useRef(null);

  // Valores calculados a partir do estado. Não são estado: guardar as cores ou o "salva"
  // em useState criaria duas cópias da mesma informação, que poderiam ficar diferentes.
  const cores = useMemo(() => gerarPaleta(paletaAtual.cor, paletaAtual.tipo), [paletaAtual]);
  const salva = favoritas.some((favorita) => mesmaPaleta(favorita, paletaAtual));

  // Busca os nomes das cores quando a paleta muda. Todos os pedidos saem ao mesmo tempo
  // e cada nome aparece assim que chega. A função devolvida cancela a espera e os pedidos
  // da paleta anterior, que não serve mais.
  useEffect(() => {
    const controle = new AbortController();
    const sinal = controle.signal;

    // Nunca rejeita: devolve null se deu certo ou o erro se falhou,
    // para um erro não derrubar o Promise.all.
    async function buscarNome(hex) {
      try {
        const cor = await buscarNomeDaCor(hex, sinal);
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

    async function buscarNomes() {
      const erros = await Promise.all(cores.map((cor) => buscarNome(cor.hex)));
      if (sinal.aborted) {
        return;
      }
      const primeiroErro = erros.find((erro) => erro !== null);
      setAvisoNomes(
        primeiroErro === undefined
          ? null
          : `${explicarErroDaApi(primeiroErro)} A paleta continua funcionando, só sem os nomes.`
      );
    }

    const temporizador = setTimeout(buscarNomes, ESPERA_ANTES_DOS_NOMES);
    return () => {
      clearTimeout(temporizador);
      controle.abort();
    };
  }, [cores]);

  // Se as favoritas mudarem em outra aba do CombinaCor, esta aba se atualiza também.
  // O evento storage só dispara nas outras abas, não na que fez a mudança.
  useEffect(() => {
    function aoMudarArmazenamento(evento) {
      if (evento.key === CHAVE_FAVORITAS || evento.key === null) {
        setFavoritas(carregarFavoritas());
      }
    }
    window.addEventListener('storage', aoMudarArmazenamento);
    return () => window.removeEventListener('storage', aoMudarArmazenamento);
  }, []);

  // O aviso de cópia some sozinho depois de um tempo.
  useEffect(() => {
    if (avisoCopia === null) {
      return undefined;
    }
    const temporizador = setTimeout(() => setAvisoCopia(null), TEMPO_AVISO_COPIA);
    return () => clearTimeout(temporizador);
  }, [avisoCopia]);

  // Troca a cor, o tipo ou os dois, e guarda a escolha para a próxima visita.
  // mudancas é { cor }, { tipo } ou { cor, tipo }: o que não vier continua como estava.
  // O estado não é alterado: um objeto novo substitui o anterior.
  // Se o navegador recusar a gravação, avisa e o site continua funcionando sem salvar.
  function trocarPaleta(mudancas) {
    const nova = { ...paletaAtual, ...mudancas };
    setPaletaAtual(nova);
    if (!salvarPreferencias(nova.cor, nova.tipo)) {
      setFalhouAoGravar(true);
    }
  }

  async function aoUsarContaGotas() {
    try {
      const hex = await pegarCorDaTela();
      if (hex !== null) {
        trocarPaleta({ cor: hex });
      }
    } catch {
      setAvisoCopia({ texto: 'Não deu para usar o conta-gotas neste navegador.', ehErro: true });
    }
  }

  function trocarFavoritas(novaLista) {
    setFavoritas(novaLista);
    if (!salvarFavoritas(novaLista)) {
      setFalhouAoGravar(true);
    }
  }

  // Salva a paleta atual, ou tira das favoritas se ela já estiver lá.
  function aoAlternarFavorita() {
    if (salva) {
      trocarFavoritas(removerFavorita(favoritas, paletaAtual));
    } else {
      trocarFavoritas(adicionarFavorita(favoritas, paletaAtual));
    }
  }

  function irParaAPaleta() {
    tituloPaleta.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function aoUsarFavorita(favorita) {
    trocarPaleta(favorita);
    irParaAPaleta();
  }

  function aoEscolherIdeia(hex) {
    trocarPaleta({ cor: hex });
    irParaAPaleta();
  }

  // As ideias já vêm da API com os nomes, então a paleta não precisa buscá-los de novo.
  // A função passada ao setNomes recebe o estado mais recente e devolve um objeto novo.
  function aoReceberIdeias(ideias) {
    setNomes((anteriores) => {
      const novos = { ...anteriores };
      for (const cor of ideias) {
        novos[cor.hex] = cor;
      }
      return novos;
    });
  }

  // elemento é onde o texto aparece na página: se não der para copiar, ele fica selecionado.
  async function aoCopiar(texto, descricao, elemento) {
    if (await copiarTexto(texto)) {
      setAvisoCopia({ texto: `${descricao} copiado.`, ehErro: false });
    } else {
      selecionarTexto(elemento);
      setAvisoCopia({
        texto: 'Não deu para copiar sozinho. O texto ficou selecionado: use Ctrl+C.',
        ehErro: true,
      });
    }
  }

  return (
    <>
      <Cabecalho />

      <main className="tool">
        <Formulario paleta={paletaAtual} aoTrocar={trocarPaleta} aoUsarContaGotas={aoUsarContaGotas} />
        <Paleta
          paleta={cores}
          corBase={paletaAtual.cor}
          tipo={paletaAtual.tipo}
          nomes={nomes}
          avisoNomes={avisoNomes}
          salva={salva}
          refTitulo={tituloPaleta}
          aoAlternarFavorita={aoAlternarFavorita}
          aoCopiar={aoCopiar}
        />
        <Ideias cor={paletaAtual.cor} aoEscolherCor={aoEscolherIdeia} aoReceberCores={aoReceberIdeias} />
        <Favoritas
          favoritas={favoritas}
          paletaAtual={paletaAtual}
          falhouAoGravar={falhouAoGravar}
          aoUsar={aoUsarFavorita}
          aoRemover={(favorita) => trocarFavoritas(removerFavorita(favoritas, favorita))}
        />
      </main>

      <Anuncio />
      <Instrucoes />

      <AvisoDeCopia aviso={avisoCopia} />

      <Rodape />
    </>
  );
}

export default App;
