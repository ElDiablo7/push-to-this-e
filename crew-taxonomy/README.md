# Crew Taxonomy

Film crew roles taxonomy builder: ingest a Deep Research file (department + role list with alternates), parse and normalise into canonical departments, roles, aliases, and tags; store in SQLite; expose a REST API and a minimal search/browse UI; export JSON/CSV to `exports/`.

## Stack

- Node.js, Express, SQLite (better-sqlite3), vanilla HTML/CSS/JS. No heavy frontend framework.

## How to run

1. **Install:** `npm install` (on Windows, if `better-sqlite3` fails to build, install [Visual Studio Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/) with "Desktop development with C++" and Windows SDK.)
2. **Input:** Place your Deep Research department + role list in `data/deep_research_roles.txt` (or `data/deep_research_roles.md`). Use the placeholder as a format reference.
3. **Parse:** `npm run parse` — reads the data file and writes `tmp/roles_parsed.json`.
4. **DB:** `npm run init-db` — creates `db/crew_taxonomy.db` and runs the schema (run once, or after schema changes).
5. **Seed:** `npm run seed` — loads `tmp/roles_parsed.json` into SQLite (idempotent: clears and re-seeds).
6. **Start server:** `npm start` — API + UI on **http://localhost:3001**.
7. **Export (optional):** `npm run export` — writes `exports/roles.json`, `exports/roles.csv`, `exports/roles_by_department.json`.

Open the UI in a browser to browse departments, search roles (canonical name or alias), filter by department/tag, and click a role for details. Export endpoints: `GET /api/export/json`, `GET /api/export/csv`.

## Input format

- **Department headings:** `## Department Name`, `# Department Name`, or `1. Department Name`.
- **Roles:** Bullets, numbered lines, or plain lines under a department.
- **Synonyms:** Canonical role on one line, alternates on following indented lines with `-` or `*` (e.g. `Director of Photography` then `  - DP`, `  - DoP`).

## Acceptance tests

1. **Seed from Deep Research:** Run `npm run parse`, then `npm run seed`. The DB is built from the parsed file; re-run is idempotent.
2. **UI loads and shows departments:** Start server with `npm start`, open http://localhost:3001; department dropdown lists all departments.
3. **Search returns canonical role and aliases:** Use the search box; results show canonical name, department, and aliases; clicking a role shows detail (canonical, aliases, tags, notes).
4. **Export produces JSON and CSV:** Run `npm run export` and check `exports/roles.json`, `exports/roles.csv`, `exports/roles_by_department.json`. Or call `GET /api/export/json` and `GET /api/export/csv` (they serve from exports/ if present, or generate on the fly).
5. **De-dup:** Common variants (case, punctuation) merge correctly: same canonical name under the same department = one role; alternates stored in `role_aliases`.

## Project layout

```
crew-taxonomy/
  README.md
  package.json
  data/
    deep_research_roles.txt   # paste Deep Research output here
  db/
    schema.sql
    init.js
    crew_taxonomy.db          # created by init-db
  scripts/
    parse_roles.js
    seed.js
    export.js
  tmp/
    roles_parsed.json         # created by parse
  server.js
  public/
    index.html, app.js, styles.css
  exports/                    # created by export script
```

## API

- `GET /api/departments` — list departments (id, name, slug, description).
- `GET /api/roles?query=...&department=...&tag=...` — search roles; filter by department slug and/or tag.
- `GET /api/roles/:id` — single role with department, aliases, tags.
- `GET /api/export/json` — full export (same shape as `exports/roles.json`).
- `GET /api/export/csv` — CSV download.

## Integration (future)

Exports (e.g. `exports/roles_by_department.json`) can be used to enrich or seed `config/departments.json` or crew-member schemas in the main GRACE-X Film app. This subproject remains standalone.
