// Minimal YAML front matter reader/writer. Supports scalars, quoted strings, inline arrays
// ([a, b]), block lists (- item) and one level of nested maps (key:\n  sub: value). That is all
// anycrew's own files use; it is not a general YAML parser.

export function parse(text) {
  const m = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(text);
  if (!m) return { data: {}, body: text };
  const data = {};
  const lines = m[1].split(/\r?\n/);
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim() || line.trim().startsWith('#')) { i++; continue; }
    const kv = /^([A-Za-z0-9_-]+):\s*(.*)$/.exec(line);
    if (!kv) { i++; continue; }
    const key = kv[1];
    let raw = kv[2].trim();
    if (raw === '' || raw === '|' || raw === '>-' || raw === '>' || raw === '|-') {
      // block: nested map, block list, or folded/literal string
      const block = [];
      i++;
      while (i < lines.length && (/^\s+\S/.test(lines[i]) || lines[i].trim() === '')) { block.push(lines[i]); i++; }
      const nonEmpty = block.filter((l) => l.trim());
      if (raw === '' && nonEmpty.every((l) => /^\s*-\s/.test(l))) {
        data[key] = nonEmpty.map((l) => scalar(l.replace(/^\s*-\s*/, '')));
      } else if (raw === '' && nonEmpty.every((l) => /^\s*[A-Za-z0-9_-]+:\s*/.test(l))) {
        const obj = {};
        for (const l of nonEmpty) { const s = /^\s*([A-Za-z0-9_-]+):\s*(.*)$/.exec(l); obj[s[1]] = scalar(s[2]); }
        data[key] = obj;
      } else {
        const joined = nonEmpty.map((l) => l.trim());
        data[key] = raw.startsWith('|') ? joined.join('\n') : joined.join(' ');
      }
      continue;
    }
    data[key] = scalar(raw);
    i++;
  }
  return { data, body: m[2] };
}

function scalar(raw) {
  raw = raw.trim();
  if (/^\[.*\]$/.test(raw)) {
    const inner = raw.slice(1, -1).trim();
    return inner ? inner.split(',').map((s) => scalar(s)) : [];
  }
  if (/^"(.*)"$/.test(raw)) return raw.slice(1, -1).replace(/\\"/g, '"');
  if (/^'(.*)'$/.test(raw)) return raw.slice(1, -1).replace(/''/g, "'");
  if (raw === 'true') return true;
  if (raw === 'false') return false;
  if (raw === 'null' || raw === '~') return null;
  return raw;
}

export function stringify(data, body = '') {
  const out = ['---'];
  for (const [k, v] of Object.entries(data)) {
    if (v === undefined || v === null || v === '') continue;
    if (Array.isArray(v)) {
      if (v.length === 0) continue;
      out.push(`${k}:`);
      for (const item of v) out.push(`  - ${q(item)}`);
    } else if (typeof v === 'object') {
      out.push(`${k}:`);
      for (const [sk, sv] of Object.entries(v)) out.push(`  ${sk}: ${q(sv)}`);
    } else {
      out.push(`${k}: ${q(v)}`);
    }
  }
  out.push('---');
  return `${out.join('\n')}\n${body.startsWith('\n') ? body.slice(1) : body}`;
}

function q(v) {
  if (typeof v === 'boolean' || typeof v === 'number') return String(v);
  const s = String(v);
  if (/^[A-Za-z0-9_./*-][^:#"'\n]*$/.test(s) && !/\s{2,}/.test(s) && !/^(true|false|null|~)$/.test(s)) return s;
  return JSON.stringify(s);
}
