import { eq } from 'drizzle-orm';

import db from '../db';
import { Farm, NewFarm, farmsSchema } from '../db/schemas';

export async function synchronizeFarms(farms: NewFarm[]) {
  const res = await Promise.allSettled(
    farms
      ? farms.map(async (farm) => {
          await db.delete(farmsSchema).where(eq(farmsSchema.id, farm.id));
          const res = await db.insert(farmsSchema).values(farm).returning();

          return res[0] as Farm;
        })
      : []
  );

  res.map((r) => {
    if (r.status === 'rejected') {
      console.error(r.reason);
    } else {
      const { value } = r;
      console.log(`Field synchronized ID = [${value.id}] || Field name = ${value.name}`);
    }
  });
}
