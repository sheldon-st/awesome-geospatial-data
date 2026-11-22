import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { parse } from 'yaml';

export const root = fileURLToPath(new URL('..', import.meta.url));
const path = (p) => `${root}${p}`;

export const paths = {
  sections: path('data/sections.yml'),
  sources: path('data/sources.yml'),
  schema: path('schema/source.schema.json'),
  template: path('templates/README.template.md'),
  readme: path('README.md'),
};

export function loadData() {
  return {
    sections: parse(readFileSync(paths.sections, 'utf8')) ?? [],
    sources: parse(readFileSync(paths.sources, 'utf8')) ?? [],
  };
}

const STALE_AFTER_DAYS = 183;

/**
 * Validate sources against the schema plus the rules JSON Schema cannot express.
 * Returns { errors, warnings } as arrays of strings; errors fail CI, warnings do not.
 */
export function validate({ sections, sources }, { today = new Date() } = {}) {
  const errors = [];
  const warnings = [];

  const ajv = new Ajv({ allErrors: true, strict: true });
  addFormats(ajv);
  const schema = JSON.parse(readFileSync(paths.schema, 'utf8'));
  if (!ajv.validate(schema, sources)) {
    for (const e of ajv.errors) {
      const i = Number(e.instancePath.split('/')[1]);
      const label = sources[i]?.id ?? `entry ${i}`;
      errors.push(`${label}${e.instancePath.replace(/^\/\d+/, '')}: ${e.message}`);
    }
    return { errors, warnings };
  }

  const sectionIds = new Set();
  for (const s of sections) {
    if (!s.id || !s.title) errors.push(`sections.yml: every section needs an id and a title`);
    if (sectionIds.has(s.id)) errors.push(`sections.yml: duplicate section id "${s.id}"`);
    sectionIds.add(s.id);
  }

  const seen = { id: new Map(), url: new Map(), name: new Map() };
  for (const src of sources) {
    for (const key of ['id', 'url', 'name']) {
      const value = key === 'url' ? normalizeUrl(src.url) : src[key].toLowerCase();
      if (seen[key].has(value)) errors.push(`${src.id}: duplicate ${key} (also used by ${seen[key].get(value)})`);
      else seen[key].set(value, src.id);
    }

    if (!sectionIds.has(src.section)) errors.push(`${src.id}: unknown section "${src.section}"`);

    const d = src.description;
    if (!/^[A-Z0-9]/.test(d)) errors.push(`${src.id}: description must start with a capital letter or digit`);
    if (!d.endsWith('.')) errors.push(`${src.id}: description must end with a period`);
    if (/\s{2,}/.test(d)) errors.push(`${src.id}: description has repeated whitespace`);
    if (d.toLowerCase().startsWith(src.name.toLowerCase())) {
      errors.push(`${src.id}: description should not repeat the name`);
    }

    if (src.added > src.last_verified) errors.push(`${src.id}: added is after last_verified`);
    const verified = new Date(`${src.last_verified}T00:00:00Z`);
    if (verified > today) errors.push(`${src.id}: last_verified is in the future`);
    const ageDays = (today - verified) / 86_400_000;
    if (ageDays > STALE_AFTER_DAYS) warnings.push(`${src.id}: last verified ${Math.floor(ageDays)} days ago`);
  }

  return { errors, warnings };
}

function normalizeUrl(url) {
  return url.replace(/^https?:\/\//, '').replace(/\/+$/, '').toLowerCase();
}

/** GitHub-style heading anchor. */
export function slug(heading) {
  return heading
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\- ]/gu, '')
    .replace(/ /g, '-');
}

export function tags(src) {
  const t = [...src.coverage];
  if (src.realtime) t.push('⚡');
  if (src.access === 'free-key') t.push('🔑');
  t.push(...src.interfaces, ...src.formats, src.license.name);
  if (src.license.status !== 'open') t.push('⚠️');
  return t.map((x) => `\`${x}\``).join(' ');
}

// Tags sit in parentheses: awesome-lint rejects list items that end in inline code.
export function renderEntry(src) {
  return `- [${src.name}](${src.url}) - ${src.description} (${tags(src)})`;
}

export function renderSections({ sections, sources }) {
  const byName = (a, b) => a.name.localeCompare(b.name, 'en', { sensitivity: 'base' });
  return sections
    .map((section) => {
      const entries = sources.filter((s) => s.section === section.id).sort(byName);
      if (entries.length === 0) return null;
      const intro = section.description ? `${section.description}\n\n` : '';
      return `## ${section.title}\n\n${intro}${entries.map(renderEntry).join('\n')}\n`;
    })
    .filter(Boolean)
    .join('\n');
}

// awesome-lint requires these footer sections to stay out of the table of contents.
const TOC_EXCLUDED = new Set(['Contributing', 'Footnotes', 'Related Lists']);

/** Table of contents built from every `##` heading that follows `## Contents`. */
export function renderContents(markdown) {
  const after = markdown.split(/^## Contents$/m)[1] ?? '';
  return [...after.matchAll(/^## (.+)$/gm)]
    .map(([, h]) => h)
    .filter((h) => !TOC_EXCLUDED.has(h))
    .map((h) => `- [${h}](#${slug(h)})`)
    .join('\n');
}

export function render(data, template = readFileSync(paths.template, 'utf8')) {
  const withSections = template.replace('<!-- sections -->', renderSections(data).trimEnd());
  return withSections.replace('<!-- contents -->', renderContents(withSections));
}
