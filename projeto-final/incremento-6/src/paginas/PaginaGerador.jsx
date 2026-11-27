import { useRef } from 'react';
import { Link, useHref } from 'react-router';
import Formulario from '../components/Formulario.jsx';
import Ideias from '../components/Ideias.jsx';
import Paleta from '../components/Paleta.jsx';
import Mensagem from '../components/comuns/Mensagem.jsx';
import useTituloDaPagina from '../hooks/useTituloDaPagina.js';
import { HARMONIAS } from '../lib/cores.js';

// Página inicial (rota "/"): a ferramenta que gera a paleta.
// O estado vem do App por propriedades, porque as outras páginas também usam.
function PaginaGerador({
  paletaAtual,
  cores,
  nomes,
  avisoNomes,
  salva,
  online,
  falhouAoGravar,
  aoTrocarPaleta,
  aoUsarContaGotas,
  aoAlternarFavorita,
  aoCopiar,
  aoReceberNomes,
}) {
  const tituloPaleta = useRef(null);

  // O título da aba acompanha a paleta, por exemplo "Tríade de #0047AB | CombinaCor".
  useTituloDaPagina(`${HARMONIAS[paletaAtual.tipo].nome} de ${paletaAtual.cor} | CombinaCor`);

  // Endereço que abre esta paleta em qualquer navegador (veja PaginaPaletaDoLink).
  // useHref devolve o caminho já no formato do roteador ("#/paleta/triade/0047AB").
  const caminho = useHref(`/paleta/${paletaAtual.tipo}/${paletaAtual.cor.slice(1)}`);
  const link = new URL(caminho, window.location.href).href;

  function aoEscolherIdeia(hex) {
    aoTrocarPaleta({ cor: hex });
    tituloPaleta.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return (
    <main className="tool">
      {!online && (
        <Mensagem>
          Você está sem internet. A paleta e as favoritas continuam funcionando; os nomes das cores e as
          ideias voltam quando a conexão voltar.
        </Mensagem>
      )}
      {falhouAoGravar && (
        <Mensagem tipo="erro">
          Este navegador não deixou salvar. No modo anônimo, ou com o armazenamento de sites bloqueado, as
          favoritas e a última cor somem ao fechar a página.
        </Mensagem>
      )}

      <Formulario paleta={paletaAtual} aoTrocar={aoTrocarPaleta} aoUsarContaGotas={aoUsarContaGotas} />
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
        aoCopiarLink={() => aoCopiar(link, 'Link da paleta', null)}
      />
      <Ideias cor={paletaAtual.cor} aoEscolherCor={aoEscolherIdeia} aoReceberCores={aoReceberNomes} />

      <p className="ajuda">
        Primeira vez aqui? Veja <Link to="/como-usar">como usar e o que é cada tipo de paleta</Link>. As
        paletas que você salvar ficam em <Link to="/favoritas">Favoritas</Link>.
      </p>
    </main>
  );
}

export default PaginaGerador;
