import type { Config } from 'drizzle-kit';
export default {
  schema: './lib/db/schemas/index.ts',
  out: './drizzle',
  driver: 'expo',
  dialect: 'sqlite',
} satisfies Config;
