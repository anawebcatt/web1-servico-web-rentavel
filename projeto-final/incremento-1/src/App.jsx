import { useEffect, useMemo, useRef, useState } from 'react';
import Anuncio from './components/Anuncio.jsx';
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
import { gerarPaleta, normalizarHex } from './lib/cores.js';
import { copiarTexto, pegarCorDaTela, selecionarTexto } from './lib/recursos.js';

const COR_INICIAL = '#0047AB';
const TIPO_INICIAL = 'complementar';
const TEMPO_AVISO_COPIA = 2500;

// Espera a pessoa parar de mexer na cor antes de pedir os nomes, para não fazer
// um pedido a cada movimento do seletor.
const ESPERA_ANTES_DOS_NOMES = 400;

// Volta para a última cor e o último tipo usados, se houver algo salvo.
function paletaInicial() {
  return carregarPreferencias() ?? { cor: COR_INICIAL, tipo: TIPO_INICIAL };
}

// Componente principal: guarda o estado da ferramenta e passa os dados
// e as funções para os componentes de cada parte da página.
function App() {
  // Última cor válida escolhida. A paleta continua nela enquanto o campo de HEX estiver inválido.
  const [corAtual, setCorAtual] = useState(() => paletaInicial().cor);
  const [tipo, setTipo] = useState(() => paletaInicial().tipo);
  const [textoHex, setTextoHex] = useState(corAtual);
  const [hexInvalido, setHexInvalido] = useState(null);

  const [favoritas, setFavoritas] = useState(carregarFavoritas);
  const [falhouAoGravar, setFalhouAoGravar] = useState(false);

  // Nomes que já vieram da API: { '#0047AB': { hex, nome, exato } }. null se a busca falhou.
  const [nomes, setNomes] = useState({});
  const [avisoNomes, setAvisoNomes] = useState(null);
  const [avisoCopia, setAvisoCopia] = useState(null);

  const tituloPaleta = useRef(null);

  const paleta = useMemo(() => gerarPaleta(corAtual, tipo), [corAtual, tipo]);
  const paletaAtual = { cor: corAtual, tipo: tipo };
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
      const erros = await Promise.all(paleta.map((cor) => buscarNome(cor.hex)));
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
  }, [paleta]);

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

  // Troca a paleta que está na tela e guarda a cor e o tipo para a próxima visita.
  // Se o navegador recusar a gravação, avisa e o site continua funcionando sem salvar.
  function trocarPaleta(cor, novoTipo) {
    setCorAtual(cor);
    setTipo(novoTipo);
    if (!salvarPreferencias(cor, novoTipo)) {
      setFalhouAoGravar(true);
    }
  }

  // Troca a cor base e coloca o mesmo código no campo de HEX.
  function usarCor(hex, novoTipo = tipo) {
    trocarPaleta(hex, novoTipo);
    setTextoHex(hex);
    setHexInvalido(null);
  }

  // Campo de HEX, a cada tecla: atualiza assim que o texto vira um HEX válido.
  // Enquanto a pessoa ainda está digitando, não mostra erro.
  function aoDigitarHex(texto) {
    setTextoHex(texto);
    const hex = normalizarHex(texto);
    if (hex !== null) {
      trocarPaleta(hex, tipo);
      setHexInvalido(null);
    }
  }

  // Campo de HEX, ao sair do campo ou apertar Enter: avisa se ficou inválido,
  // ou arruma o texto (ex.: "04a" vira "#0044AA").
  function aoConfirmarHex() {
    if (normalizarHex(textoHex) === null) {
      setHexInvalido(textoHex);
    } else {
      setTextoHex(corAtual);
    }
  }

  async function aoUsarContaGotas() {
    try {
      const hex = await pegarCorDaTela();
      if (hex !== null) {
        usarCor(hex);
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
    usarCor(favorita.cor, favorita.tipo);
    irParaAPaleta();
  }

  function aoEscolherIdeia(hex) {
    usarCor(hex);
    irParaAPaleta();
  }

  // As ideias já vêm da API com os nomes, então a paleta não precisa buscá-los de novo.
  function aoReceberIdeias(cores) {
    setNomes((anteriores) => {
      const novos = { ...anteriores };
      for (const cor of cores) {
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
        <Formulario
          cor={corAtual}
          textoHex={textoHex}
          hexInvalido={hexInvalido}
          tipo={tipo}
          aoEscolherCor={(hex) => usarCor(hex)}
          aoDigitarHex={aoDigitarHex}
          aoConfirmarHex={aoConfirmarHex}
          aoTrocarTipo={(novoTipo) => trocarPaleta(corAtual, novoTipo)}
          aoUsarContaGotas={aoUsarContaGotas}
        />
        <Paleta
          paleta={paleta}
          corBase={corAtual}
          tipo={tipo}
          nomes={nomes}
          avisoNomes={avisoNomes}
          salva={salva}
          refTitulo={tituloPaleta}
          aoAlternarFavorita={aoAlternarFavorita}
          aoCopiar={aoCopiar}
        />
        <Ideias cor={corAtual} aoEscolherCor={aoEscolherIdeia} aoReceberCores={aoReceberIdeias} />
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

      {avisoCopia !== null && (
        <p className={avisoCopia.ehErro ? 'aviso-copia aviso-copia-erro' : 'aviso-copia'} role="status">
          {avisoCopia.texto}
        </p>
      )}

      <Rodape />
    </>
  );
}

export default App;
