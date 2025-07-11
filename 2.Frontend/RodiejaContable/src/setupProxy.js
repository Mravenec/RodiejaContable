const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  const proxyOptions = {
    target: 'http://localhost:8080',
    changeOrigin: true,
    pathRewrite: {
      '^/api': '', // Elimina el prefijo /api al hacer la petición
    },
    onProxyReq: (proxyReq, req, res) => {
      console.log(`[PROXY] Redirigiendo: ${req.method} ${req.originalUrl} -> ${proxyReq.method} ${proxyReq.path}`);
    },
    onError: (err, req, res) => {
      console.error('[PROXY] Error:', err);
      res.status(500).json({ message: 'Error en el proxy' });
    },
    onProxyRes: (proxyRes, req, res) => {
      console.log(`[PROXY] Respuesta recibida: ${proxyRes.statusCode} ${req.originalUrl}`);
    }
  };

  app.use('/api', createProxyMiddleware(proxyOptions));
  console.log('Proxy configurado para redirigir /api a http://localhost:8080');
};
