// src/middlewares/authenticate.js
import { verifyToken } from '../utils/jwt.js';

/**
 * Middleware : vérifie le JWT dans le header Authorization
 * Injecte req.user = { userId, email, role }
 */
function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token manquant ou format invalide' });
  }

  const token = authHeader.slice(7); // Supprimer "Bearer "

  try {
    const decoded = verifyToken(token);
    req.user = decoded; // { userId, email, role, iat, exp }
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expiré' });
    }
    return res.status(401).json({ error: 'Token invalide' });
  }
}

export default authenticate;