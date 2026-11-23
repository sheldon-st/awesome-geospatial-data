#!/usr/bin/env node
// Build the GitHub Pages site into _site/: copies site/ and writes sources.json from data/.
// Preview locally with: pnpm site && pnpm dlx serve _site
import { cpSync, rmSync, writeFileSync } from 'node:fs';
import { loadData, root, siteData, validate } from './lib.mjs';

const out = `${root}_site`;
const data = loadData();
const { errors, warnings } = validate(data);

for (const w of warnings) console.warn(`warning: ${w}`);
if (errors.length > 0) {
  for (const e of errors) console.error(`error: ${e}`);
  console.error('\nFix data/ errors before building the site (pnpm validate).');
  process.exit(1);
}

rmSync(out, { recursive: true, force: true });
cpSync(`${root}site`, out, { recursive: true });
writeFileSync(`${out}/sources.json`, `${JSON.stringify(siteData(data))}\n`);
console.log(`wrote _site/ (${data.sources.length} sources)`);
