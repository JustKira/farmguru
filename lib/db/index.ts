import { ExpoSQLiteDatabase, drizzle } from 'drizzle-orm/expo-sqlite';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import { openDatabaseSync } from 'expo-sqlite/next';

import migrations from '../../drizzle/migrations';

const expoDb = openDatabaseSync('database.db', {
  enableChangeListener: true,
});
const db = drizzle(expoDb);

export const initialize = (): Promise<ExpoSQLiteDatabase> => {
  return Promise.resolve(db);
};
export const useMigrationHelper = () => {
  return useMigrations(db as ExpoSQLiteDatabase, migrations);
};
