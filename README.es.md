# URL Shortener - Acortador de URLs

> **Read in English** > [README.md](README.md)

Un servicio completo de acortamiento de URLs con proteccion por contrasena, slugs personalizados, organizacion por etiquetas, generacion de codigos QR y autenticacion de usuarios. Construido con Astro 5, PostgreSQL, Drizzle ORM y better-auth.

---

## Caracteristicas

- **Acortamiento Instantaneo** - Transforma URLs largas en enlaces cortos y elegantes usando `nanoid(6)`
- **Proteccion con Contrasena** - Asegura tus enlaces importantes con autenticacion por contrasena usando bcrypt
- **Slugs Personalizados** - Crea URLs cortas personalizadas con tus propios alias
- **Sistema de Etiquetas** - Organiza tus URLs con etiquetas personalizadas (hasta 5 en el plan Free)
- **Modos de Redireccion** - Redireccion directa o pagina de cuenta regresiva de 5 segundos
- **Codigos QR** - Genera codigos QR unicos para cada enlace acortado
- **Panel de Usuario** - Gestiona tus URLs, etiquetas y visualiza estadisticas
- **Autenticacion** - Inicio de sesion con email/contrasena y soporte para GitHub OAuth via better-auth

---

## Tecnologias

### Frontend
- **Astro 5.16** - Framework web moderno con renderizado del lado del servidor
- **TypeScript** - Tipado estatico
- **Tailwind CSS 4** - Framework CSS utilitario con animaciones personalizadas
- **SweetAlert2** - Dialogos de alerta atractivos

### Backend
- **PostgreSQL 15** - Base de datos principal
- **Drizzle ORM** - ORM type-safe para PostgreSQL
- **better-auth** - Sistema de autenticacion completo
- **bcryptjs** - Hash de contrasenas
- **Zod** - Validacion de esquemas
- **nanoid** - Generacion de IDs unicos
- **Resend** - Servicio de envio de correos electronicos

### DevOps
- **Docker** - Despliegue containerizado con docker-compose
- **Vercel** - Adaptador de despliegue serverless
- **pgAdmin** - Interfaz de administracion de base de datos

---

## Primeros Pasos

### Prerrequisitos

- **Node.js 18+** - Entorno de ejecucion JavaScript
- **pnpm** - Gestor de paquetes (instalar con `corepack enable` o `npm i -g pnpm`)
- **PostgreSQL 15+** - Base de datos (o usar Docker)
- **Docker** (opcional) - Para base de datos y servicios containerizados

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

Copia el archivo de ejemplo y completa tus valores:

```bash
cp .env.example .env
```

A continuacion, la descripcion de todas las variables requeridas y opcionales:

| Variable | Requerida | Descripcion |
|---|---|---|
| `DATABASE_URL` | Si | Cadena de conexion a PostgreSQL |
| `POSTGRES_USER` | Si | Usuario de PostgreSQL |
| `POSTGRES_PASSWORD` | Si | Contrasena de PostgreSQL |
| `POSTGRES_DB` | Si | Nombre de la base de datos PostgreSQL |
| `BETTER_AUTH_SECRET` | Si | Clave secreta para cifrado de sesiones (generar con `openssl rand -hex 32`) |
| `BETTER_AUTH_URL` | Si | URL completa de tu aplicacion (`http://localhost:4321` para desarrollo) |
| `PUBLIC_BETTER_AUTH_URL` | Si | Misma que `BETTER_AUTH_URL` (accesible publicamente) |
| `GITHUB_CLIENT_ID` | No | ID de cliente de la app OAuth de GitHub |
| `GITHUB_CLIENT_SECRET` | No | Secreto de cliente de la app OAuth de GitHub |
| `RESEND_API_KEY` | No | Clave API de Resend para funcionalidad de correo |

### 4. Configurar la base de datos

Genera y aplica las migraciones, y opcionalmente siembra datos de demostracion:

```bash
# Generar archivos de migracion desde el esquema
pnpm run db:gen

# Aplicar migraciones a la base de datos
pnpm run db:migra

# (Opcional) Sembrar base de datos con usuarios de demostracion
pnpm run db:seed
```

> **Nota:** Asegurate de que tu servidor PostgreSQL este funcionando y accesible a traves de la `DATABASE_URL` configurada en tu archivo `.env`.

### 5. Iniciar el servidor de desarrollo

```bash
pnpm run dev
```

La aplicacion estara disponible en **http://localhost:4321**.

---

## Configuracion con Docker

Para un entorno completamente containerizado (PostgreSQL + pgAdmin + aplicacion web):

```bash
# Iniciar todos los servicios en segundo plano
docker-compose up -d

# Ver registros
docker-compose logs -f

# Detener todos los servicios
docker-compose down
```

### Servicios incluidos en docker-compose

| Servicio | Puerto | Descripcion |
|---|---|---|
| **PostgreSQL 15** | 5432 | Base de datos principal |
| **pgAdmin** | 5050 | Administracion de base de datos via web |
| **App Web** | 4321 | Servidor Astro |

### Acceder a pgAdmin

1. Abre http://localhost:5050
2. Inicia sesion con las credenciales de tu archivo `.env` (`PGADMIN_DEFAULT_EMAIL` / `PGADMIN_DEFAULT_PASSWORD`)
3. Registra el servidor PostgreSQL:
   - Host: `postgres`
   - Puerto: `5432`
   - Base de datos: `url_shortener` (o tu valor de `POSTGRES_DB`)
   - Usuario: tu valor de `POSTGRES_USER`
   - Contrasena: tu valor de `POSTGRES_PASSWORD`

---

## Estructura del Proyecto

```
src/
├── actions/           # Server Actions de Astro (URLs, etiquetas, auth)
│   └── index.ts
├── components/        # Componentes reutilizables de Astro
│   ├── Features.astro
│   ├── UrlForm.astro
│   └── Window.astro
├── db/                # Configuracion de base de datos
│   ├── migrations/    # Archivos de migracion de Drizzle
│   ├── seed/          # Datos iniciales para la base de datos
│   └── schema/        # Esquemas de tablas y relaciones
├── layouts/           # Layouts de pagina
├── pages/             # Paginas de la aplicacion y rutas API
│   ├── api/auth/[...all].ts  # API de autenticacion
│   └── [code].astro          # Manejador de redireccion
├── middleware.ts      # Middleware de proteccion de rutas
├── utils/             # Funciones de utilidad
│   ├── auth.ts        # Configuracion de better-auth
│   └── auth-client.ts # Configuracion del cliente de auth
└── validations/       # Esquemas de validacion Zod
    └── auth.ts
```

---

## Arquitectura de Autenticacion

La aplicacion utiliza **better-auth** con multiples capas de seguridad:

1. **Middleware de Rutas** - Proteccion centralizada en `src/middleware.ts`
2. **Server Actions** - Verificacion de propiedad en cada accion
3. **Proteccion de URLs** - Contrasena por enlace con cookies de acceso

### Rutas protegidas

| Ruta | Acceso |
|---|---|
| `/dashboard`, `/settings`, `/admin` | Solo usuarios autenticados |
| `/signIn`, `/signUp` | Redirige al dashboard si ya esta autenticado |
| `/api/auth/*` | API de autenticacion (gestionada por better-auth) |

---

## Esquema de Base de Datos

### Tablas principales

- **user** - Usuarios de la aplicacion con plan y estado
- **short_url** - URLs acortadas con configuracion de proteccion
- **tag** - Sistema de etiquetas definidas por el usuario
- **url_protection** - Contrasenas para URLs protegidas
- **session** - Sesiones de autenticacion (gestionadas por better-auth)

### Indices de rendimiento

- `idx_short_url_code` - Busqueda rapida por codigo corto
- `idx_user_email` - Consultas de autenticacion rapidas

---

## Despliegue

### Desplegar en Vercel

1. Sube tu repositorio a GitHub
2. Importa el proyecto en [Vercel](https://vercel.com)
3. Configura las siguientes variables de entorno en el panel de Vercel:

| Variable | Descripcion |
|---|---|
| `DATABASE_URL` | Cadena de conexion a PostgreSQL de produccion (usar un proveedor como Neon, Supabase o Railway) |
| `BETTER_AUTH_SECRET` | Clave secreta para cifrado de sesiones |
| `BETTER_AUTH_URL` | URL completa de tu sitio en produccion (ej: `https://tu-dominio.vercel.app`) |
| `PUBLIC_BETTER_AUTH_URL` | Misma que `BETTER_AUTH_URL` |
| `GITHUB_CLIENT_ID` | (Opcional) ID de cliente de GitHub OAuth |
| `GITHUB_CLIENT_SECRET` | (Opcional) Secreto de cliente de GitHub OAuth |
| `RESEND_API_KEY` | (Opcional) Clave API de Resend |

4. Establece el comando de build a `pnpm run build` y el directorio de salida a `dist`
5. Despliega - Vercel desplegara automaticamente en cada push a la rama main

### Build para produccion

```bash
pnpm run build
pnpm run preview
```

---

## Endpoints de la API

### Server Actions (Acciones de Astro)

| Accion | Descripcion |
|---|---|
| `setShortUrl` | Crear una nueva URL acortada (publica) |
| `setShortUrlUser` | Crear una URL acortada (autenticado) |
| `addTagUser` | Crear etiquetas personalizadas |
| `updateUrl` | Actualizar configuracion de una URL |
| `deleteUrl` | Eliminar una URL acortada |

### API de Autenticacion

| Endpoint | Descripcion |
|---|---|
| `POST /api/auth/sign-in` | Iniciar sesion con email y contrasena |
| `POST /api/auth/sign-up` | Crear una nueva cuenta |
| `POST /api/auth/sign-out` | Cerrar sesion actual |
| `GET /api/auth/session` | Obtener informacion de la sesion actual |

---

## Contribuir

1. Haz un fork del repositorio
2. Crea una rama de funcionalidad (`git checkout -b feature/nueva-funcionalidad`)
3. Realiza tus cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Sube la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

---

## Enlaces

- **Demo en Vivo**: https://short.emaconor.site
- **Repositorio**: https://github.com/EmaConor/URL-Shortener
- **Reportar Issues**: https://github.com/EmaConor/URL-Shortener/issues
