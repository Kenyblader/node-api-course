// src/middlewares/errorHandler.js
function errorHandler(err, req, res, next) {
  const status = err.status || err.statusCode || 500;

  // En développement : afficher tous les détails
  if (process.env.NODE_ENV === 'development') {
    return res.status(status).json({
      error: err.message,
      stack: err.stack,
    });
  }

  // En production : message générique pour les erreurs 5xx
  if (status >= 500) {
    console.error('[ERROR]', err); // Logger côté serveur uniquement
    return res.status(500).json({ error: 'Une erreur interne est survenue.' });
  }

  // Les erreurs 4xx (validation, auth...) peuvent être renvoyées telles quelles
  res.status(status).json({ error: err.message });
}

// Route non trouvée
function notFound(req, res) {
  res.status(404).json({ error: `Route introuvable : ${req.method} ${req.path}` });
}

export  { errorHandler, notFound };