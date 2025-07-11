import { setupServer } from 'msw/node';
import { handlers } from './browser';

// This configures a request mocking server with the given request handlers.
export const server = setupServer(...handlers);

// Enable API mocking in development.
if (process.env.NODE_ENV === 'development') {
  server.listen({ onUnhandledRequest: 'warn' });
  console.log('MSW server running in development mode');
}

// Export the server for testing purposes
export default server;
