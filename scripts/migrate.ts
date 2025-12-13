import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';


const runMigrate = async () => {
    if (!import.meta.env.DATABASE_URL) {
        throw new Error('DATABASE_URL is not defined');
    }

    const client = postgres(import.meta.env.DATABASE_URL, { max: 1 });
    const db = drizzle(client);

    console.log('⏳ Running migrations...');
    
    // Primero creamos las extensiones
    await client`
        CREATE EXTENSION IF NOT EXISTS "pgcrypto";
        CREATE EXTENSION IF NOT EXISTS "citext";
    `;
    
    // Luego ejecutamos las migraciones
    await migrate(db, { migrationsFolder: './src/db/migrations' });
    
    console.log('✅ Migrations completed');
    process.exit(0);
};

runMigrate().catch((err) => {
    console.error('❌ Migration failed');
    console.error(err);
    process.exit(1);
});