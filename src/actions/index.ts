import { ActionError, defineAction } from 'astro:actions'
import { z } from 'astro:schema'
import { nanoid } from 'nanoid'
import { hash } from 'bcryptjs'

import { db } from '@/db/index'
import { eq, and, inArray } from 'drizzle-orm'
import { shortUrl, tag, user, plan, urlProtection, urlTag } from '@/db/schema/index'

export const server = {
  setShortUrl: defineAction({
    input: z.object({
      url: z.string().url('URL inválida'),
    }),
    handler: async ({ url }) => {
      try {
        const shortCode = nanoid(6)

        const userDemo = await db.query.user.findFirst({
          where: eq(user.email, 'demo@publico.com'),
        })
        if (!userDemo) {
          throw new Error('Error interno: No se encontró el usuario demo, Contacta soporte.')
        }

        await db.insert(shortUrl).values({
          userId: userDemo.id,
          fullUrl: url,
          code: shortCode,
        })

        return {
          success: true,
          shortCode: shortCode,
          message: 'URL encontrada con exito',
        }
      } catch (error) {
        console.error('Error guardando en la base de datos: ', error)
        throw new Error('No se pudo guardar la URL. intenta de nuevo')
      }
    },
  }),

  addTagUser: defineAction({
    input: z.object({
      nameTag: z.string().max(15, 'El nombre no puede superar 15 caracteres'),
      colorTag: z.string(),
    }),
    handler: async ({ nameTag, colorTag }, context) => {
      try {
        const user = context.locals.user
        if (!user || !user.planId) {
          throw new Error('No autenticado')
        }

        const ownTags = await db.select().from(tag).where(eq(tag.userId, user.id))
        const [userPlan] = await db.select().from(plan).where(eq(plan.id, user.planId))

        if (ownTags.length >= 5 && userPlan.name == 'Free') {
          throw new Error('El plan Free solo permite hasta 5 tags')
        }
        const newTag = await db
          .insert(tag)
          .values({
            userId: user.id,
            name: nameTag,
            color: colorTag,
          })
          .returning()
        return { id: newTag[0].id, name: newTag[0].name, color: newTag[0].color }
      } catch (e) {
        console.error('Error al insertar tag:', e)
        throw e
      }
    },
  }),

  setShortUrlUser: defineAction({
    input: z.object({
      url: z.string().url('URL inválida'),
      isProtected: z.boolean(),
      password: z.string().nullable().optional(),
      tagId: z.string().optional(),
    }),
    handler: async ({ url, isProtected, password, tagId }, context) => {
      try {
        const shortCode = nanoid(6)

        const user = context.locals.user
        if (!user || !user.planId) {
          throw new ActionError({
            code: 'UNAUTHORIZED',
            message: 'Debes iniciar sesión para realizar esta acción.',
          })
        }

        const newShortUrl = await db
          .insert(shortUrl)
          .values({
            userId: user.id,
            fullUrl: url,
            code: shortCode,
            isProtected: isProtected,
          })
          .returning()

        let hashedPassword = null
        if (isProtected && password) {
          const bcrypt = await import('bcryptjs')
          hashedPassword = await bcrypt.hash(password, 10)

          await db.insert(urlProtection).values({
            urlId: newShortUrl[0].id,
            password: hashedPassword,
          })
        }

        if (tagId) {
          await db.insert(urlTag).values({
            urlId: newShortUrl[0].id,
            tagId: tagId,
          })
        }

        return {
          success: true,
          shortCode: shortCode,
          message: 'URL encontrada con exito',
        }
      } catch (error) {
        console.error('Error guardando en la base de datos: ', error)
        throw new Error('No se pudo guardar la URL. intenta de nuevo')
      }
    },
  }),

  setUrlStatus: defineAction({
    input: z.object({
      urlId: z.string(),
      isActive: z.boolean(),
    }),
    handler: async ({ urlId, isActive }, context) => {
      try {
        const user = context.locals.user
        if (!user || !user.planId) {
          throw new ActionError({
            code: 'UNAUTHORIZED',
            message: 'Debes iniciar sesión para realizar esta acción.',
          })
        }

        const updated = await db
          .update(shortUrl)
          .set({ isActive: isActive })
          .where(and(eq(shortUrl.id, urlId), eq(shortUrl.userId, user.id)))
          .returning({ isActive: shortUrl.isActive })

        if (!updated.length) {
          throw new ActionError({ code: 'NOT_FOUND', message: 'URL no encontrada' })
        }

        return { success: true, isActive: updated[0].isActive }
      } catch (error) {
        console.error('Error toggling status:', error)
        throw new ActionError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Error al actualizar estado',
        })
      }
    },
  }),

  deleteUrl: defineAction({
    input: z.object({
      urlId: z.string(),
    }),
    handler: async ({ urlId }, context) => {
      try {
        const user = context.locals.user
        if (!user || !user.planId) {
          throw new ActionError({
            code: 'UNAUTHORIZED',
            message: 'Debes iniciar sesión para realizar esta acción.',
          })
        }

        const deleted = await db
          .delete(shortUrl)
          .where(and(eq(shortUrl.id, urlId), eq(shortUrl.userId, user.id)))
          .returning({ id: shortUrl.id })

        if (!deleted.length) {
          throw new ActionError({
            code: 'NOT_FOUND',
            message: 'No se pudo eliminar o no tienes permisos',
          })
        }

        return { success: true, id: deleted[0].id }
      } catch (error) {
        console.error('Error deleting url:', error)
        throw new ActionError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Error interno al eliminar',
        })
      }
    },
  }),

  updateUrl: defineAction({
    input: z.object({
      urlId: z.string(),
      isDirect: z.boolean(),
      isProtected: z.boolean(),
      password: z.string().nullable().optional(),
      tags: z.array(z.string()),
    }),
    handler: async ({ urlId, isDirect, isProtected, password, tags }, context) => {
      const user = context.locals.user
      if (!user) throw new ActionError({ code: 'UNAUTHORIZED', message: 'No autorizado' })

      await db.transaction(async (tx) => {
        const updateData: any = {
          isDirect,
          isProtected,
          updatedAt: new Date(),
        }

        let hashedPassword = null
        if (isProtected && password && password.trim() !== '') {
          const bcrypt = await import('bcryptjs')
          hashedPassword = await bcrypt.hash(password, 10)
          await db
            .update(urlProtection)
            .set({ password: hashedPassword })
            .where(eq(urlProtection.urlId, urlId))
        }

        await tx
          .update(shortUrl)
          .set(updateData)
          .where(and(eq(shortUrl.id, urlId), eq(shortUrl.userId, user.id)))

        // 2. Sincronizar Tags (La parte truculenta)
        // Primero: Borramos todas las relaciones existentes de esta URL
        await tx.delete(urlTag).where(eq(urlTag.urlId, urlId))

        // Segundo: Si hay tags seleccionados, los insertamos de nuevo
        if (tags.length > 0) {
          // Validamos que los tags pertenezcan al usuario para seguridad
          const validTags = await tx
            .select({ id: tag.id })
            .from(tag)
            .where(and(inArray(tag.id, tags), eq(tag.userId, user.id)))

          if (validTags.length > 0) {
            const newRelations = validTags.map((t) => ({
              urlId: urlId,
              tagId: t.id,
            }))
            await tx.insert(urlTag).values(newRelations)
          }
        }
      })

      return { success: true }
    },
  }),
}
