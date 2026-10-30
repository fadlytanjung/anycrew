// Prints the CHANGELOG.md section for a version. Usage: node scripts/release-notes.mjs 0.1.0
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const version = (process.argv[2] ?? '').replace(/^v/, '');
const log = fs.readFileSync(path.join(root, 'CHANGELOG.md'), 'utf8');
const sections = log.split(/^(?=## )/m);
const section = sections.find((s) => s.startsWith(`## ${version}`));
const body = section ? section.replace(/^## [^\n]*\n/, '').trim() : `Release ${version}. See CHANGELOG.md.`;
console.log(`${body}\n\nInstall: \`uvx anycrew init\` (PyPI) or \`npx anycrew init\` (npm).`);
