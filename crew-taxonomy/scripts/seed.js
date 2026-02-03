/**
 * Load tmp/roles_parsed.json into SQLite. Idempotent: clears and re-seeds.
 */
const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const parsedPath = path.join(root, 'tmp', 'roles_parsed.json');
const dbPath = path.join(root, 'db', 'crew_taxonomy.db');
const schemaPath = path.join(root, 'db', 'schema.sql');

if (!fs.existsSync(parsedPath)) {
  console.error('Run npm run parse first. Missing:', parsedPath);
  process.exit(1);
}

const schema = fs.readFileSync(schemaPath, 'utf8');
const db = new Database(dbPath);

db.exec('PRAGMA foreign_keys = ON');

function ensureSchema() {
  db.exec(schema);
}

function clearData() {
  db.exec('DELETE FROM role_tags');
  db.exec('DELETE FROM role_aliases');
  db.exec('DELETE FROM role_departments');
  db.exec('DELETE FROM role_relationships');
  db.exec('DELETE FROM roles');
  db.exec('DELETE FROM departments');
}

const insertDept = db.prepare(
  'INSERT INTO departments (name, slug, description) VALUES (?, ?, ?)'
);
const insertRole = db.prepare(`
  INSERT INTO roles (department_id, canonical_name, description, is_department_head, typical_context)
  VALUES (?, ?, ?, ?, ?)
`);
const insertAlias = db.prepare(
  'INSERT INTO role_aliases (role_id, alias, region, notes) VALUES (?, ?, NULL, NULL)'
);
const insertTag = db.prepare('INSERT INTO role_tags (role_id, tag) VALUES (?, ?)');

const data = JSON.parse(fs.readFileSync(parsedPath, 'utf8'));

ensureSchema();
clearData();

const deptIds = {};
for (const dept of data) {
  insertDept.run(dept.name, dept.slug, dept.description || null);
  deptIds[dept.slug] = db.prepare('SELECT last_insert_rowid() as id').get().id;
}

for (const dept of data) {
  const departmentId = deptIds[dept.slug];
  for (const role of dept.roles || []) {
    insertRole.run(
      departmentId,
      role.canonical_name,
      role.notes || role.description || null,
      role.is_department_head ? 1 : 0,
      role.typical_context || null
    );
    const roleId = db.prepare('SELECT last_insert_rowid() as id').get().id;
    for (const alt of role.alternates || []) {
      if (alt && alt !== role.canonical_name) insertAlias.run(roleId, alt);
    }
    const tags = [...(role.tags || [])];
    for (const tag of tags) {
      if (tag) insertTag.run(roleId, tag);
    }
  }
}

db.close();
console.log('Seeded:', data.length, 'departments,', data.reduce((n, d) => n + (d.roles?.length || 0), 0), 'roles');
