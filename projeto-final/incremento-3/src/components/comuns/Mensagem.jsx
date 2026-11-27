// Caixa de mensagem. tipo é 'aviso' (informação) ou 'erro'.
// Um erro usa role="alert", que os leitores de tela anunciam na hora;
// um aviso usa role="status", que espera a pessoa terminar o que está fazendo.
function Mensagem({ tipo = 'aviso', id, children }) {
  return (
    <p id={id} className={`mensagem ${tipo}`} role={tipo === 'erro' ? 'alert' : 'status'}>
      {children}
    </p>
  );
}

export default Mensagem;
