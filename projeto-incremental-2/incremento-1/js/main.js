function pedirCor() {
  while (true) {
    const resposta = prompt('Digite a cor base em HEX (ex.: #0047AB):', '#0047AB');
    if (resposta === null) {
      return null;
    }

    const hex = normalizarHex(resposta);
    if (hex !== null) {
      return hex;
    }
    alert(`"${resposta}" não é um HEX válido. Use 6 dígitos de 0 a 9 e de A a F, como #0047AB.`);
  }
}

function pedirHarmonia() {
  const tipos = Object.keys(HARMONIAS);
  let menu = 'Escolha o tipo de paleta:\n';
  for (let i = 0; i < tipos.length; i++) {
    menu += `\n${i + 1}. ${HARMONIAS[tipos[i]].nome}`;
  }

  while (true) {
    const resposta = prompt(menu, '1');
    if (resposta === null) {
      return null;
    }

    const numero = Number(resposta);
    if (Number.isInteger(numero) && numero >= 1 && numero <= tipos.length) {
      return tipos[numero - 1];
    }
    alert(`Digite um número de 1 a ${tipos.length}.`);
  }
}

function mostrarPaleta(paleta, tipo) {
  const nome = HARMONIAS[tipo].nome;

  console.log(`%cCombinaCor: paleta ${nome.toLowerCase()}`, 'font-weight: bold; font-size: 14px');
  for (const cor of paleta) {
    console.log(
      `%c   %c ${cor.hex}   ${formatarRgb(cor.rgb)}   ${formatarHsl(cor.hsl)}`,
      `background: ${cor.hex}; padding: 2px 16px`,
      ''
    );
  }
  console.log(gerarCss(paleta));

  const codigos = paleta.map((cor) => cor.hex).join('\n');
  alert(`Paleta ${nome.toLowerCase()}:\n\n${codigos}\n\nAbra o console (F12) para ver as cores e o CSS pronto.`);
}

function iniciar() {
  do {
    const hex = pedirCor();
    if (hex === null) {
      return;
    }
    const tipo = pedirHarmonia();
    if (tipo === null) {
      return;
    }

    if (tipo !== 'monocromatica' && ehCorNeutra(criarCor(hex))) {
      alert('Cinza, branco e preto não têm matiz, então só a paleta monocromática gera variações dessa cor.');
    }
    mostrarPaleta(gerarPaleta(hex, tipo), tipo);
  } while (confirm('Gerar outra paleta?'));
}

iniciar();
