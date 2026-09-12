import React from 'react';
import { createRoot } from 'react-dom/client';
import { GameProvider } from './src/state/GameContext';
import { App } from './src/App';
import './src/styles/global.css';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GameProvider>
      <App />
    </GameProvider>
  </React.StrictMode>
);
