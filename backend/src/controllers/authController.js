const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'harmony_super_secret_jwt_key_123';

// Registro de Usuario (Rol USER por defecto)
exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'El email y la contraseña son requeridos' });
    }

    // Verificar si el usuario ya existe
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'El correo electrónico ya está registrado' });
    }

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Obtener rol USER
    let userRole = await prisma.role.findUnique({ where: { name: 'USER' } });
    if (!userRole) {
      userRole = await prisma.role.create({ data: { name: 'USER' } });
    }

    // Crear usuario
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        roleId: userRole.id,
      },
      include: {
        role: true,
      },
    });

    res.status(201).json({
      message: 'Usuario registrado con éxito',
      user: {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role.name,
      },
    });
  } catch (error) {
    console.error('Error en el registro:', error);
    res.status(500).json({ error: 'Error interno del servidor al registrar usuario' });
  }
};

// Login de Usuario
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'El email y la contraseña son requeridos' });
    }

    // Buscar usuario y su rol
    const user = await prisma.user.findUnique({
      where: { email },
      include: { role: true },
    });

    if (!user) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Validar contraseña
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Generar Token JWT
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role.name,
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(200).json({
      message: 'Inicio de sesión exitoso',
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role.name,
      },
    });
  } catch (error) {
    console.error('Error en el login:', error);
    res.status(500).json({ error: 'Error interno del servidor al iniciar sesión' });
  }
};
