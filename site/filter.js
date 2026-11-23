// Pure search, filter, sort and URL-state logic for the site. No DOM access, so it runs in
// the browser and under `node --test` alike.

export const CONTINENTS = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania', 'Antarctica'];

const PLACE_NAMES = {
  FIN: 'Finland',
  USA: 'United States',
  'GB-ENG': 'England',
};

export function coverageLabel(code) {
  return PLACE_NAMES[code] ?? code;
}

const ACCESS_LABELS = { public: 'No account needed', 'free-key': 'Free key or account' };
const LICENSE_LABELS = { open: 'Open', restricted: 'Restricted', unclear: 'Unclear' };

/** Filter groups shown in the sidebar. `values` returns every value a source has for the group. */
export const FACETS = [
  { key: 'section', label: 'Section', values: (s) => [s.section] },
  { key: 'coverage', label: 'Coverage', values: (s) => s.coverage, labelOf: coverageLabel },
  { key: 'access', label: 'Access', values: (s) => [s.access], labelOf: (v) => ACCESS_LABELS[v] ?? v },
  { key: 'license', label: 'License', values: (s) => [s.license.status], labelOf: (v) => LICENSE_LABELS[v] ?? v },
  { key: 'interface', label: 'Interface', values: (s) => s.interfaces, collapsed: true },
  { key: 'format', label: 'Format', values: (s) => s.formats, collapsed: true },
];

export const SORTS = {
  name: 'Name (A–Z)',
  section: 'Section',
  verified: 'Recently verified',
  added: 'Recently added',
};

const byName = (a, b) => a.name.localeCompare(b.name, 'en', { sensitivity: 'base' });

export function emptyState() {
  return { q: '', live: false, sort: 'name', selected: Object.fromEntries(FACETS.map((f) => [f.key, new Set()])) };
}

/** Lowercased text each search token is matched against. */
export function haystack(source, sectionTitle = '') {
  return [
    source.name,
    source.description,
    source.publisher,
    sectionTitle,
    source.license.name,
    source.update_frequency ?? '',
    source.notes ?? '',
    ...source.coverage,
    ...source.coverage.map(coverageLabel),
    ...source.interfaces,
    ...source.formats,
  ]
    .join(' ')
    .toLowerCase();
}

/** Attach search text once so filtering stays cheap. */
export function prepare(data) {
  const titles = new Map(data.sections.map((s) => [s.id, s.title]));
  return data.sources.map((s) => ({ ...s, _search: haystack(s, titles.get(s.section)) }));
}

/** True when `source` passes every active filter, optionally ignoring one facet group. */
export function matches(source, state, exceptFacet = null) {
  if (state.live && !source.realtime) return false;
  const tokens = state.q.toLowerCase().split(/\s+/).filter(Boolean);
  const text = source._search ?? haystack(source);
  if (!tokens.every((t) => text.includes(t))) return false;
  for (const facet of FACETS) {
    if (facet.key === exceptFacet) continue;
    const wanted = state.selected[facet.key];
    if (wanted.size === 0) continue;
    if (!facet.values(source).some((v) => wanted.has(v))) return false;
  }
  return true;
}

/** Count per value of one facet, applying every other active filter (standard faceted counts). */
export function facetCounts(sources, state, facet) {
  const counts = new Map();
  for (const s of sources) {
    if (!matches(s, state, facet.key)) continue;
    for (const v of new Set(facet.values(s))) counts.set(v, (counts.get(v) ?? 0) + 1);
  }
  return counts;
}

/** Every value a facet can take across all sources, in display order. */
export function facetValues(sources, facet, sectionOrder = []) {
  const all = new Set(sources.flatMap(facet.values));
  if (facet.key === 'section') return sectionOrder.filter((id) => all.has(id));
  const rank = (v) => {
    if (facet.key !== 'coverage') return 0;
    if (v === 'Global') return 0;
    if (CONTINENTS.includes(v)) return 1;
    return 2;
  };
  const label = facet.labelOf ?? ((v) => v);
  return [...all].sort((a, b) => rank(a) - rank(b) || label(a).localeCompare(label(b)));
}

export function sortSources(list, sort, sectionOrder = []) {
  const order = new Map(sectionOrder.map((id, i) => [id, i]));
  const sorted = [...list];
  switch (sort) {
    case 'section':
      return sorted.sort((a, b) => (order.get(a.section) ?? 99) - (order.get(b.section) ?? 99) || byName(a, b));
    case 'verified':
      return sorted.sort((a, b) => b.last_verified.localeCompare(a.last_verified) || byName(a, b));
    case 'added':
      return sorted.sort((a, b) => b.added.localeCompare(a.added) || byName(a, b));
    default:
      return sorted.sort(byName);
  }
}

export function activeFilterCount(state) {
  return FACETS.reduce((n, f) => n + state.selected[f.key].size, 0) + (state.live ? 1 : 0);
}

/** Read state from a query string such as `?q=flood&section=water-oceans,natural-hazards&live=1`. */
export function parseState(search) {
  const params = new URLSearchParams(search);
  const state = emptyState();
  state.q = params.get('q') ?? '';
  state.live = params.get('live') === '1';
  const sort = params.get('sort');
  if (sort && sort in SORTS) state.sort = sort;
  for (const facet of FACETS) {
    const raw = params.get(facet.key);
    if (raw) for (const v of raw.split(',')) if (v) state.selected[facet.key].add(v);
  }
  return state;
}

export function serializeState(state) {
  const params = new URLSearchParams();
  if (state.q) params.set('q', state.q);
  if (state.live) params.set('live', '1');
  if (state.sort !== 'name') params.set('sort', state.sort);
  for (const facet of FACETS) {
    const values = [...state.selected[facet.key]];
    if (values.length) params.set(facet.key, values.join(','));
  }
  const s = params.toString();
  return s ? `?${s}` : '';
}
