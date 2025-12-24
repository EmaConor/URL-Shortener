import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { db } from '../db'
import * as schema from '../db/schema'
import { eq } from 'drizzle-orm'
import { Resend } from 'resend'

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL:  process.env.BETTER_AUTH_URL,
  basePath: '/api/auth',

  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: {
      user: schema.user,
      session: schema.session,
      account: schema.account,
      verification: schema.verification,
    },
  }),

  emailAndPassword: {
    enabled: true,
  },

  socialProviders: {
    github: {
      clientId:  process.env.GITHUB_CLIENT_ID as string,
      clientSecret:  process.env.GITHUB_CLIENT_SECRET as string,
    },
  },

  user: {
    additionalFields: {
      planId: {
        type: 'string',
        required: false,
        input: false,
      },
      isActive: {
        type: 'boolean',
        required: false,
        defaultValue: true,
      },
    },
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          const freePlan = await db.query.plan.findFirst({
            where: eq(schema.plan.name, 'Free'),
          })

          if (!freePlan) {
            throw new Error('Error interno: Plan Free no encontrado.')
          }

          const { image, ...userData } = user

          return {
            data: {
              ...userData,
              planId: freePlan.id,
            },
          }
        },
      },
    },
  },
})

export type Auth = typeof auth
export type Session = typeof auth.$Infer.Session
