// DOM layer for the source browser. All filtering logic lives in filter.js.
import {
  FACETS,
  SORTS,
  activeFilterCount,
  coverageLabel,
  emptyState,
  facetCounts,
  facetValues,
  matches,
  parseState,
  prepare,
  serializeState,
  sortSources,
} from './filter.js';

const REPO = 'https://github.com/sheldon-st/awesome-geospatial-data';
const ICONS = {
  live: '<span class="live-dot" aria-hidden="true"></span>',
  key: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"/><circle cx="16.5" cy="7.5" r=".5" fill="currentColor"/></svg>',
  alert: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>',
  globe: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>',
  building: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/></svg>',
  check: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21.801 10A10 10 0 1 1 17 3.335"/><path d="m9 11 3 3L22 4"/></svg>',
  scale: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="M7 21h10"/><path d="M12 3v18"/><path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/></svg>',
};

/** Tiny element builder: h('a', { href, class: 'x' }, 'text', child). */
function h(tag, attrs = {}, ...children) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v === false || v == null) continue;
    if (k === 'class') el.className = v;
    else if (k === 'html') el.innerHTML = v; // only used with the static ICONS above
    else el.setAttribute(k, v === true ? '' : v);
  }
  el.append(...children.flat().filter((c) => c != null && c !== false));
  return el;
}

const els = {
  q: document.getElementById('q'),
  live: document.getElementById('live'),
  sort: document.getElementById('sort'),
  facets: document.getElementById('facets'),
  filters: document.getElementById('filters'),
  filterCount: document.getElementById('filter-count'),
  list: document.getElementById('list'),
  count: document.getElementById('count'),
  clear: document.getElementById('clear'),
  empty: document.getElementById('empty'),
  emptyClear: document.getElementById('empty-clear'),
};

let sources = [];
let sectionTitles = new Map();
let sectionOrder = [];
let state = parseState(location.search);
const facetInputs = new Map(); // facet key -> Map(value -> { input, count, row })

function valueLabel(facet, value) {
  if (facet.key === 'section') return sectionTitles.get(value) ?? value;
  return facet.labelOf ? facet.labelOf(value) : value;
}

function buildFacets() {
  els.facets.replaceChildren();
  for (const facet of FACETS) {
    const options = new Map();
    const list = h('div', { class: 'facet-options' });
    for (const value of facetValues(sources, facet, sectionOrder)) {
      const input = h('input', { type: 'checkbox', class: 'checkbox', value });
      input.addEventListener('change', () => {
        const set = state.selected[facet.key];
        input.checked ? set.add(value) : set.delete(value);
        update();
      });
      const count = h('span', { class: 'facet-count' });
      const row = h('label', { class: 'facet-option' }, input, h('span', { class: 'facet-label' }, valueLabel(facet, value)), count);
      options.set(value, { input, count, row });
      list.append(row);
    }
    facetInputs.set(facet.key, options);
    const open = !facet.collapsed || state.selected[facet.key].size > 0;
    els.facets.append(h('details', { class: 'facet', open }, h('summary', {}, facet.label), list));
  }
}

function syncFacets() {
  for (const facet of FACETS) {
    const counts = facetCounts(sources, state, facet);
    for (const [value, { input, count, row }] of facetInputs.get(facet.key)) {
      const n = counts.get(value) ?? 0;
      input.checked = state.selected[facet.key].has(value);
      count.textContent = String(n);
      row.classList.toggle('is-empty', n === 0 && !input.checked);
    }
  }
}

function badge(text, variant = 'outline', icon = null, title = null) {
  return h('span', { class: `badge badge-${variant}`, title }, icon ? h('span', { class: 'icon', html: icon }) : null, text);
}

function metaRow(icon, label, ...value) {
  return h(
    'div',
    {},
    h('dt', {}, h('span', { class: 'icon', html: icon }), h('span', { class: 'sr-only' }, label)),
    h('dd', {}, ...value),
  );
}

function card(s) {
  const license = s.license.url
    ? h('a', { href: s.license.url, rel: 'noopener', target: '_blank' }, s.license.name)
    : h('span', {}, s.license.name);
  const licenseNote =
    s.license.status !== 'open'
      ? badge(s.license.status === 'restricted' ? 'Restricted' : 'Unclear terms', 'warning', ICONS.alert, 'Check the terms before reuse')
      : null;

  return h(
    'article',
    { class: 'source-card' },
    h(
      'div',
      { class: 'source-card-top' },
      h('span', { class: 'source-card-section' }, sectionTitles.get(s.section) ?? s.section),
      s.realtime ? h('span', { class: 'live-badge', title: 'Updates at least hourly', html: `${ICONS.live}Live` }) : null,
    ),
    h('h3', {}, h('a', { href: s.url, rel: 'noopener', target: '_blank' }, s.name)),
    h('p', { class: 'source-card-description' }, s.description),
    h(
      'div',
      { class: 'badges' },
      s.coverage.map((c) => badge(coverageLabel(c), 'secondary', ICONS.globe)),
      s.access === 'free-key' ? badge('Free key', 'secondary', ICONS.key, 'A free key or account is required') : null,
      s.interfaces.map((i) => badge(i)),
      s.formats.map((f) => badge(f)),
    ),
    s.notes ? h('details', { class: 'source-card-notes' }, h('summary', {}, 'Notes'), h('p', {}, s.notes)) : null,
    h(
      'dl',
      { class: 'source-card-meta' },
      metaRow(ICONS.building, 'Publisher', s.publisher),
      metaRow(ICONS.scale, 'License', license, licenseNote),
      metaRow(ICONS.check, 'Last verified', `Verified ${s.last_verified}`),
    ),
  );
}

function update({ pushUrl = true } = {}) {
  const visible = sortSources(
    sources.filter((s) => matches(s, state)),
    state.sort,
    sectionOrder,
  );
  els.list.replaceChildren(...visible.map(card));
  els.empty.hidden = visible.length > 0;
  els.count.replaceChildren(
    'Showing ',
    h('strong', {}, String(visible.length)),
    ` of ${sources.length} sources`,
  );

  const active = activeFilterCount(state);
  els.clear.hidden = active === 0 && !state.q;
  els.filterCount.hidden = active === 0;
  els.filterCount.textContent = String(active);
  syncFacets();

  if (pushUrl) history.replaceState(null, '', `${location.pathname}${serializeState(state)}`);
}

function clearAll() {
  const sort = state.sort;
  state = emptyState();
  state.sort = sort;
  els.q.value = '';
  els.live.checked = false;
  update();
}

function initControls() {
  for (const [value, label] of Object.entries(SORTS)) els.sort.append(h('option', { value }, label));
  els.q.value = state.q;
  els.live.checked = state.live;
  els.sort.value = state.sort;

  let timer;
  els.q.addEventListener('input', () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      state.q = els.q.value.trim();
      update();
    }, 120);
  });
  els.live.addEventListener('change', () => {
    state.live = els.live.checked;
    update();
  });
  els.sort.addEventListener('change', () => {
    state.sort = els.sort.value;
    update();
  });
  els.clear.addEventListener('click', clearAll);
  els.emptyClear.addEventListener('click', clearAll);

  document.addEventListener('keydown', (e) => {
    if (e.key === '/' && document.activeElement !== els.q && !e.metaKey && !e.ctrlKey) {
      e.preventDefault();
      els.q.focus();
    }
  });

  // Filters sit in a sidebar on wide screens and collapse behind a button on narrow ones.
  const wide = matchMedia('(min-width: 900px)');
  const syncFilters = () => {
    if (wide.matches) els.filters.open = true;
  };
  wide.addEventListener('change', syncFilters);
  syncFilters();
}

function initTheme() {
  const button = document.getElementById('theme-toggle');
  button.addEventListener('click', () => {
    const dark = document.documentElement.classList.toggle('dark');
    try {
      localStorage.setItem('theme', dark ? 'dark' : 'light');
    } catch {}
  });
}

async function init() {
  initTheme();
  try {
    const res = await fetch('sources.json');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    sectionOrder = data.sections.map((s) => s.id);
    sectionTitles = new Map(data.sections.map((s) => [s.id, s.title]));
    sources = prepare(data);
  } catch (err) {
    els.count.textContent = '';
    els.list.replaceChildren(
      h('p', { class: 'load-error' }, 'Could not load the source list. ', h('a', { href: `${REPO}#readme` }, 'Read it on GitHub instead.')),
    );
    console.error(err);
    return;
  }
  // Drop selections that no longer exist (for example from an old shared link).
  for (const facet of FACETS) {
    const known = new Set(facetValues(sources, facet, sectionOrder));
    for (const v of state.selected[facet.key]) if (!known.has(v)) state.selected[facet.key].delete(v);
  }
  initControls();
  buildFacets();
  update({ pushUrl: false });
}

init();
