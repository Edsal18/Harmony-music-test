const express = require('express');
const cors = require('cors');
require('dotenv').config();

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
