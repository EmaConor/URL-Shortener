import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../db"
import * as schema from "../db/schema";

export const auth = betterAuth({
    secret:import.meta.env.BETTER_AUTH_SECRET,
    baseURL: import.meta.env.BETTER_AUTH_URL,
    basePath: "/api/auth",
    database: drizzleAdapter(db, { 
        provider: "pg", 
        schema: {
            user: schema.user,
            session: schema.session,
            account: schema.account,
            verification: schema.verification
        },
    }),

    emailAndPassword: { enabled: true },

    // socialProviders: { 
    //     github: { 
    //         clientId: process.env.GITHUB_CLIENT_ID as string, 
    //         clientSecret: process.env.GITHUB_CLIENT_SECRET as string, 
    //     }, 
    // },
    
    user: { 
        additionalFields: {
            planId: {
                type: "string", // Aunque en DB es UUID, se pasa como string
                required: true,
                input: true, // Permitir recibirlo desde el frontend
            },
            isActive: {
                type: "boolean",
                required: false,
                defaultValue: true,
            }
        }
    },
});

export type Auth = typeof auth;