/**
 * Parse Deep Research roles file -> tmp/roles_parsed.json
 * Handles: ## Dept, 1. Dept, or "Dept" at line start; role lines; synonym blocks (canonical + indented/dashed alternates).
 */
const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '..', 'data');
const outPath = path.join(__dirname, '..', 'tmp', 'roles_parsed.json');

const inputPath = fs.existsSync(path.join(dataDir, 'deep_research_roles.md'))
  ? path.join(dataDir, 'deep_research_roles.md')
  : path.join(dataDir, 'deep_research_roles.txt');

function slug(s) {
  return s
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

function normaliseKey(s) {
  return (s || '')
    .trim()
    .replace(/\s+/g, ' ')
    .toLowerCase();
}

function normaliseDisplay(s) {
  return (s || '').trim().replace(/\s+/g, ' ');
}

const departmentPatterns = [
  /^##\s+(.+)$/,
  /^#\s+(.+)$/,
  /^\d+\.\s+(.+)$/,
  /^([A-Z][A-Za-z\s&]+)$/,
];

function isDepartmentLine(line) {
  const t = line.trim();
  if (!t) return false;
  if (/^##?\s+/.test(t)) return true;
  if (/^\d+\.\s+/.test(t) && !line.startsWith(' ') && !line.startsWith('\t')) return true;
  return false;
}

function getDepartmentTitle(line) {
  const t = line.trim();
  const m = t.match(/^##\s+(.+)$/) || t.match(/^#\s+(.+)$/) || t.match(/^\d+\.\s+(.+)$/);
  if (m) return normaliseDisplay(m[1]);
  return null;
}

function isRoleOrAlternate(line) {
  const t = line.trim();
  if (!t) return false;
  if (t.startsWith('#') && /^#+\s+/.test(t)) return false;
  return true;
}

function isAlternateLine(line) {
  return /^\s+[-*•]\s+/.test(line) || (/^\s{2,}/.test(line) && line.trim().length > 0);
}

function parse(content) {
  const lines = content.split(/\r?\n/);
  const departments = [];
  let currentDept = null;
  let currentRole = null;
  let skipUntilNextDept = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    if (!trimmed && !currentRole) continue;
    if (trimmed.startsWith('# ') && !trimmed.startsWith('## ')) continue;
    if (trimmed.toLowerCase().startsWith('# deep research')) continue;

    if (isDepartmentLine(line) && getDepartmentTitle(line)) {
      const title = getDepartmentTitle(line);
      if (title && title.length > 1) {
        currentDept = {
          name: title,
          slug: slug(title),
          roles: [],
        };
        departments.push(currentDept);
        currentRole = null;
      }
      continue;
    }

    if (!currentDept) continue;

    if (!isRoleOrAlternate(line)) continue;

    if (isAlternateLine(line)) {
      const alt = normaliseDisplay(line.replace(/^\s*[-*•]\s*/, '').trim());
      if (alt && currentRole) {
        if (!currentRole.alternates) currentRole.alternates = [];
        if (currentRole.canonical_name.toLowerCase() !== alt.toLowerCase())
          currentRole.alternates.push(alt);
      } else if (alt && currentDept.roles.length) {
        const last = currentDept.roles[currentDept.roles.length - 1];
        if (!last.alternates) last.alternates = [];
        if (last.canonical_name.toLowerCase() !== alt.toLowerCase()) last.alternates.push(alt);
      }
      continue;
    }

    const asRole = normaliseDisplay(trimmed.replace(/^[-*•]\s*/, '').replace(/^\d+\.\s*/, ''));
    if (!asRole) continue;

    const key = normaliseKey(asRole);
    const existingInDept = currentDept.roles.find((r) => normaliseKey(r.canonical_name) === key);
    if (existingInDept) {
      currentRole = existingInDept;
      continue;
    }

    currentRole = {
      canonical_name: asRole,
      alternates: [],
      tags: [],
      notes: null,
      is_department_head: false,
      typical_context: null,
    };
    currentDept.roles.push(currentRole);
  }

  return departments.filter((d) => d.roles.length > 0 || d.name);
}

function main() {
  if (!fs.existsSync(inputPath)) {
    console.error('Input not found:', inputPath);
    process.exit(1);
  }
  const content = fs.readFileSync(inputPath, 'utf8');
  const departments = parse(content);
  const outDir = path.dirname(outPath);
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(departments, null, 2), 'utf8');
  console.log('Wrote', outPath, '—', departments.length, 'departments');
}

main();
