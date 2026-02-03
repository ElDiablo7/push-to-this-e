/**
 * Export roles from SQLite to exports/roles.json, roles.csv, roles_by_department.json
 */
const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const dbPath = path.join(root, 'db', 'crew_taxonomy.db');
const exportsDir = path.join(root, 'exports');

if (!fs.existsSync(dbPath)) {
  console.error('DB not found. Run npm run init-db and npm run seed first.');
  process.exit(1);
}

const db = new Database(dbPath, { readonly: true });

const roles = db.prepare(`
  SELECT r.id, r.canonical_name, r.description, r.typical_context, r.department_id,
         d.name AS department_name, d.slug AS department_slug
  FROM roles r
  JOIN departments d ON d.id = r.department_id
  ORDER BY d.name, r.canonical_name
`).all();

function getAliases(roleId) {
  return db.prepare('SELECT alias FROM role_aliases WHERE role_id = ?').all(roleId).map((r) => r.alias);
}
function getTags(roleId) {
  return db.prepare('SELECT tag FROM role_tags WHERE role_id = ?').all(roleId).map((r) => r.tag);
}

const full = roles.map((r) => ({
  id: r.id,
  canonical_name: r.canonical_name,
  description: r.description,
  typical_context: r.typical_context,
  department_name: r.department_name,
  department_slug: r.department_slug,
  aliases: getAliases(r.id),
  tags: getTags(r.id),
}));

const byDepartment = {};
for (const r of full) {
  const slug = r.department_slug;
  if (!byDepartment[slug]) byDepartment[slug] = { name: r.department_name, slug, roles: [] };
  byDepartment[slug].roles.push({
    canonical_name: r.canonical_name,
    description: r.description,
    typical_context: r.typical_context,
    aliases: r.aliases,
    tags: r.tags,
  });
}

const csvEscape = (v) => (v == null ? '' : (String(v).includes(',') || String(v).includes('"') ? `"${String(v).replace(/"/g, '""')}"` : v));
const csvRows = ['department,canonical_name,aliases,tags'];
for (const r of full) {
  csvRows.push([r.department_name, r.canonical_name, (r.aliases || []).join('; '), (r.tags || []).join('; ')].map(csvEscape).join(','));
}

if (!fs.existsSync(exportsDir)) fs.mkdirSync(exportsDir, { recursive: true });

fs.writeFileSync(path.join(exportsDir, 'roles.json'), JSON.stringify(full, null, 2), 'utf8');
fs.writeFileSync(path.join(exportsDir, 'roles_by_department.json'), JSON.stringify(byDepartment, null, 2), 'utf8');
fs.writeFileSync(path.join(exportsDir, 'roles.csv'), csvRows.join('\n'), 'utf8');

db.close();
console.log('Exported:', exportsDir);
console.log('  roles.json, roles.csv, roles_by_department.json');
