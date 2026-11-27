import { useMemo, useRef, useState } from 'react';
import Anuncio from './components/Anuncio.jsx';
import AvisoDeCopia from './components/AvisoDeCopia.jsx';
import Cabecalho from './components/Cabecalho.jsx';
import Favoritas from './components/Favoritas.jsx';
import Formulario from './components/Formulario.jsx';
import Ideias from './components/Ideias.jsx';
import Instrucoes from './components/Instrucoes.jsx';
import Paleta from './components/Paleta.jsx';
import Rodape from './components/Rodape.jsx';
import Mensagem from './components/comuns/Mensagem.jsx';
import useAvisoTemporario from './hooks/useAvisoTemporario.js';
import useConexao from './hooks/useConexao.js';
import useFavoritas from './hooks/useFavoritas.js';
import useNomesDasCores from './hooks/useNomesDasCores.js';
import useTituloDaPagina from './hooks/useTituloDaPagina.js';
import {
  adicionarFavorita,
  carregarPreferencias,
  mesmaPaleta,
  removerFavorita,
  salvarPreferencias,
} from './servicos/armazenamento.js';
import { HARMONIAS, gerarPaleta } from './lib/cores.js';
import { copiarTexto, pegarCorDaTela, selecionarTexto } from './servicos/navegador.js';

const COR_INICIAL = '#0047AB';
const TIPO_INICIAL = 'complementar';
const TEMPO_AVISO_COPIA = 2500;

// Volta para a última cor e o último tipo usados, se houver algo salvo.
// É passada para o useState sem os parênteses, então só roda na primeira renderização.
function paletaInicial() {
  return carregarPreferencias() ?? { cor: COR_INICIAL, tipo: TIPO_INICIAL };
}

// Componente principal: guarda o estado que mais de uma parte da página usa
// e passa os dados e as funções para os componentes.
// Os efeitos (useEffect) ficam nos hooks da pasta hooks/, um para cada assunto.
function App() {
  // A paleta que está na tela: { cor, tipo }. A cor e o tipo mudam juntos, são salvos
  // juntos e têm o mesmo formato das favoritas, então ficam num estado só.
  const [paletaAtual, setPaletaAtual] = useState(paletaInicial);

  const [favoritas, gravarFavoritas] = useFavoritas();
  const [falhouAoGravar, setFalhouAoGravar] = useState(false);
  const [avisoCopia, setAvisoCopia] = useAvisoTemporario(TEMPO_AVISO_COPIA);
  const online = useConexao();

  const tituloPaleta = useRef(null);

  // Valores calculados a partir do estado. Não são estado: guardar as cores ou o "salva"
  // em useState criaria duas cópias da mesma informação, que poderiam ficar diferentes.
  const cores = useMemo(() => gerarPaleta(paletaAtual.cor, paletaAtual.tipo), [paletaAtual]);
  const salva = favoritas.some((favorita) => mesmaPaleta(favorita, paletaAtual));

  const { nomes, aviso: avisoNomes, guardarNomes } = useNomesDasCores(cores, online);

  // O título da aba acompanha a paleta, por exemplo "Tríade de #0047AB | CombinaCor".
  useTituloDaPagina(`${HARMONIAS[paletaAtual.tipo].nome} de ${paletaAtual.cor} | CombinaCor`);

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
    if (!gravarFavoritas(novaLista)) {
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
        {!online && (
          <Mensagem>
            Você está sem internet. A paleta e as favoritas continuam funcionando; os nomes das cores e
            as ideias voltam quando a conexão voltar.
          </Mensagem>
        )}
        <Formulario paleta={paletaAtual} aoTrocar={trocarPaleta} aoUsarContaGotas={aoUsarContaGotas} />
        <Paleta
          paleta={cores}
          corBase={paletaAtual.cor}
          tipo={paletaAtual.tipo}
          nomes={nomes}
          avisoNomes={online ? avisoNomes : null}
          salva={salva}
          refTitulo={tituloPaleta}
          aoAlternarFavorita={aoAlternarFavorita}
          aoCopiar={aoCopiar}
        />
        <Ideias cor={paletaAtual.cor} aoEscolherCor={aoEscolherIdeia} aoReceberCores={guardarNomes} />
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
