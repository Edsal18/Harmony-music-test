const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// ─────────────────────────────────────────────────────────────────────────────
// En producción (Vercel), el sistema de archivos es de solo lectura excepto /tmp.
// SQLite necesita permisos de escritura incluso para leer (archivos de journal).
// Copiamos la base de datos pre-construida a /tmp para habilitar operaciones R/W.
// ─────────────────────────────────────────────────────────────────────────────
if (process.env.NODE_ENV === 'production') {
  const sourcePath = path.join(__dirname, '../prisma/dev.db');
  const tmpPath = '/tmp/dev.db';
  try {
    fs.copyFileSync(sourcePath, tmpPath);
    console.log('Base de datos copiada a /tmp/dev.db correctamente.');
  } catch (e) {
    console.error('Error al copiar la base de datos a /tmp:', e.message);
  }
  // Redirigir Prisma a la copia en /tmp (con permisos de escritura)
  process.env.DATABASE_URL = 'file:/tmp/dev.db';
}

const authRoutes = require('../src/routes/authRoutes');
const itemRoutes = require('../src/routes/itemRoutes');

const app = express();

// Middlewares globales
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(express.json());

// Ruta de prueba base (Health check)
app.get('/api', (req, res) => {
  res.json({ 
    message: 'Bienvenido al API de Harmony Music - Workspace',
    status: 'online',
    timestamp: new Date()
  });
});

// Rutas de la aplicación
app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes);

// Manejo de rutas inexistentes (404)
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Manejo global de errores
app.use((err, req, res, next) => {
  console.error('Error global detectado:', err);
  res.status(500).json({ error: 'Ocurrió un error interno en el servidor' });
});

// Servidor local (solo para desarrollo local)
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5001;
  app.listen(PORT, () => {
    console.log(`Servidor local corriendo en http://localhost:${PORT}`);
  });
}

module.exports = app;
