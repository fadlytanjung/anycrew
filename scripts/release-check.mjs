// Checks that a release tag matches every version field, and whether the version is already on
// npm / PyPI. Prints GitHub Actions outputs: version, on_npm, on_pypi. Usage: node scripts/release-check.mjs v0.1.0
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (f) => fs.readFileSync(path.join(root, f), 'utf8');
const tag = (process.argv[2] ?? '').replace(/^refs\/tags\//, '');
const versions = {
  'package.json': JSON.parse(read('package.json')).version,
  'pyproject.toml': /^version\s*=\s*"([^"]+)"/m.exec(read('pyproject.toml'))?.[1],
  'plugins/claude/.claude-plugin/plugin.json': JSON.parse(read('plugins/claude/.claude-plugin/plugin.json')).version,
  '.claude-plugin/marketplace.json': JSON.parse(read('.claude-plugin/marketplace.json')).plugins[0].version,
  'plugin.json': JSON.parse(read('plugin.json')).version,
};
const version = versions['package.json'];
const mismatched = Object.entries(versions).filter(([, v]) => v !== version);
if (mismatched.length) {
  console.error(`version fields disagree with package.json (${version}): ${mismatched.map(([f, v]) => `${f}=${v}`).join(', ')}. Run: npm run bump -- ${version}`);
  process.exit(1);
}
if (/^v\d/.test(tag) && tag !== `v${version}`) {
  console.error(`tag ${tag} does not match version ${version}`);
  process.exit(1);
}
const onNpm = await fetch(`https://registry.npmjs.org/anycrew/${version}`).then((r) => r.ok).catch(() => false);
const onPypi = await fetch(`https://pypi.org/pypi/anycrew/${version}/json`).then((r) => r.ok).catch(() => false);
console.log(`version=${version}\non_npm=${onNpm}\non_pypi=${onPypi}`);
