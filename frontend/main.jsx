import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './src/App.jsx';
import { AuthProvider } from './src/contexts/AuthContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
