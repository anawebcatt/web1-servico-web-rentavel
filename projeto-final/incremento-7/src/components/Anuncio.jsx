// Espaço de anúncio 300x250 (retângulo médio). O código do anúncio entra no lugar
// da div .ad-box; veja "Monetização" no README do incremento 7 do Projeto Incremental 2.
function Anuncio() {
  return (
    <aside className="ad-slot" aria-label="Publicidade">
      <div className="ad-box">
        Publicidade
        <br />
        300 × 250
      </div>
    </aside>
  );
}

export default Anuncio;
