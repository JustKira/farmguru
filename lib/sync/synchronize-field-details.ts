import { eq } from 'drizzle-orm';

import db from '../db';
import { FieldDetail, NewFieldDetail, fieldsDetailSchema } from '../db/schemas';

export async function synchronizeFieldsDetails(fields: NewFieldDetail[]) {
  const res = await Promise.allSettled(
    fields
      ? fields.map(async (field) => {
          await db.delete(fieldsDetailSchema).where(eq(fieldsDetailSchema.id, field.id));
          const res = await db.insert(fieldsDetailSchema).values(field).returning();

          return res[0] as FieldDetail;
        })
      : []
  );

  res.map((r) => {
    if (r.status === 'rejected') {
      console.error(r.reason);
    } else {
      const { value } = r;
      console.log(`Field Details synchronized ID = [${value.id}]`);
    }
  });
}
