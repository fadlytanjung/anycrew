import fs from 'node:fs';
import path from 'node:path';

export const MARKER = 'anycrew:generated';

export function readIf(p) { try { return fs.readFileSync(p, 'utf8'); } catch { return null; } }
export function exists(p) { try { fs.accessSync(p); return true; } catch { return false; } }
export function mkdirp(p) { fs.mkdirSync(p, { recursive: true }); }

/** Write a generated file. Refuses to overwrite a file that lacks the marker unless force. */
export function writeGenerated(p, content, report, { force = false } = {}) {
  const current = readIf(p);
  if (current !== null && !current.includes(MARKER) && !force) {
    report.skipped.push({ path: p, reason: 'exists and is not anycrew-generated (use --force)' });
    return false;
  }
  if (current === content) { report.unchanged.push(p); return true; }
  mkdirp(path.dirname(p));
  fs.writeFileSync(p, content);
  report.written.push(p);
  return true;
}

/** Write a file only when it does not exist yet (hand-maintained docs). */
export function writeIfMissing(p, content, report) {
  if (exists(p)) { report.unchanged.push(p); return false; }
  mkdirp(path.dirname(p));
  fs.writeFileSync(p, content);
  report.written.push(p);
  return true;
}

export function newReport() { return { written: [], unchanged: [], skipped: [], notes: [] }; }

export function listDir(p) { try { return fs.readdirSync(p, { withFileTypes: true }); } catch { return []; } }
