const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 3001;
const SECRET_KEY = 'mi-super-secreto-jwt-key-2024';

app.use(cors());
app.use(express.json());

const users = [
  {
    id: 1,
    username: 'admin',
    password: 'admin123',
    email: 'admin@example.com',
    role: 'admin',
  },
  {
    id: 2,
    username: 'user',
    password: 'user123',
    email: 'user@example.com',
    role: 'user',
  },
];

const refreshTokens = new Set();

const revokedTokens = new Set();

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token no proporcionado' });
  }

  if (revokedTokens.has(token)) {
    console.log(`[AUTH] Acceso denegado: Token en Lista Negra`);
    return res.status(403).json({ message: 'Token revocado o inválido' });
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Token inválido o expirado' });
    }
    req.user = user;
    next();
  });
};

const generateAccessToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    },
    SECRET_KEY,
    { expiresIn: '1m' }
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      username: user.username,
    },
    SECRET_KEY,
    { expiresIn: '7d' }
  );
};

app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;

  console.log(`[LOGIN] Intento de login: ${username}`);

  if (!username || !password) {
    return res.status(400).json({ message: 'Usuario y contraseña son requeridos' });
  }

  const user = users.find((u) => u.username === username && u.password === password);

  if (!user) {
    return res.status(401).json({ message: 'Credenciales inválidas' });
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  refreshTokens.add(refreshToken);

  console.log(`[LOGIN] Login exitoso para: ${username}`);

  res.json({
    message: 'Login exitoso',
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    },
  });
});

app.post('/api/auth/refresh', (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ message: 'Refresh token no proporcionado' });
  }

  if (!refreshTokens.has(refreshToken)) {
    return res.status(403).json({ message: 'Refresh token inválido' });
  }

  jwt.verify(refreshToken, SECRET_KEY, (err, user) => {
    if (err) {
      refreshTokens.delete(refreshToken);
      return res.status(403).json({ message: 'Refresh token expirado' });
    }

    const accessToken = generateAccessToken(user);

    console.log(`[REFRESH] Token refrescado para: ${user.username}`);

    res.json({
      accessToken,
    });
  });
});

app.post('/api/auth/logout', verifyToken, (req, res) => {
  const authHeader = req.headers['authorization'];
  const accessToken = authHeader.split(' ')[1];

  const { refreshToken } = req.body;

  revokedTokens.add(accessToken);
  console.log(`[LOGOUT] Access Token agregado a la Lista Negra.`);

  if (refreshToken) {
    refreshTokens.delete(refreshToken);
  }

  console.log(`[LOGOUT] Usuario desconectado: ${req.user.username}`);

  res.json({ message: 'Logout exitoso' });
});

app.get('/api/auth/me', verifyToken, (req, res) => {
  const user = users.find((u) => u.id === req.user.id);

  if (!user) {
    return res.status(404).json({ message: 'Usuario no encontrado' });
  }

  res.json({
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
  });
});

app.get('/api/protected/data', verifyToken, (req, res) => {
  res.json({
    message: 'Datos protegidos',
    data: {
      timestamp: new Date().toISOString(),
      user: req.user.username,
      secretData: 'Esta información solo está disponible para usuarios autenticados',
    },
  });
});

app.get('/api/protected/admin', verifyToken, (req, res) => {
  if (req.user.role !== 'admin') {
    return res
      .status(403)
      .json({ message: 'Acceso denegado. Se requieren permisos de administrador' });
  }

  res.json({
    message: 'Panel de administración',
    data: {
      users: users.map((u) => ({ id: u.id, username: u.username, email: u.email, role: u.role })),
      stats: {
        totalUsers: users.length,
        activeTokens: refreshTokens.size,
      },
    },
  });
});

app.get('/api/public/info', (req, res) => {
  res.json({
    message: 'Información pública',
    version: '1.0.0',
    description: 'Mock API Server con autenticación JWT Bearer Token',
  });
});

// Endpoint de health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ message: 'Endpoint no encontrado' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log('='.repeat(60));
  console.log('🚀 Mock API Server iniciado');
  console.log('='.repeat(60));
  console.log(`📡 Servidor corriendo en: http://localhost:${PORT}`);
  console.log(`🔑 Secret Key: ${SECRET_KEY}`);
  console.log('\n📋 Usuarios disponibles:');
  users.forEach((user) => {
    console.log(`  - Usuario: ${user.username} | Password: ${user.password} | Role: ${user.role}`);
  });
  console.log('\n📌 Endpoints disponibles:');
  console.log('  POST  /api/auth/login    - Iniciar sesión');
  console.log('  POST  /api/auth/refresh   - Refrescar token');
  console.log('  POST  /api/auth/logout   - Cerrar sesión');
  console.log('  GET  /api/auth/me     - Info del usuario actual (protegido)');
  console.log('  GET  /api/protected/data  - Datos protegidos (protegido)');
  console.log('  GET  /api/protected/admin - Panel admin (protegido - solo admin)');
  console.log('  GET  /api/public/info   - Información pública');
  console.log('  GET  /health        - Health check');
  console.log('='.repeat(60));
});
