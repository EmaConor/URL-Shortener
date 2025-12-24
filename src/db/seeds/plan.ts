import type { db } from '../index';
import { plan } from '../schema';
import plans from './data/plans.json'

export default async function seed(db: db) {
    try {
        await db.insert(plan).values(plans).onConflictDoNothing();
        console.log("Planes insertados");

    } catch (error) {
        console.error("Error insertando planes: ", error);
    }
}