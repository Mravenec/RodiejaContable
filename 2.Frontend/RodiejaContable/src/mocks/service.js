// This file initializes the mock service worker
const initMocks = async () => {
  // Only run in development
  if (process.env.NODE_ENV !== 'development') {
    return;
  }

  // In the browser, the worker is already started in browser.js
  if (typeof window !== 'undefined') {
    console.log('MSW worker initialized in the browser');
    return;
  }

  // In Node.js (for testing), use the server
  try {
    const { server } = await import('./server');
    server.listen({ onUnhandledRequest: 'warn' });
    console.log('MSW server initialized for testing');
  } catch (error) {
    console.error('Error initializing MSW server:', error);
    throw error;
  }
};

// Auto-initialize when imported in development
if (process.env.NODE_ENV === 'development') {
  initMocks().catch(console.error);
}

export default initMocks;
