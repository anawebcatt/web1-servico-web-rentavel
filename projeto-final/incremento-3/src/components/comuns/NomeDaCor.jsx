// Nome de uma cor vindo da The Color API.
// cor é { nome, exato }, undefined enquanto a busca não termina ou null se ela falhou.
function NomeDaCor({ cor, className }) {
  if (cor === undefined || cor === null) {
    return (
      <span className={`${className} cor-nome-pendente`}>
        {cor === undefined ? 'Buscando nome…' : 'Nome indisponível'}
      </span>
    );
  }

  return (
    <span className={className} title={cor.exato ? 'Nome da cor' : 'Nome da cor mais parecida'}>
      {cor.exato ? cor.nome : `≈ ${cor.nome}`}
    </span>
  );
}

export default NomeDaCor;
