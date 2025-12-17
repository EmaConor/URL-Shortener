import { drizzle } from 'drizzle-orm/postgres-js';
import 'dotenv/config';
import postgres from 'postgres';
import * as schema from './schema';

const connectionString = process.env.DATABASE_URL || import.meta.env.DATABASE_URL
if (!connectionString) {
    throw new Error("🔴 ERROR CRÍTICO: No se encontró la variable DATABASE_URL. Revisa tu archivo .env");
}
console.log("🟢 Conectando a la base de datos...");
export const connection = postgres(connectionString, { prepare: false });

export const db = drizzle(connection, { schema, logger: true, });

export type db = typeof db;
export default db;