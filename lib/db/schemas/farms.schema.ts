import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

const farmsSchema = sqliteTable('farms', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  fieldIds: text('location', { mode: 'json' }).notNull(),
});

const insertFarmSchema = createInsertSchema(farmsSchema, {
  fieldIds: z.array(z.string()),
});
interface NewFarm extends z.infer<typeof insertFarmSchema> {}

const selectFarmSchema = createSelectSchema(farmsSchema, {
  fieldIds: z.array(z.string()),
});
interface Farm extends z.infer<typeof selectFarmSchema> {}

export { farmsSchema, Farm, NewFarm, selectFarmSchema, insertFarmSchema };
