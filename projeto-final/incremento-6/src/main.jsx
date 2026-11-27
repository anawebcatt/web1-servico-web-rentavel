import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router';
import App from './App.jsx';
import './style.css';

// Ponto de entrada: o React monta o componente App dentro da div #root do index.html.
// O HashRouter guarda a rota depois do # do endereço (ex.: .../#/favoritas). Assim o servidor
// sempre entrega o mesmo index.html, o que funciona no GitHub Pages sem configuração.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </StrictMode>
);
