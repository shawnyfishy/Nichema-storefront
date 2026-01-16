const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');

async function openDb() {
  return open({
    filename: './database.sqlite',
    driver: sqlite3.Database
  });
}

async function initDb() {
  const db = await openDb();
  await db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT,
      category TEXT,
      price REAL,
      weight TEXT,
      volume TEXT,
      badge TEXT,
      description TEXT,
      ingredients TEXT,
      usage TEXT,
      storage TEXT,
      packaging TEXT,
      image TEXT,
      sizes TEXT
    );
  `);
  console.log('Database initialized.');
  return db;
}

module.exports = { openDb, initDb };
