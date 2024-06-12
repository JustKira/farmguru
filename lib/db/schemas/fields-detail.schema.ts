import { numeric, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

const fieldsDetailSchema = sqliteTable('fieldsDetail', {
  id: text('id').primaryKey(),

  cropType: text('cropType'),
  cropAge: text('cropAge'),

  lastInfoUpdate: text('lastInfoUpdate'),
  lastCropUpdate: text('lastCropUpdate'),
  lastIrrigationUpdate: text('lastIrrigationUpdate'),
  lastScoutUpdate: text('lastScoutUpdate'),

  growthPercentage: text('growthPercentage', { mode: 'json' }),
  nutrientsPercentage: text('nutrientsPercentage', { mode: 'json' }),
  stressPercentage: text('stressPercentage', { mode: 'json' }),

  growthTrend: numeric('growthTrend'),
  nutrientsTrend: numeric('nutrientsTrend'),
  stressTrend: numeric('stressTrend'),
});

const insertFieldDetailSchema = createInsertSchema(fieldsDetailSchema, {
  growthPercentage: z.array(z.number()),
  nutrientsPercentage: z.array(z.number()),
  stressPercentage: z.array(z.number()),
});
interface NewFieldDetail extends z.infer<typeof insertFieldDetailSchema> {}

const selectFieldDetailSchema = createSelectSchema(fieldsDetailSchema, {
  growthPercentage: z.array(z.number()),
  nutrientsPercentage: z.array(z.number()),
  stressPercentage: z.array(z.number()),
});
interface FieldDetail extends z.infer<typeof selectFieldDetailSchema> {}

export {
  fieldsDetailSchema,
  FieldDetail,
  NewFieldDetail,
  selectFieldDetailSchema,
  insertFieldDetailSchema,
};
