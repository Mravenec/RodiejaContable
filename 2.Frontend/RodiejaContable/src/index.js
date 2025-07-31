import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { QueryProvider } from './providers/QueryProvider';
import App from './App';
import 'antd/dist/reset.css';
import './index.css';

// Optional: Initialize mocks if they exist
const initializeMocks = async () => {
  if (process.env.NODE_ENV === 'development') {
    try {
      const { worker } = await import('./mocks/browser');
      await worker.start();
      console.log('MSW initialized in browser');
    } catch (error) {
      console.warn('MSW not initialized. Proceeding without mock service worker.');
    }
  }
};

// Initialize the app
initializeMocks();

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
