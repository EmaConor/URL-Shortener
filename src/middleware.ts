// src/middleware.ts
import { defineMiddleware } from "astro:middleware";

export const onRequest = defineMiddleware(async (context, next) => {
  const response = await next();

  const csp = [
    "default-src 'self'",

    // SCRIPTS
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://pagead2.googlesyndication.com https://tpc.googlesyndication.com https://www.googletagservices.com https://static.cloudflareinsights.com https://*.adtrafficquality.google",

    // ESTILOS
    "style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net",

    // FUENTES
    "font-src 'self' https://cdn.jsdelivr.net",

    // FRAMES
    "frame-src 'self' https://googleads.g.doubleclick.net https://tpc.googlesyndication.com https://*.googlesyndication.com https://*.google.com https://*.adtrafficquality.google",

    // CONEXIONES
    "connect-src 'self' https://pagead2.googlesyndication.com https://*.adtrafficquality.google https://cdn.jsdelivr.net",

    // IMÁGENES: AQUÍ ESTABA EL ERROR NUEVO
    // Agregamos https://*.adtrafficquality.google
    "img-src 'self' data: https://pagead2.googlesyndication.com https://*.googlesyndication.com https://*.adtrafficquality.google"
  ];

  response.headers.set("Content-Security-Policy", csp.join("; "));

  return response;
});