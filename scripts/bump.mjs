// Sets the same version in every manifest. Usage: npm run bump -- 0.2.0
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const v = process.argv[2];
if (!/^\d+\.\d+\.\d+(-[0-9A-Za-z.]+)?$/.test(v ?? '')) { console.error('usage: npm run bump -- X.Y.Z'); process.exit(2); }
const edit = (f, fn) => { const p = path.join(root, f); fs.writeFileSync(p, fn(fs.readFileSync(p, 'utf8'))); console.log(`  ${f}`); };
const json = (f, fn) => edit(f, (s) => { const j = JSON.parse(s); fn(j); return JSON.stringify(j, null, 2) + '\n'; });
json('package.json', (j) => { j.version = v; });
json('.claude-plugin/marketplace.json', (j) => { j.plugins[0].version = v; });
json('plugin.json', (j) => { j.version = v; });
edit('pyproject.toml', (s) => s.replace(/^version\s*=\s*"[^"]+"/m, `version = "${v}"`));
await import('./build-claude.mjs');
console.log(`\nversion ${v} set. Next: add a "## ${v} — YYYY-MM-DD" section to CHANGELOG.md, commit, then:\n  git tag v${v} && git push origin v${v}`);
