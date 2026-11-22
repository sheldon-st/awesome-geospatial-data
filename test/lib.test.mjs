import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { loadData, paths, render, renderContents, renderEntry, slug, validate } from '../scripts/lib.mjs';

const today = new Date('2026-11-22T12:00:00Z');
const sections = [
  { id: 'hazards', title: 'Natural Hazards' },
  { id: 'empty', title: 'Empty Section' },
];

const entry = (overrides = {}) => ({
  id: 'sample-feed',
  name: 'Sample Feed',
  url: 'https://example.org/feed',
  description: 'Worldwide sample events, refreshed every minute.',
  section: 'hazards',
  publisher: 'Example Agency',
  publisher_type: 'government',
  coverage: ['Global'],
  access: 'public',
  license: { name: 'Public domain', status: 'open' },
  interfaces: ['API'],
  formats: ['GeoJSON'],
  realtime: true,
  added: '2026-11-22',
  last_verified: '2026-11-22',
  ...overrides,
});

const check = (sources) => validate({ sections, sources }, { today });

test('repository data is valid', () => {
  const { errors } = validate(loadData(), { today });
  assert.deepEqual(errors, []);
});

test('committed README matches the generator output', () => {
  assert.equal(readFileSync(paths.readme, 'utf8'), render(loadData()));
});

test('valid entry passes', () => {
  assert.deepEqual(check([entry()]), { errors: [], warnings: [] });
});

test('schema errors name the entry', () => {
  const { errors } = check([entry({ access: 'paid' })]);
  assert.equal(errors.length, 1);
  assert.match(errors[0], /^sample-feed\/access:/);
});

test('rejects duplicate ids, urls and names', () => {
  const { errors } = check([
    entry(),
    entry({ url: 'https://EXAMPLE.org/feed/', name: 'Other', id: 'other' }),
    entry({ id: 'third', url: 'https://example.org/x', name: 'sample feed' }),
    entry({ url: 'https://example.org/y', name: 'Fourth' }),
  ]);
  assert.ok(errors.some((e) => e.startsWith('other: duplicate url')));
  assert.ok(errors.some((e) => e.startsWith('third: duplicate name')));
  assert.ok(errors.some((e) => e.startsWith('sample-feed: duplicate id')));
});

test('rejects unknown section and description style problems', () => {
  const { errors } = check([
    entry({ section: 'nope', description: 'sample Feed data with no period at the end' }),
  ]);
  assert.ok(errors.some((e) => e.includes('unknown section')));
  assert.ok(errors.some((e) => e.includes('start with a capital')));
  assert.ok(errors.some((e) => e.includes('end with a period')));
});

test('rejects description that repeats the name', () => {
  const { errors } = check([entry({ description: 'Sample Feed provides worldwide events.' })]);
  assert.ok(errors.some((e) => e.includes('repeat the name')));
});

test('dates: future verification is an error, stale verification a warning', () => {
  assert.ok(check([entry({ last_verified: '2027-01-01' })]).errors.some((e) => e.includes('future')));
  const stale = check([entry({ added: '2025-01-01', last_verified: '2025-01-01' })]);
  assert.deepEqual(stale.errors, []);
  assert.equal(stale.warnings.length, 1);
});

test('entry renders tags in a fixed order inside parentheses', () => {
  const line = renderEntry(
    entry({
      coverage: ['USA'],
      access: 'free-key',
      license: { name: 'CC BY-NC 4.0', status: 'restricted' },
    }),
  );
  assert.equal(
    line,
    '- [Sample Feed](https://example.org/feed) - Worldwide sample events, refreshed every minute. ' +
      '(`USA` `⚡` `🔑` `API` `GeoJSON` `CC BY-NC 4.0` `⚠️`)',
  );
});

test('render skips empty sections, sorts entries and builds contents', () => {
  const template = '# T\n\n## Contents\n\n<!-- contents -->\n\n<!-- sections -->\n\n## Related Lists\n';
  const out = render(
    { sections, sources: [entry({ id: 'b', name: 'beta' }), entry({ id: 'a', name: 'Alpha', url: 'https://a.org' })] },
    template,
  );
  assert.ok(!out.includes('Empty Section'));
  assert.ok(out.indexOf('[Alpha]') < out.indexOf('[beta]'));
  assert.ok(out.includes('- [Natural Hazards](#natural-hazards)'));
  assert.ok(!renderContents(out).includes('Related Lists'));
});

test('slug matches GitHub anchors', () => {
  assert.equal(slug('Aviation, Maritime and Space'), 'aviation-maritime-and-space');
  assert.equal(slug('Air Quality & Environment'), 'air-quality--environment');
});
