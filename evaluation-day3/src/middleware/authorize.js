// src/middlewares/authorize.js

/**
 * Middleware factory : vérifie que l'utilisateur a le bon rôle
 * @param {...string} roles - Rôles autorisés
 */
function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Non authentifié' });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        error: `Accès refusé — rôle requis : ${roles.join(' ou ')}`,
      });
    }
    next();
  };
}

export default authorize;