#!/usr/bin/env node
// Validate data/sources.yml and data/sections.yml. Exits 1 on errors; staleness is a warning only.
import { loadData, validate } from './lib.mjs';

const data = loadData();
const { errors, warnings } = validate(data);

for (const w of warnings) console.warn(`warning: ${w}`);
for (const e of errors) console.error(`error: ${e}`);

if (errors.length > 0) {
  console.error(`\n${errors.length} error(s) in data/.`);
  process.exit(1);
}
console.log(`ok: ${data.sources.length} sources in ${data.sections.length} sections`);
