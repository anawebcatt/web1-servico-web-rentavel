import { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import useTituloDaPagina from '../hooks/useTituloDaPagina.js';
import { HARMONIAS, normalizarHex } from '../lib/cores.js';

// Rota "/paleta/:tipo/:hex", por exemplo "/paleta/triade/0047AB".
// É o endereço que o botão "Copiar link" gera: quem abre vê a mesma paleta.
// A página não mostra a paleta: ela confere o endereço, passa a paleta para o App
// e leva para o gerador.
function PaginaPaletaDoLink({ aoAbrir }) {
  // Os pedaços do endereço marcados com ":" na rota.
  const { tipo, hex } = useParams();
  const navegar = useNavigate();

  // O endereço pode ter sido digitado ou alterado à mão, então é conferido.
  const cor = normalizarHex(hex);
  const valido = cor !== null && Object.hasOwn(HARMONIAS, tipo);

  useTituloDaPagina(valido ? 'Abrindo a paleta… | CombinaCor' : 'Link inválido | CombinaCor');

  useEffect(() => {
    if (valido) {
      aoAbrir({ cor: cor, tipo: tipo });
      // replace: este endereço não fica no histórico, então o "voltar" não cai aqui de novo.
      navegar('/', { replace: true });
    }
    // aoAbrir e navegar ficam de fora das dependências de propósito: o efeito só precisa
    // rodar de novo se o endereço mudar. A linha abaixo avisa o lint que isso é intencional.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [valido, cor, tipo]);

  if (valido) {
    return <main className="tool">Abrindo a paleta…</main>;
  }

  return (
    <main className="tool">
      <h2>Este link de paleta não é válido</h2>
      <p>
        O endereço deveria terminar com um tipo de paleta e uma cor, como{' '}
        <code>/paleta/triade/0047AB</code>.
      </p>
      <p className="ajuda-links">
        <Link to="/">Ir para o gerador</Link>
      </p>
    </main>
  );
}

export default PaginaPaletaDoLink;
