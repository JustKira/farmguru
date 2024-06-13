import { eq } from 'drizzle-orm';

import db from '../db';
import { FieldDetail, NewFieldDetail, fieldsDetailSchema } from '../db/schemas';

export async function synchronizeFieldsDetails(fields: NewFieldDetail) {
  await db.delete(fieldsDetailSchema).where(eq(fieldsDetailSchema.id, fields.id));
  const res = await db.insert(fieldsDetailSchema).values(fields).returning();

  return res[0] as FieldDetail;
}
