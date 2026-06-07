# URL Shortener

> **Leer en espanol** > [README.es.md](README.es.md)

A full-stack URL shortener service with password protection, custom slugs, tag organization, QR code generation, and user authentication. Built with Astro 5, PostgreSQL, Drizzle ORM, and better-auth.

---

## Features

- **Instant Shortening** - Transform long URLs into short, elegant links using `nanoid(6)`
- **Password Protection** - Secure your important links with bcrypt password authentication
- **Custom Slugs** - Create personalized short URLs with your own aliases
- **Tag System** - Organize your URLs with custom tags (up to 5 on Free plan)
- **Redirect Modes** - Direct redirect or 5-second countdown page
- **QR Codes** - Generate unique QR codes for each shortened link
- **User Dashboard** - Manage your URLs, tags, and view analytics
- **Authentication** - Email/password login with GitHub OAuth support via better-auth

---

## Tech Stack

### Frontend
- **Astro 5.16** - Modern web framework with server-side rendering
- **TypeScript** - Static type checking
- **Tailwind CSS 4** - Utility-first CSS framework with custom animations
- **SweetAlert2** - Beautiful alert dialogs

### Backend
- **PostgreSQL 15** - Primary database
- **Drizzle ORM** - Type-safe SQL ORM for PostgreSQL
- **better-auth** - Full-featured authentication system
- **bcryptjs** - Password hashing
- **Zod** - Schema validation
- **nanoid** - Unique ID generation
- **Resend** - Email delivery service

### DevOps
- **Docker** - Containerized deployment with docker-compose
- **Vercel** - Serverless deployment adapter
- **pgAdmin** - Database administration interface

---

## Getting Started

### Prerequisites

- **Node.js 18+** - JavaScript runtime
- **pnpm** - Package manager (install with `corepack enable` or `npm i -g pnpm`)
- **PostgreSQL 15+** - Database (or use Docker)
- **Docker** (optional) - For containerized database and services

### 1. Clone the repository

```bash
git clone https://github.com/EmaConor/URL-Shortener.git
cd URL-Shortener
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Configure environment variables

Copy the example environment file and fill in your values:

```bash
cp .env.example .env
```

Below is a description of all required and optional variables:

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `POSTGRES_USER` | Yes | PostgreSQL username |
| `POSTGRES_PASSWORD` | Yes | PostgreSQL password |
| `POSTGRES_DB` | Yes | PostgreSQL database name |
| `BETTER_AUTH_SECRET` | Yes | Secret key for session encryption (generate with `openssl rand -hex 32`) |
| `BETTER_AUTH_URL` | Yes | Full URL of your application (`http://localhost:4321` for development) |
| `PUBLIC_BETTER_AUTH_URL` | Yes | Same as `BETTER_AUTH_URL` (publicly accessible) |
| `GITHUB_CLIENT_ID` | No | GitHub OAuth App client ID |
| `GITHUB_CLIENT_SECRET` | No | GitHub OAuth App client secret |
| `RESEND_API_KEY` | No | Resend API key for email functionality |

### 4. Set up the database

Generate and apply database migrations, then optionally seed with demo data:

```bash
# Generate migration files from schema
pnpm run db:gen

# Apply migrations to the database
pnpm run db:migra

# (Optional) Seed database with demo users
pnpm run db:seed
```

> **Note:** Make sure your PostgreSQL server is running and accessible via the `DATABASE_URL` configured in your `.env` file.

### 5. Start the development server

```bash
pnpm run dev
```

The application will be available at **http://localhost:4321**.

---

## Docker Setup

For a fully containerized environment (PostgreSQL + pgAdmin + web app):

```bash
# Start all services in the background
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

### Services included in docker-compose

| Service | Port | Description |
|---|---|---|
| **PostgreSQL 15** | 5432 | Primary database |
| **pgAdmin** | 5050 | Web-based database administration |
| **Web App** | 4321 | Astro server |

### Access pgAdmin

1. Open http://localhost:5050
2. Login with the credentials from your `.env` file (`PGADMIN_DEFAULT_EMAIL` / `PGADMIN_DEFAULT_PASSWORD`)
3. Register the PostgreSQL server:
   - Host: `postgres`
   - Port: `5432`
   - Database: `url_shortener` (or your `POSTGRES_DB` value)
   - Username: your `POSTGRES_USER` value
   - Password: your `POSTGRES_PASSWORD` value

---

## Project Structure

```
src/
├── actions/           # Astro Server Actions (URLs, tags, auth)
│   └── index.ts
├── components/        # Reusable Astro components
│   ├── Features.astro
│   ├── UrlForm.astro
│   └── Window.astro
├── db/                # Database configuration
│   ├── migrations/    # Drizzle migration files
│   ├── seed/          # Database seed data
│   └── schema/        # Table schemas and relations
├── layouts/           # Page layouts
├── pages/             # Application pages and API routes
│   ├── api/auth/[...all].ts  # Authentication API
│   └── [code].astro          # Redirect handler
├── middleware.ts      # Route protection middleware
├── utils/             # Utility functions
│   ├── auth.ts        # better-auth configuration
│   └── auth-client.ts # Auth client setup
└── validations/       # Zod validation schemas
    └── auth.ts
```

---

## Authentication Architecture

The application uses **better-auth** with multiple security layers:

1. **Route Middleware** - Centralized protection in `src/middleware.ts`
2. **Server Actions** - Ownership verification on every action
3. **URL Protection** - Per-link password with access cookies

### Protected routes

| Route | Access |
|---|---|
| `/dashboard`, `/settings`, `/admin` | Authenticated users only |
| `/signIn`, `/signUp` | Redirect to dashboard if already authenticated |
| `/api/auth/*` | Authentication API (managed by better-auth) |

---

## Database Schema

### Main tables

- **user** - Application users with plan and status
- **short_url** - Shortened URLs with protection configuration
- **tag** - User-defined tag system
- **url_protection** - Passwords for protected URLs
- **session** - Authentication sessions (managed by better-auth)

### Performance indexes

- `idx_short_url_code` - Fast lookup by short code
- `idx_user_email` - Fast authentication queries

---

## Deployment

### Deploy to Vercel

1. Push your repository to GitHub
2. Import the project in [Vercel](https://vercel.com)
3. Configure the following environment variables in the Vercel dashboard:

| Variable | Description |
|---|---|
| `DATABASE_URL` | Production PostgreSQL connection string (use a managed provider like Neon, Supabase, or Railway) |
| `BETTER_AUTH_SECRET` | Secret key for session encryption |
| `BETTER_AUTH_URL` | Full URL of your production site (e.g., `https://your-domain.vercel.app`) |
| `PUBLIC_BETTER_AUTH_URL` | Same as `BETTER_AUTH_URL` |
| `GITHUB_CLIENT_ID` | (Optional) GitHub OAuth client ID |
| `GITHUB_CLIENT_SECRET` | (Optional) GitHub OAuth client secret |
| `RESEND_API_KEY` | (Optional) Resend API key |

4. Set the build command to `pnpm run build` and output directory to `dist`
5. Deploy - Vercel will automatically deploy on every push to the main branch

### Build for production

```bash
pnpm run build
pnpm run preview
```

---

## API Endpoints

### Server Actions (Astro Actions)

| Action | Description |
|---|---|
| `setShortUrl` | Create a new shortened URL (public) |
| `setShortUrlUser` | Create a shortened URL (authenticated) |
| `addTagUser` | Create custom tags |
| `updateUrl` | Update URL configuration |
| `deleteUrl` | Delete a shortened URL |

### Authentication API

| Endpoint | Description |
|---|---|
| `POST /api/auth/sign-in` | Sign in with email and password |
| `POST /api/auth/sign-up` | Create a new account |
| `POST /api/auth/sign-out` | Sign out current session |
| `GET /api/auth/session` | Get current session information |

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## Links

- **Live Demo**: https://short.emaconor.site
- **Repository**: https://github.com/EmaConor/URL-Shortener
- **Issue Tracker**: https://github.com/EmaConor/URL-Shortener/issues
