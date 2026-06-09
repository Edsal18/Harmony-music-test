const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'harmony_super_secret_jwt_key_123';

module.exports = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).json({ error: 'Acceso denegado: Token no provisto' });
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ error: 'Acceso denegado: Formato de token inválido' });
  }

  const token = parts[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Decoded payload contains { id, email, role }
    next();
  } catch (error) {
    console.error('Error al validar token JWT:', error);
    return res.status(403).json({ error: 'Token inválido o expirado' });
  }
};
