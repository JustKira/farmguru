import { drizzle } from 'drizzle-orm/expo-sqlite';
import { openDatabaseSync } from 'expo-sqlite/next';

import * as schema from './schemas';
const expoDb = openDatabaseSync('farmguru.db');

const db = drizzle(expoDb, { schema });

export default db;
