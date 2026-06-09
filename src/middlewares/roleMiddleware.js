module.exports = (requiredRole) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(500).json({ error: 'Error interno: El usuario no está autenticado' });
    }

    if (req.user.role !== requiredRole) {
      return res.status(403).json({ error: `Acceso restringido: Se requiere rol de ${requiredRole}` });
    }

    next();
  };
};
