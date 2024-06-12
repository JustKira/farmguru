import { eq } from 'drizzle-orm';

import db from '../db';
import { Field, NewField, fieldsSchema } from '../db/schemas';

export async function synchronizeFields(fields: NewField[]) {
  const res = await Promise.allSettled(
    fields
      ? fields.map(async (field) => {
          await db.delete(fieldsSchema).where(eq(fieldsSchema.id, field.id));
          const res = await db.insert(fieldsSchema).values(field).returning();

          return res[0] as Field;
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
