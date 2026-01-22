# URL Shortener

Servicio de acortamiento de URLs full-stack con protección por contraseña, slugs personalizados y generación de códigos QR. Construido con tecnologías web modernas.

## Características

- **Acortamiento Instantáneo**: Transforma URLs largas en enlaces cortos y elegantes usando `nanoid(6)` [1](#3-0) 
- **Protección con Contraseña**: Asegura tus enlaces importantes con autenticación por contraseña usando bcrypt [2](#3-1) 
- **Sistema de Tags**: Organiza tus URLs con etiquetas personalizadas (límite de 5 para plan Free) [4](#3-3) 
- **Modos de Redirección**: Directo o con cuenta regresiva de 5 segundos [5](#3-4) 
- **Autenticación Completa**: Sistema de auth con better-auth, soporte para email/password y GitHub OAuth [6](#3-5) 
- **Panel de Usuario**: Dashboard para gestionar URLs y analizar estadísticas

## Futuras Características

- **Códigos QR**: Genera códigos QR únicos para cada enlace [3](#3-2) //Working on it

## Tech Stack

### Frontend
- **Astro 5.16.6** - Framework web moderno
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Framework de CSS con animaciones personalizadas

### Backend
- **PostgreSQL** - Base de datos principal
- **Drizzle ORM** - ORM para PostgreSQL
- **better-auth** - Sistema de autenticación
- **bcryptjs** - Hash de contraseñas
- **Zod** - Validación de esquemas
- **nanoid** - Generación de IDs únicos

## Instalación Rápida

### Prerrequisitos
- Node.js 18+
- PostgreSQL 15+
- Docker (opcional)

### 1. Clonar el repositorio
```bash
git clone https://github.com/EmaConor/URL-Shortener.git
cd URL-Shortener
```

### 2. Instalar dependencias
```bash
pnpm install
```

### 3. Configurar variables de entorno
Crea un archivo `.env` con las siguientes variables:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/url_shortener"
POSTGRES_USER="your_user"
POSTGRES_PASSWORD="your_password"
POSTGRES_DB="url_shortener"

# Authentication
BETTER_AUTH_SECRET="your-secret-key"
BETTER_AUTH_URL="http://localhost:4321/api/auth"

# GitHub OAuth (opcional)
GITHUB_CLIENT_ID="your_github_client_id"
GITHUB_CLIENT_SECRET="your_github_client_secret"

# Email (opcional)
RESEND_API_KEY="your_resend_api_key"
```

### 4. Configurar base de datos
```bash
# Generar migraciones
pnpm run db:gen

# Ejecutar migraciones
pnpm run db:migra
```

### 5. Iniciar desarrollo
```bash
pnpm run dev
```

Visita `http://localhost:4321` para ver la aplicación.

## Docker Setup

Usa Docker Compose para un entorno completo:

```bash
# Iniciar todos los servicios
docker-compose up -d

# Ver logs
docker-compose logs -f

# Detener servicios
docker-compose down
```

El archivo `docker-compose.yml` incluye:
- **PostgreSQL 15** - Base de datos
- **pgAdmin** - Interfaz de administración (puerto 5050)
- **Aplicación web** - Servidor Astro (puerto 4321) [7](#3-6) 

## Estructura del Proyecto

```
src/
├── actions/           # Server Actions de Astro
│   └── index.ts      # Acciones principales (URLs, tags, auth)
├── components/       # Componentes de Astro
│   ├── Features.astro
│   ├── UrlForm.astro
│   └── Window.astro
├── db/              # Configuración de base de datos
│   ├── migrations/  # Migraciones de Drizzle
│   ├── seed/        # Datos iniciales
│   └── schema/      # Esquemas de tablas
├── layouts/         # Layouts de Astro
├── pages/           # Páginas y API routes
│   ├── api/auth/[...all].ts  # Auth API
│   └── [code].astro          # Página de redirección
├── middleware.ts    # Middleware de protección de rutas
├── utils/           # Utilidades
│   ├── auth.ts      # Configuración de better-auth
│   └── auth-client.ts
├── validations/     # Validaciones (Zod)
│   └── auth.ts      # Validaciones de Auth
```

## Arquitectura de Autenticación

El sistema usa **better-auth** con múltiples capas de seguridad:

1. **Middleware de Rutas**: Protección centralizada en `src/middleware.ts` [8](#3-7) 
2. **Server Actions**: Verificación de ownership en cada acción [9](#3-8) 
3. **Protección de URLs**: Contraseña con cookies de acceso [10](#3-9) 

### Rutas Protegidas
- **Rutas Privadas**: `/dashboard`, `/settings`, `/admin`
- **Rutas de Auth**: `/signIn`, `/signUp`
- **API Routes**: `/api/auth/*`

## 🗄️ Esquema de Base de Datos

### Tablas Principales
- **user**: Usuarios con plan y estado [11](#3-10) 
- **short_url**: URLs acortadas con configuración de protección [12](#3-11) 
- **tag**: Sistema de etiquetas por usuario
- **url_protection**: Contraseñas de URLs protegidas
- **session**: Sesiones de autenticación

### Índices de Rendimiento
- `idx_short_url_code` para búsqueda rápida por código [13](#3-12) 
- `idx_user_email` para autenticación rápida

## Despliegue

### Cloudflare Pages
1. Conecta tu repositorio a Cloudflare Pages
2. Configura las variables de entorno en el dashboard
3. Despliegue automático en cada push a main

### Variables de Entorno de Producción
- `BETTER_AUTH_SECRET`: Clave secreta para sesiones
- `BETTER_AUTH_URL`: URL completa del sitio
- `DATABASE_URL`: URL de base de datos PostgreSQL
- `GITHUB_CLIENT_ID/SECRET`: Para OAuth de GitHub

## API Endpoints

### Server Actions
- `setShortUrl`: Crear nueva URL acortada
- `setShortUrlUser`: Crear URL con autenticación
- `addTagUser`: Crear etiquetas personalizadas
- `updateUrl`: Actualizar configuración de URL
- `deleteUrl`: Eliminar URL

### Authentication API [14](#3-13) 
- `POST /api/auth/sign-in`: Iniciar sesión
- `POST /api/auth/sign-up`: Registrarse
- `POST /api/auth/sign-out`: Cerrar sesión
- `GET /api/auth/session`: Obtener sesión actual

## Contribuir

1. Fork el proyecto
2. Crear feature branch (`git checkout -b feature/amazing-feature`)
3. Commit cambios (`git commit -m 'Add amazing feature'`)
4. Push al branch (`git push origin feature/amazing-feature`)
5. Abrir Pull Request

## 🔗 Links

- **Live Demo**: https://short.emaconor.site
- **Repositorio**: https://github.com/EmaConor/URL-Shortener
- **Issues**: https://github.com/EmaConor/URL-Shortener/issues
```
