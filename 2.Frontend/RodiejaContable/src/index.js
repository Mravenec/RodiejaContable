import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
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

// Mensajes de depuración
console.log('Aplicación iniciada correctamente');
console.log('Versión de React:', React.version);

// Configuración de React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
);
