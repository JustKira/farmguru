import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

const fieldsScoutPointsSchema = sqliteTable('fieldsScoutPoints', {
  id: text('id').primaryKey(),
  fieldId: text('fieldId').notNull(),

  isDirty: integer('isDirty', { mode: 'boolean' }).notNull().default(false),
  isNew: integer('isNew', { mode: 'boolean' }).default(false),
  date: integer('date', { mode: 'timestamp' }).notNull(),
  location: text('location', { mode: 'json' }).notNull(),

  severity: text('severity').notNull(),
  category: text('category').notNull(),

  notes: text('notes'),
  reply: text('reply'),

  lastUpdate: text('lastUpdate').notNull(),

  photosKeys: text('photosKeys', { mode: 'json' }),
  voiceNoteKey: text('voiceNoteKey'),
  voiceReplyKey: text('videoKey'),

  photosFiles: text('photosFiles', { mode: 'json' }),
  voiceNoteFile: text('voiceNoteFile'),
  voiceReplyFile: text('voiceReplyFile'),
});

const insertFieldsScoutPointsSchema = createInsertSchema(fieldsScoutPointsSchema, {
  location: z.tuple([z.number(), z.number()]),
  photosKeys: z.array(z.string()),
  photosFiles: z.array(z.string()),
});

interface NewFieldsScoutPoints extends z.infer<typeof insertFieldsScoutPointsSchema> {}

const selectFieldsScoutPointsSchema = createSelectSchema(fieldsScoutPointsSchema, {
  location: z.tuple([z.number(), z.number()]),
  photosKeys: z.array(z.string()),
  photosFiles: z.array(z.string()),
});

interface FieldsScoutPoints extends z.infer<typeof selectFieldsScoutPointsSchema> {}

export {
  fieldsScoutPointsSchema,
  FieldsScoutPoints,
  NewFieldsScoutPoints,
  selectFieldsScoutPointsSchema,
  insertFieldsScoutPointsSchema,
};
