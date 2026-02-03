/**
 * Express API + static UI for crew taxonomy. Port 3001.
 */
const express = require('express');
const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3001;
const dbPath = path.join(__dirname, 'db', 'crew_taxonomy.db');

function getDb() {
  if (!fs.existsSync(dbPath)) return null;
  return new Database(dbPath, { readonly: true });
}

app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/departments', (req, res) => {
  const db = getDb();
  if (!db) return res.json([]);
  try {
    const rows = db.prepare(
      'SELECT id, name, slug, description FROM departments ORDER BY name'
    ).all();
    res.json(rows);
  } finally {
    db.close();
  }
});

app.get('/api/roles', (req, res) => {
  const db = getDb();
  if (!db) return res.json([]);
  try {
    const { query = '', department = '', tag = '' } = req.query;
    let sql = `
      SELECT r.id, r.canonical_name, r.description, r.is_department_head, r.typical_context,
             r.department_id, d.name AS department_name, d.slug AS department_slug
      FROM roles r
      JOIN departments d ON d.id = r.department_id
      WHERE 1=1
    `;
    const params = {};
    if (query.trim()) {
      sql += ` AND (r.canonical_name LIKE @q OR EXISTS (
        SELECT 1 FROM role_aliases a WHERE a.role_id = r.id AND a.alias LIKE @q
      ))`;
      params.q = `%${query.trim()}%`;
    }
    if (department.trim()) {
      sql += ` AND d.slug = @dept`;
      params.dept = department.trim();
    }
    if (tag.trim()) {
      sql += ` AND EXISTS (
        SELECT 1 FROM role_tags t WHERE t.role_id = r.id AND t.tag = @tag
      )`;
      params.tag = tag.trim();
    }
    sql += ' ORDER BY d.name, r.canonical_name';
    const stmt = db.prepare(sql);
    const rows = Object.keys(params).length ? stmt.all(params) : stmt.all();
    const out = rows.map((row) => {
      const aliases = db.prepare('SELECT alias, region FROM role_aliases WHERE role_id = ?').all(row.id);
      const tags = db.prepare('SELECT tag FROM role_tags WHERE role_id = ?').all(row.id).map((r) => r.tag);
      return {
        id: row.id,
        canonical_name: row.canonical_name,
        description: row.description,
        is_department_head: !!row.is_department_head,
        typical_context: row.typical_context,
        department_id: row.department_id,
        department_name: row.department_name,
        department_slug: row.department_slug,
        aliases: aliases.map((a) => a.alias),
        tags,
      };
    });
    res.json(out);
  } finally {
    db.close();
  }
});

app.get('/api/roles/:id', (req, res) => {
  const db = getDb();
  if (!db) return res.status(404).json({ error: 'Not found' });
  try {
    const row = db.prepare(`
      SELECT r.id, r.canonical_name, r.description, r.is_department_head, r.typical_context,
             r.department_id, d.name AS department_name, d.slug AS department_slug
      FROM roles r
      JOIN departments d ON d.id = r.department_id
      WHERE r.id = ?
    `).get(+req.params.id);
    if (!row) return res.status(404).json({ error: 'Not found' });
    const aliases = db.prepare('SELECT alias, region FROM role_aliases WHERE role_id = ?').all(row.id);
    const tags = db.prepare('SELECT tag FROM role_tags WHERE role_id = ?').all(row.id).map((r) => r.tag);
    res.json({
      id: row.id,
      canonical_name: row.canonical_name,
      description: row.description,
      is_department_head: !!row.is_department_head,
      typical_context: row.typical_context,
      department_id: row.department_id,
      department_name: row.department_name,
      department_slug: row.department_slug,
      aliases: aliases.map((a) => ({ alias: a.alias, region: a.region })),
      tags,
    });
  } finally {
    db.close();
  }
});

app.get('/api/export/json', (req, res) => {
  const exportPath = path.join(__dirname, 'exports', 'roles.json');
  if (fs.existsSync(exportPath)) {
    return res.type('application/json').sendFile(exportPath);
  }
  const db = getDb();
  if (!db) return res.json([]);
  try {
    const roles = db.prepare(`
      SELECT r.id, r.canonical_name, r.description, r.typical_context, d.name AS department_name, d.slug AS department_slug
      FROM roles r
      JOIN departments d ON d.id = r.department_id
      ORDER BY d.name, r.canonical_name
    `).all();
    const out = roles.map((r) => {
      const aliases = db.prepare('SELECT alias FROM role_aliases WHERE role_id = ?').all(r.id).map((a) => a.alias);
      const tags = db.prepare('SELECT tag FROM role_tags WHERE role_id = ?').all(r.id).map((t) => t.tag);
      return { ...r, aliases, tags };
    });
    res.json(out);
  } finally {
    db.close();
  }
});

app.get('/api/export/csv', (req, res) => {
  const exportPath = path.join(__dirname, 'exports', 'roles.csv');
  if (fs.existsSync(exportPath)) {
    return res.type('text/csv').sendFile(exportPath);
  }
  const db = getDb();
  if (!db) return res.type('text/csv').send('department,canonical_name,aliases,tags\n');
  try {
    const roles = db.prepare(`
      SELECT r.canonical_name, d.name AS department_name
      FROM roles r
      JOIN departments d ON d.id = r.department_id
      ORDER BY d.name, r.canonical_name
    `).all();
    const lines = ['department,canonical_name,aliases,tags'];
    for (const r of roles) {
      const aliases = db.prepare('SELECT alias FROM role_aliases WHERE role_id = ?').all(r.id).map((a) => a.alias);
      const tags = db.prepare('SELECT tag FROM role_tags WHERE role_id = ?').all(r.id).map((t) => t.tag);
      const csv = (v) => (v.includes(',') || v.includes('"') ? `"${String(v).replace(/"/g, '""')}"` : v);
      lines.push([r.department_name, r.canonical_name, aliases.join('; '), tags.join('; ')].map(csv).join(','));
    }
    res.type('text/csv').send(lines.join('\n'));
  } finally {
    db.close();
  }
});

app.listen(PORT, () => console.log('Crew taxonomy API on http://localhost:' + PORT));
