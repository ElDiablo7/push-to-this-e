-- Film crew taxonomy schema

CREATE TABLE IF NOT EXISTS departments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  parent_department_id INTEGER REFERENCES departments(id)
);

CREATE TABLE IF NOT EXISTS roles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  department_id INTEGER NOT NULL REFERENCES departments(id),
  canonical_name TEXT NOT NULL,
  description TEXT,
  is_department_head INTEGER NOT NULL DEFAULT 0,
  typical_context TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_roles_canonical_name ON roles(canonical_name);
CREATE INDEX IF NOT EXISTS idx_roles_department_id ON roles(department_id);

CREATE TABLE IF NOT EXISTS role_aliases (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  role_id INTEGER NOT NULL REFERENCES roles(id),
  alias TEXT NOT NULL,
  region TEXT,
  notes TEXT
);
CREATE INDEX IF NOT EXISTS idx_role_aliases_alias ON role_aliases(alias);
CREATE INDEX IF NOT EXISTS idx_role_aliases_role_id ON role_aliases(role_id);

CREATE TABLE IF NOT EXISTS role_tags (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  role_id INTEGER NOT NULL REFERENCES roles(id),
  tag TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_role_tags_tag ON role_tags(tag);
CREATE INDEX IF NOT EXISTS idx_role_tags_role_id ON role_tags(role_id);

CREATE TABLE IF NOT EXISTS role_relationships (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  from_role_id INTEGER NOT NULL REFERENCES roles(id),
  to_role_id INTEGER NOT NULL REFERENCES roles(id),
  relation_type TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS role_departments (
  role_id INTEGER NOT NULL REFERENCES roles(id),
  department_id INTEGER NOT NULL REFERENCES departments(id),
  PRIMARY KEY (role_id, department_id)
);
