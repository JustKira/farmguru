import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

const fieldsSchema = sqliteTable('fields', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  farmId: text('farmId'),
  location: text('location', { mode: 'json' }).notNull(),
  position: text('position', { mode: 'json' }).notNull(),
  bounds: text('bounds', { mode: 'json' }).notNull(),
});

const insertFieldSchema = createInsertSchema(fieldsSchema, {
  location: z.array(z.tuple([z.number(), z.number()])),
  bounds: z.tuple([z.tuple([z.number(), z.number()]), z.tuple([z.number(), z.number()])]),
  position: z.array(z.number()).min(2).max(2),
});
interface NewField extends z.infer<typeof insertFieldSchema> {}

const selectFieldSchema = createSelectSchema(fieldsSchema, {
  position: z.array(z.number()).min(2).max(2),
  location: z.array(z.tuple([z.number(), z.number()])),
  bounds: z.tuple([z.tuple([z.number(), z.number()]), z.tuple([z.number(), z.number()])]),
});
interface Field extends z.infer<typeof selectFieldSchema> {}

export { fieldsSchema, Field, NewField, selectFieldSchema, insertFieldSchema };
