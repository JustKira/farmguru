import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

const fieldsMapInfoSchema = sqliteTable('fieldsMapInfo', {
  id: text('id').primaryKey(),
  defaultOverlayImgKey: text('defaultOverlayImgKey'),
  defaultOverlayImgPath: text('defaultOverlayImgPath'),

  nitrogenOverlayImgKey: text('nitrogenOverlayImgKey'),
  nitrogenOverlayImgPath: text('nitrogenOverlayImgPath'),

  anomalyOverlayImgKey: text('anomalyOverlayImgKey'),
  anomalyOverlayImgPath: text('anomalyOverlayImgPath'),

  growthOverlayImgKey: text('growthOverlayImgKey'),
  growthOverlayImgPath: text('growthOverlayImgPath'),

  irrigationOverlayImgKey: text('irrigationOverlayImgKey'),
  irrigationOverlayImgPath: text('irrigationOverlayImgPath'),
});

const insertFieldsMapInfoSchema = createInsertSchema(fieldsMapInfoSchema);
interface NewFieldsMapInfo extends z.infer<typeof insertFieldsMapInfoSchema> {}

const selectFieldsMapInfoSchema = createSelectSchema(fieldsMapInfoSchema);
interface FieldsMapInfo extends z.infer<typeof selectFieldsMapInfoSchema> {}

export {
  fieldsMapInfoSchema,
  FieldsMapInfo,
  NewFieldsMapInfo,
  selectFieldsMapInfoSchema,
  insertFieldsMapInfoSchema,
};
