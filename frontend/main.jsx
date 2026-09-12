import React from 'react';
import { createRoot } from 'react-dom/client';
import '../backend/src/config/firebase.js';
import SystemWindow from './SystemWindow.jsx';

createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <SystemWindow />
    </React.StrictMode>,
);
