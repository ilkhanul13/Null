import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './index.css';

// Suppress Framer Motion scroll container warning
const originalWarn = console.warn;
console.warn = function filterWarnings(...args) {
  const message = args[0];
  if (
    typeof message === 'string' && 
    message.includes('non-static position')
  ) {
    return;
  }
  originalWarn.apply(console, args);
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);