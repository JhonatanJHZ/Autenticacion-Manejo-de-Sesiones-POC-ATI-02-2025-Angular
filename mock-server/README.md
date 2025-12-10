# Mock API Server - Autenticación JWT

Mock server para simular autenticación con Bearer Token usando JWT.

## Usuarios de Prueba

| Usuario | Password | Rol   |
| ------- | -------- | ----- |
| admin   | admin123 | admin |
| user    | user123  | user  |

## Endpoints

### Públicos

- `GET /api/public/info` - Información pública
- `GET /health` - Health check

### Autenticación

- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/refresh` - Refrescar token
- `POST /api/auth/logout` - Cerrar sesión

### Protegidos (requieren Bearer Token)

- `GET /api/auth/me` - Información del usuario actual
- `GET /api/protected/data` - Datos protegidos
- `GET /api/protected/admin` - Panel de administración (solo admin)

## Instalación

```bash
npm install
```

## Ejecutar

```bash
npm start
```

O con auto-reload:

```bash
npm run dev
```

El servidor estará disponible en `http://localhost:3000`

## Ejemplo de uso

### Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

### Acceder a ruta protegida

```bash
curl http://localhost:3000/api/protected/data \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```
