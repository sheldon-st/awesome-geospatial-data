import assert from 'node:assert/strict';
import { test } from 'node:test';
import { loadData, siteData } from '../scripts/lib.mjs';
import {
  FACETS,
  emptyState,
  facetCounts,
  facetValues,
  matches,
  parseState,
  prepare,
  serializeState,
  sortSources,
} from '../site/filter.js';

const sections = [
  { id: 'hazards', title: 'Natural Hazards' },
  { id: 'water', title: 'Water and Oceans' },
];

const src = (o) => ({
  section: 'hazards',
  publisher: 'Agency',
  coverage: ['Global'],
  access: 'public',
  license: { name: 'Public domain', status: 'open' },
  interfaces: ['API'],
  formats: ['GeoJSON'],
  realtime: false,
  added: '2026-11-22',
  last_verified: '2026-11-22',
  description: 'Sample description.',
  ...o,
});

const data = {
  sections,
  sources: [
    src({ id: 'quakes', name: 'Quake Feed', realtime: true, formats: ['GeoJSON', 'CSV'] }),
    src({ id: 'gauges', name: 'River Gauges', section: 'water', coverage: ['USA'], access: 'free-key', added: '2026-11-23' }),
    src({ id: 'tides', name: 'tide tables', section: 'water', license: { name: 'X', status: 'unclear' }, notes: 'Datum MLLW.' }),
  ],
};
const sources = prepare(data);
const state = (o = {}) => Object.assign(emptyState(), o);
const names = (list) => list.map((s) => s.id);

test('site data carries every source and section', () => {
  const repo = loadData();
  const out = siteData(repo);
  assert.equal(out.sources.length, repo.sources.length);
  assert.deepEqual(
    out.sections.map((s) => s.id),
    repo.sections.map((s) => s.id),
  );
  for (const s of out.sections) assert.ok(s.title);
});

test('search matches every token across fields, case-insensitively', () => {
  assert.deepEqual(names(sources.filter((s) => matches(s, state({ q: 'river' })))), ['gauges']);
  assert.deepEqual(names(sources.filter((s) => matches(s, state({ q: 'united states' })))), ['gauges']);
  assert.deepEqual(names(sources.filter((s) => matches(s, state({ q: 'csv quake' })))), ['quakes']);
  assert.deepEqual(names(sources.filter((s) => matches(s, state({ q: 'mllw' })))), ['tides']);
  assert.deepEqual(names(sources.filter((s) => matches(s, state({ q: 'water' })))), ['gauges', 'tides']);
});

test('filters: OR within a group, AND across groups, plus live toggle', () => {
  const st = state();
  st.selected.section.add('hazards').add('water');
  st.selected.access.add('public');
  assert.deepEqual(names(sources.filter((s) => matches(s, st))), ['quakes', 'tides']);
  st.live = true;
  assert.deepEqual(names(sources.filter((s) => matches(s, st))), ['quakes']);
});

test('facet counts ignore their own group but apply the others', () => {
  const st = state();
  st.selected.section.add('water');
  const section = FACETS.find((f) => f.key === 'section');
  const access = FACETS.find((f) => f.key === 'access');
  assert.deepEqual(Object.fromEntries(facetCounts(sources, st, section)), { hazards: 1, water: 2 });
  assert.deepEqual(Object.fromEntries(facetCounts(sources, st, access)), { 'free-key': 1, public: 1 });
});

test('facet values follow section order and put Global first', () => {
  const section = FACETS.find((f) => f.key === 'section');
  const coverage = FACETS.find((f) => f.key === 'coverage');
  assert.deepEqual(facetValues(sources, section, ['water', 'hazards']), ['water', 'hazards']);
  assert.deepEqual(facetValues(sources, coverage), ['Global', 'USA']);
});

test('sorting', () => {
  assert.deepEqual(names(sortSources(sources, 'name')), ['quakes', 'gauges', 'tides']);
  assert.deepEqual(names(sortSources(sources, 'section', ['water', 'hazards'])), ['gauges', 'tides', 'quakes']);
  assert.equal(sortSources(sources, 'added')[0].id, 'gauges');
});

test('URL state round-trips and ignores unknown sort values', () => {
  const st = state({ q: 'flood risk', live: true, sort: 'verified' });
  st.selected.section.add('water').add('hazards');
  st.selected.format.add('GeoJSON');
  const qs = serializeState(st);
  const back = parseState(qs);
  assert.equal(back.q, 'flood risk');
  assert.equal(back.live, true);
  assert.equal(back.sort, 'verified');
  assert.deepEqual([...back.selected.section], ['water', 'hazards']);
  assert.deepEqual([...back.selected.format], ['GeoJSON']);
  assert.equal(parseState('?sort=bogus').sort, 'name');
  assert.equal(serializeState(emptyState()), '');
});
