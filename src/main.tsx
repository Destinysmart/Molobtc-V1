import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    if (
      event.reason && 
      (event.reason.message?.includes('WebSocket') || 
       event.reason.message?.includes('websocket') || 
       event.reason.message?.includes('failed to connect') ||
       String(event.reason).includes('WebSocket') ||
       String(event.reason).includes('websocket'))
    ) {
      event.preventDefault();
    }
  });

  window.addEventListener('error', (event) => {
    if (
      event.message && 
      (event.message.includes('WebSocket') || 
       event.message.includes('websocket') || 
       event.message.includes('failed to connect'))
    ) {
      event.preventDefault();
    }
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
