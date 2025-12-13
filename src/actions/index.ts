import { defineAction } from 'astro:actions';
import { z } from 'astro:schema';
import { nanoid } from 'nanoid'
import { db } from '@/db/index'
import { short_url } from '@/db/schema';

export const server = {
    setShortUrl: defineAction({
        accept: 'form',
        input: z.object({
            url : z.string().url('URL inválida'),
        }),
        handler: async ({ url }) => {
            try {
                console.log({url});
                const shortCode = nanoid(6);
                console.log({shortCode})
                
                await db.insert(short_url).values({
                    full_url: url,
                    short_code: shortCode
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
    })
}