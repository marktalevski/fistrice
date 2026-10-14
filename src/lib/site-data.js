// Journal data. The published entries live in src/data/site.json and every visitor
// sees those. The Editor keeps a working copy in this browser (localStorage) until
// it is exported and saved over site.json.
import published from '../data/site.json';

export const KEY = 'tl-site-v1';
export const LINES = ['up', 'right', 'down'];

let n = 0;
const id = () => 'e' + Date.now().toString(36) + (n++).toString(36) + Math.random().toString(36).slice(2, 5);

const copy = d => JSON.parse(JSON.stringify(d));

// what the site shows
export function load() { return copy(published); }

// the Editor's working copy, or the published entries if there is none yet
export function loadDraft() {
  try { const r = localStorage.getItem(KEY); if (r) return JSON.parse(r); } catch (e) {}
  return copy(published);
}

export function seed() { return copy(published); }

export function save(data) {
  localStorage.setItem(KEY, JSON.stringify(data));
}

export function newId() { return id(); }
