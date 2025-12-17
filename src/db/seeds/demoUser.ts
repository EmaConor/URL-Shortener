import type { db } from '../index';
import { user, plan } from '../schema';
import { eq } from 'drizzle-orm';

export default async function seed(db: db) {
  try {
    let freePlan = await db.query.plan.findFirst({
      where: eq(plan.name, 'Free')
    });
    console.log(freePlan)
    if (!freePlan) {
      throw new Error("No free plan");
    }

    const demoEmail = 'demo@publico.com';
    const demoId = crypto.randomUUID();
    
    const result = await db.insert(user).values({
      id: demoId,
      name: 'Usuario Demo',
      email: demoEmail,
      emailVerified: true,
      planId: freePlan.id,
      isActive: true,
    }).onConflictDoUpdate({
      target: user.email,
      set: { isActive: true },
    }).returning()

    console.log("Resultado insert:", result);


    console.log("Usuario demo insertado/actualizado");
  } catch (error) {
    console.error("Error insertando usuario demo: ",error);
  }
  
}