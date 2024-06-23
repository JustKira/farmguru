import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

const fieldIrrigationSchema = sqliteTable('fieldIrrigation', {
  id: text('id').primaryKey(),
  fieldId: text('fieldId').notNull(),

  duration: integer('duration').notNull(),
  date: integer('date', { mode: 'timestamp' }).notNull(),
  createdOn: text('createdOn').notNull(),

  lastUpdate: text('lastUpdate').notNull(),
});

const insertFieldIrrigationSchema = createInsertSchema(fieldIrrigationSchema, {
  duration: z.number().min(1, 'Duration should be at least 1 minute'),
});

interface NewFieldIrrigation extends z.infer<typeof insertFieldIrrigationSchema> {}

const selectFieldIrrigationSchema = createSelectSchema(fieldIrrigationSchema, {
  duration: z.number(),
});

interface FieldIrrigation extends z.infer<typeof selectFieldIrrigationSchema> {}

export {
  fieldIrrigationSchema,
  FieldIrrigation,
  NewFieldIrrigation,
  selectFieldIrrigationSchema,
  insertFieldIrrigationSchema,
};
