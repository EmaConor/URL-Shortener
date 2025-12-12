import { defineAction } from 'astro:actions';
import { z } from 'astro:schema';
import { nanoid } from 'nanoid'

export const server = {
    setShortUrl: defineAction({
        input: z.object({
            url : z.string().url('URL inválida'),
        }),
        handler: async ({ url }) => {
            try {
                console.log({url});
                const shortCode = nanoid(8);
                console.log({shortCode})

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