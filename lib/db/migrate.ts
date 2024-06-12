import { SQLJsDatabase, drizzle } from 'drizzle-orm/sql-js';
import { migrate } from 'drizzle-orm/sql-js/migrator';
import fs from 'node:fs';
import path from 'node:path';
import initSqlJs from 'sql.js';

export let db: SQLJsDatabase;

const run = async () => {
  const filebuffer = fs.readFileSync(path.resolve('.', 'public/database.sqlite'));
  const SQL = await initSqlJs();
  const sqldb = new SQL.Database(filebuffer);
  const database = drizzle(sqldb);
  db = database;

  migrate(db, { migrationsFolder: path.resolve('.', 'drizzle/migrations') });

  const data = sqldb.export();
  const buffer = Buffer.from(data);
  fs.writeFileSync(path.resolve('.', 'public/database.sqlite'), buffer);
};
run().catch(console.log);
