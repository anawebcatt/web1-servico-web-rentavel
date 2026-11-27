import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import App from './App.jsx';
import './style.css';

// Ponto de entrada: o React monta o componente App dentro da div #root do index.html.
// O BrowserRouter usa endereços normais (ex.: /favoritas). Para isso funcionar ao abrir
// ou recarregar qualquer rota, o servidor precisa entregar o index.html para todas elas,
// o que a Cloudflare Pages faz sozinha.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
