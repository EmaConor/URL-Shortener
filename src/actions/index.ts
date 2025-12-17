import { ActionError, defineAction } from 'astro:actions';
import { z } from 'astro:schema';
import { nanoid } from 'nanoid'

import { db } from '@/db/index'
import { eq } from 'drizzle-orm';
import { shortUrl, plan, user } from '@/db/schema/index';

import { authClient } from '@/utils/auth-client';
import { auth } from "@/utils/auth";

export const server = {
    setShortUrl: defineAction({
        input: z.object({
            url: z.string().url('URL inválida'),
        }),
        handler: async ({ url }) => {
            try {
                const shortCode = nanoid(6);

                const userDemo = await db.query.user.findFirst({
                    where: eq(user.email, 'demo@publico.com')
                })
                if (!userDemo){
                    throw new Error("Error interno: No se encontró el usuario demo, Contacta soporte.")
                }

                await db.insert(shortUrl).values({
                    userId: userDemo.id,
                    fullUrl: url,
                    code: shortCode
                })

                return {
                    success: true,
                    shortCode: shortCode,
                    message: 'URL encontrada con exito',
                };
            } catch (error) {
                console.error("Error guardando en la base de datos: ", error);
                throw new Error("No se pudo guardar la URL. intenta de nuevo")
            }
        }
    }),

    signUpClient: defineAction({
        input: z.object({
            name: z.string().min(1, "El nombre es obligatorio"),
            email: z.string().email("Email inválido"),
            password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres").max(64, "La contraseña no puede superar 64 caracteres").regex(/[A-Z]/, "Debe contener al menos una mayúscula").regex(/[0-9]/, "Debe contener al menos un número").regex(/[^A-Za-z0-9]/, "Debe contener al menos un símbolo")
        }),
        handler: async ({ name, email, password }, context) => {
            try {
                const freePlan = await db.query.plan.findFirst({
                    where: eq(plan.name, 'Free')
                })
                if (!freePlan){
                    throw new ActionError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "No se encontró el plan Free."
                    })
                }

                const response = await auth.api.signUpEmail({
                    body: {
                        name: name,
                        email: email,
                        password: password,
                        planId: freePlan.id,
                    },
                    asResponse: true,
                    headers: context.request.headers, 
                });

                if (!response.ok) {
                    throw new ActionError({
                    code: "BAD_REQUEST",
                    message: "Error al crear usuario"
                    })
                }

                const data = await response.json(); 
                
                // 5. Establecemos la cookie manualmente usando la sesión devuelta
                if (data.session) {
                    context.cookies.set("better-auth.session_token", data.session.token, {
                        httpOnly: true,
                        secure: import.meta.env.PROD, 
                        sameSite: "lax",
                        path: "/",
                        expires: new Date(data.session.expiresAt)
                    });
                }
                
                return {
                    success: true,
                }

            }catch(error){
                console.error("try Error:", error)
                throw new Error(`${error}`)
            }
        }
    })
}