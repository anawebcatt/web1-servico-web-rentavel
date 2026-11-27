import { useMemo, useState } from 'react';
import { Route, Routes } from 'react-router';
import useAvisoTemporario from './hooks/useAvisoTemporario.js';
import useConexao from './hooks/useConexao.js';
import useFavoritas from './hooks/useFavoritas.js';
import useNomesDasCores from './hooks/useNomesDasCores.js';
import { gerarPaleta } from './lib/cores.js';
import Layout from './paginas/Layout.jsx';
import PaginaComoUsar from './paginas/PaginaComoUsar.jsx';
import PaginaFavoritas from './paginas/PaginaFavoritas.jsx';
import PaginaGerador from './paginas/PaginaGerador.jsx';
import PaginaNaoEncontrada from './paginas/PaginaNaoEncontrada.jsx';
import PaginaPaletaDoLink from './paginas/PaginaPaletaDoLink.jsx';
import {
  adicionarFavorita,
  carregarPreferencias,
  mesmaPaleta,
  removerFavorita,
  salvarPreferencias,
} from './servicos/armazenamento.js';
import { copiarTexto, pegarCorDaTela, selecionarTexto } from './servicos/navegador.js';

const COR_INICIAL = '#0047AB';
const TIPO_INICIAL = 'complementar';
const TEMPO_AVISO_COPIA = 2500;

// Volta para a última cor e o último tipo usados, se houver algo salvo.
// É passada para o useState sem os parênteses, então só roda na primeira renderização.
function paletaInicial() {
  return carregarPreferencias() ?? { cor: COR_INICIAL, tipo: TIPO_INICIAL };
}

// Componente principal: guarda o estado que mais de uma página usa e diz qual página
// aparece em cada rota. Como o App fica acima das rotas, o estado dele continua
// existindo quando a pessoa troca de página.
function App() {
  // A paleta que está na tela: { cor, tipo }. A cor e o tipo mudam juntos, são salvos
  // juntos e têm o mesmo formato das favoritas, então ficam num estado só.
  const [paletaAtual, setPaletaAtual] = useState(paletaInicial);

  const [favoritas, gravarFavoritas] = useFavoritas();
  const [falhouAoGravar, setFalhouAoGravar] = useState(false);
  const [avisoCopia, setAvisoCopia] = useAvisoTemporario(TEMPO_AVISO_COPIA);
  const online = useConexao();

  // Valores calculados a partir do estado. Não são estado: guardar as cores ou o "salva"
  // em useState criaria duas cópias da mesma informação, que poderiam ficar diferentes.
  const cores = useMemo(() => gerarPaleta(paletaAtual.cor, paletaAtual.tipo), [paletaAtual]);
  const salva = favoritas.some((favorita) => mesmaPaleta(favorita, paletaAtual));

  const { nomes, aviso: avisoNomes, guardarNomes } = useNomesDasCores(cores, online);

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

  // elemento é onde o texto aparece na página: se não der para copiar, ele fica selecionado.
  // Quando o texto não está na página (o link da paleta), elemento é null e o aviso mostra o texto.
  async function aoCopiar(texto, descricao, elemento) {
    if (await copiarTexto(texto)) {
      setAvisoCopia({ texto: `${descricao} copiado.`, ehErro: false });
    } else if (elemento === null) {
      setAvisoCopia({ texto: `Não deu para copiar sozinho. ${descricao}: ${texto}`, ehErro: true });
    } else {
      selecionarTexto(elemento);
      setAvisoCopia({
        texto: 'Não deu para copiar sozinho. O texto ficou selecionado: use Ctrl+C.',
        ehErro: true,
      });
    }
  }

  // Cada Route liga um caminho do endereço a uma página. As rotas ficam dentro da rota
  // do Layout, que desenha o cabeçalho e o rodapé em volta de todas elas.
  return (
    <Routes>
      <Route element={<Layout quantasFavoritas={favoritas.length} avisoCopia={avisoCopia} />}>
        <Route
          index
          element={
            <PaginaGerador
              paletaAtual={paletaAtual}
              cores={cores}
              nomes={nomes}
              avisoNomes={online ? avisoNomes : null}
              salva={salva}
              online={online}
              falhouAoGravar={falhouAoGravar}
              aoTrocarPaleta={trocarPaleta}
              aoUsarContaGotas={aoUsarContaGotas}
              aoAlternarFavorita={aoAlternarFavorita}
              aoCopiar={aoCopiar}
              aoReceberNomes={guardarNomes}
            />
          }
        />
        <Route
          path="favoritas"
          element={
            <PaginaFavoritas
              favoritas={favoritas}
              paletaAtual={paletaAtual}
              falhouAoGravar={falhouAoGravar}
              aoTrocarPaleta={trocarPaleta}
              aoRemover={(favorita) => trocarFavoritas(removerFavorita(favoritas, favorita))}
            />
          }
        />
        <Route path="como-usar" element={<PaginaComoUsar />} />
        <Route path="paleta/:tipo/:hex" element={<PaginaPaletaDoLink aoAbrir={trocarPaleta} />} />
        {/* O asterisco pega qualquer endereço que não bateu com as rotas de cima. */}
        <Route path="*" element={<PaginaNaoEncontrada />} />
      </Route>
    </Routes>
  );
}

export default App;
