#!/usr/bin/env node
// Generate README.md from data/ and templates/README.template.md.
// --check: fail if README.md is out of date instead of writing it (used in CI).
import { readFileSync, writeFileSync } from 'node:fs';
import { loadData, paths, render, validate } from './lib.mjs';

const check = process.argv.includes('--check');
const data = loadData();
const { errors, warnings } = validate(data);

for (const w of warnings) console.warn(`warning: ${w}`);
if (errors.length > 0) {
  for (const e of errors) console.error(`error: ${e}`);
  console.error('\nFix data/ errors before building (pnpm validate).');
  process.exit(1);
}

const next = render(data);

if (check) {
  let current = '';
  try {
    current = readFileSync(paths.readme, 'utf8');
  } catch {}
  if (current !== next) {
    console.error('README.md is out of date. Run `pnpm build` and commit the result.');
    process.exit(1);
  }
  console.log('ok: README.md is up to date');
} else {
  writeFileSync(paths.readme, next);
  console.log(`wrote README.md (${data.sources.length} sources)`);
}
