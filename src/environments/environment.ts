export const environment = {
  production: false,
  // Le proxy Angular (proxy.conf.json) redirige /api → https://gestionvoyage.onrender.com
  // Cela évite le CORS en développement. En prod, apiUrl pointe directement sur le backend.
  apiUrl: '/api',
};
