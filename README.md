# POC - Autenticación con Bearer Token en Angular

Este proyecto es una **Prueba de Concepto (POC)** que demuestra la implementación completa de autenticación HTTP utilizando **Bearer Token (JWT)** en una aplicación Angular con un mock server.

## 🎯 Características

### Frontend (Angular)

- ✅ **Autenticación con JWT**: Login y gestión de tokens
- ✅ **Interceptor HTTP**: Agrega automáticamente el Bearer Token a las peticiones
- ✅ **Refresh Token**: Renovación automática de tokens expirados
- ✅ **Guards de Rutas**: Protección de rutas según autenticación y roles
- ✅ **Manejo de Sesión**: Almacenamiento seguro en localStorage
- ✅ **UI Moderna**: Diseño premium con gradientes y animaciones

### Backend (Mock Server)

- ✅ **API REST**: Endpoints de autenticación completos
- ✅ **JWT**: Generación y validación de tokens
- ✅ **Refresh Tokens**: Sistema de renovación de tokens
- ✅ **Control de Roles**: Admin y User
- ✅ **CORS**: Configurado para desarrollo local

## 📋 Requisitos Previos

- Node.js (v18 o superior)
- npm (v9 o superior)
- Angular CLI (v21 o superior)

## 🚀 Instalación y Configuración

### 1. Instalar dependencias del proyecto Angular

```bash
cd "POC-Exposicion-5-Auth"
npm install
```

### 2. Instalar dependencias del Mock Server

```bash
cd mock-server
npm install
```

## ▶️ Ejecución

### Paso 1: Iniciar el Mock Server

En una terminal, ejecuta:

```bash
cd mock-server
npm start
```

El servidor estará disponible en: `http://localhost:3000`

### Paso 2: Iniciar la aplicación Angular

En otra terminal, ejecuta:

```bash
cd POC-Exposicion-5-Auth
npm start
```

La aplicación estará disponible en: `http://localhost:4200`

## 👥 Usuarios de Prueba

| Usuario | Contraseña | Rol   | Permisos                      |
| ------- | ---------- | ----- | ----------------------------- |
| admin   | admin123   | admin | Acceso completo + Panel Admin |
| user    | user123    | user  | Acceso básico                 |

## 🔌 Endpoints del API

### Públicos

- `GET /api/public/info` - Información pública
- `GET /health` - Health check

### Autenticación

- `POST /api/auth/login` - Iniciar sesión

  ```json
  {
    "username": "admin",
    "password": "admin123"
  }
  ```

- `POST /api/auth/refresh` - Refrescar token

  ```json
  {
    "refreshToken": "YOUR_REFRESH_TOKEN"
  }
  ```

- `POST /api/auth/logout` - Cerrar sesión (requiere Bearer Token)
  ```json
  {
    "refreshToken": "YOUR_REFRESH_TOKEN"
  }
  ```

### Protegidos (requieren Bearer Token)

- `GET /api/auth/me` - Información del usuario actual
- `GET /api/protected/data` - Datos protegidos
- `GET /api/protected/admin` - Panel de administración (solo admin)

## 🔐 Flujo de Autenticación

1. **Login**: El usuario ingresa credenciales
2. **Tokens**: El servidor devuelve `accessToken` y `refreshToken`
3. **Almacenamiento**: Los tokens se guardan en localStorage
4. **Interceptor**: Cada petición HTTP incluye automáticamente el Bearer Token
5. **Renovación**: Si el token expira (1 min), se renueva automáticamente
6. **Logout**: Se eliminan los tokens y se redirige al login

## 📁 Estructura del Proyecto

```
POC-Exposicion-5-Auth/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── login/          # Componente de login
│   │   │   └── dashboard/      # Componente dashboard
│   │   ├── guards/
│   │   │   ├── auth.guard.ts   # Guard de autenticación
│   │   │   └── role.guard.ts   # Guard de roles
│   │   ├── interceptors/
│   │   │   └── auth.interceptor.ts  # Interceptor HTTP
│   │   ├── models/
│   │   │   └── auth.model.ts   # Interfaces TypeScript
│   │   ├── services/
│   │   │   └── auth.service.ts # Servicio de autenticación
│   │   ├── app.routes.ts       # Configuración de rutas
│   │   └── app.config.ts       # Configuración de la app
│   └── styles.css              # Estilos globales
│
└── mock-server/
    ├── server.js               # Mock API Server
    ├── package.json
    └── README.md
```

## 🎨 Características de la UI

- **Diseño Moderno**: Gradientes vibrantes y sombras suaves
- **Animaciones**: Transiciones fluidas y micro-interacciones
- **Responsive**: Adaptable a diferentes tamaños de pantalla
- **Accesibilidad**: Etiquetas ARIA y navegación por teclado
- **Feedback Visual**: Estados de carga, errores y éxito

## 🔧 Tecnologías Utilizadas

### Frontend

- Angular 21
- TypeScript
- RxJS
- CSS3 (Gradientes, Flexbox, Grid)

### Backend (Mock)

- Node.js
- Express
- jsonwebtoken
- cors

## 📝 Notas Técnicas

### Duración de Tokens

- **Access Token**: 1 minutos
- **Refresh Token**: 7 días

### Seguridad

- Los tokens se almacenan en localStorage
- El interceptor agrega automáticamente el header `Authorization: Bearer TOKEN`
- Los refresh tokens se invalidan al hacer logout
- Las rutas protegidas requieren autenticación válida

### Interceptor HTTP

El interceptor maneja automáticamente:

- Agregar el Bearer Token a las peticiones
- Renovar tokens expirados (401/403)
- Redirigir al login si falla la renovación

## 🧪 Pruebas Recomendadas

1. **Login con diferentes usuarios**

   - Probar con admin y user
   - Verificar que se almacenan los tokens

2. **Acceso a rutas protegidas**

   - Intentar acceder a `/dashboard` sin login
   - Verificar redirección a `/login`

3. **Cargar datos protegidos**

   - Usar los botones en el dashboard
   - Verificar que el token se envía en el header

4. **Panel de administrador**

   - Login como `user` y intentar acceder
   - Login como `admin` y verificar acceso

5. **Expiración de token**

   - Esperar 1 minutos (o modificar el tiempo en el server)
   - Verificar que se renueva automáticamente

6. **Logout**
   - Cerrar sesión
   - Verificar que se eliminan los tokens
   - Intentar acceder a rutas protegidas

## 🐛 Troubleshooting

### El mock server no inicia

- Verificar que el puerto 3000 esté disponible
- Revisar que las dependencias estén instaladas

### La aplicación Angular no se conecta al API

- Verificar que el mock server esté corriendo
- Revisar la URL del API en `auth.service.ts` (línea 10)

### Los tokens no se guardan

- Verificar que localStorage esté habilitado en el navegador
- Revisar la consola del navegador para errores

### Error de CORS

- Asegurarse de que el mock server tenga CORS habilitado
- Verificar que las URLs coincidan

## 📚 Recursos Adicionales

- [Documentación de Angular](https://angular.dev)
- [JWT.io](https://jwt.io) - Decodificador de JWT
- [Express.js](https://expressjs.com)

## 👨‍💻 Autor

Proyecto de demostración para la exposición de Aplicaciones con Tecnología Internet II

## 📄 Licencia

Este proyecto es solo para fines educativos.
