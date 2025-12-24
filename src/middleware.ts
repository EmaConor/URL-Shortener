import { auth } from '@/utils/auth'
import { defineMiddleware } from 'astro:middleware'

const PRIVATE_ROUTES = ['/dashboard', '/settings', '/admin']
const AUTH_ROUTES = ['/signIn', '/signUp']

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url

  // Ignore internal, file, and auth API routes
  if (
    pathname.startsWith('/_astro') ||
    pathname.includes('.') ||
    pathname.startsWith('/api/auth')
  ) {
    return next()
  }

  const isAuthed = await auth.api.getSession({
    headers: context.request.headers,
  })

  context.locals.user = isAuthed?.user || null
  context.locals.session = isAuthed?.session || null

  const isPrivateRoute = PRIVATE_ROUTES.some((route) => pathname.startsWith(route))
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route))

  // Rule 1: User is NOT authenticated and trying to access a private route
  if (!context.locals.session && isPrivateRoute) {
    return context.redirect('/signUp', 302)
  }

  // Rule 2: User IS authenticated and trying to access an auth route
  if (context.locals.session && isAuthRoute) {
    return context.redirect('/dashboard', 302)
  }

  return next()
})
