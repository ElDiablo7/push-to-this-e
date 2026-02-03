/**
 * Create SQLite DB and run schema. Idempotent.
 */
const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

const dbDir = path.join(__dirname);
const dbPath = path.join(dbDir, 'crew_taxonomy.db');
const schemaPath = path.join(dbDir, 'schema.sql');

const schema = fs.readFileSync(schemaPath, 'utf8');
const db = new Database(dbPath);
db.exec(schema);
db.close();
console.log('DB initialized:', dbPath);
