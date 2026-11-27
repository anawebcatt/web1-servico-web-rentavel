// Um retângulo pintado com uma cor. className decide o tamanho:
// a mesma amostra aparece grande na paleta, média nas ideias e em miniatura nas favoritas.
function Amostra({ hex, className }) {
  return <span className={className} style={{ backgroundColor: hex }} />;
}

export default Amostra;
