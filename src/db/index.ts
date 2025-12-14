import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const connectionString = import.meta.env.DATABASE_URL || process.env.DATABASE_URL 

if (!connectionString) {
    throw new Error("🔴 ERROR CRÍTICO: No se encontró la variable DATABASE_URL. Revisa tu archivo .env");
}
console.log("🟢 Conectando a la base de datos..."); 

const client = postgres(connectionString, { prepare: false });
export const db = drizzle(client, { schema });