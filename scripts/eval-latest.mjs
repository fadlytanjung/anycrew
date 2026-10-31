// Builds evals/reports/LATEST.md: the most recent result per step across all report folders of a
// suite+runner, with the folder each result came from. Usage: node scripts/eval-latest.mjs [lifecycle] [claude]
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const suite = process.argv[2] ?? 'lifecycle';
const runner = process.argv[3] ?? 'claude';
const dir = path.join(ROOT, 'evals', 'reports');
const runs = fs.readdirSync(dir).filter((d) => d.endsWith(`-${suite}-${runner}`)).sort();
const latest = new Map();
for (const run of runs) {
  const f = path.join(dir, run, 'summary.json');
  if (!fs.existsSync(f)) continue;
  for (const r of JSON.parse(fs.readFileSync(f, 'utf8'))) latest.set(r.id, { ...r, run });
}
const order = JSON.parse(fs.readFileSync(path.join(ROOT, 'evals', 'cases', `${suite}.json`), 'utf8')).steps.map((s) => s.id);
const rows = order.filter((id) => latest.has(id)).map((id) => latest.get(id));
const md = `# Latest eval results · ${suite} · ${runner}

Most recent result per step across ${runs.length} run folder(s). A step re-run after a provider timeout or a usage
limit shows its re-run here; the earlier attempt stays in its own folder for the record.

| Step | Result | Checks | Judge | Cost | Turns | Time | From run | Note |
|---|---|---|---|---|---|---|---|---|
${rows.map((r) => `| ${r.id} | ${r.pass ? '✅' : '❌'} | ${r.checks} | ${r.judge ?? '-'} | ${r.costUsd != null ? '$' + r.costUsd.toFixed(2) : '-'} | ${r.turns ?? '-'} | ${r.seconds}s | ${r.run.slice(0, 19)} | ${(r.pass ? (r.judgeWhy ?? '') : (r.error ?? r.failing?.[0] ?? r.judgeWhy ?? '')).replace(/\|/g, '/').slice(0, 120)} |`).join('\n')}

**${rows.filter((r) => r.pass).length}/${rows.length} steps pass · latest-run cost $${rows.reduce((n, r) => n + (r.costUsd ?? 0), 0).toFixed(2)}**
`;
fs.writeFileSync(path.join(dir, 'LATEST.md'), md);
console.log(md);
