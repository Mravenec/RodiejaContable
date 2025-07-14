import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { QueryProvider } from './providers/QueryProvider';
import App from './App';
import 'antd/dist/reset.css';
import './index.css';

// Importar el servicio de mocks solo en desarrollo
if (process.env.NODE_ENV === 'development') {
  // Importar dinámicamente para asegurar que el código solo se ejecuta en el cliente
  import('./mocks/browser')
    .then(() => console.log('MSW initialized in browser'))
    .catch(err => console.error('Failed to initialize MSW in browser', err));
}

// Mensajes de depuración solo en desarrollo
if (process.env.NODE_ENV === 'development') {
  console.log('Aplicación iniciada correctamente');
  console.log('Versión de React:', React.version);
  
  // Deshabilitar logs en producción
  if (window.console && window.console.log) {
    console.log = function() {};
    console.warn = function() {};
    console.error = function() {};
    console.info = function() {};
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <QueryProvider>
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </QueryProvider>
  </React.StrictMode>
);
