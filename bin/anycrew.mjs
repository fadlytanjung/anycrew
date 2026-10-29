#!/usr/bin/env node
import { main } from '../lib/cli.mjs';
main(process.argv.slice(2)).then(
  (code) => process.exit(code ?? 0),
  (err) => { console.error(`anycrew: ${err?.message ?? err}`); process.exit(1); },
);
