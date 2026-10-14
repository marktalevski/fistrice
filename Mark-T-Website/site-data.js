export const KEY = 'tl-site-v1';
export const LINES = ['up', 'right', 'down'];

let n = 0;
const id = () => 'e' + Date.now().toString(36) + (n++).toString(36) + Math.random().toString(36).slice(2, 5);

function addDays(iso, d) { const t = new Date(iso + 'T12:00:00'); t.setDate(t.getDate() + d); return t.toISOString().slice(0, 10); }
function addMonths(iso, m) { const t = new Date(iso + 'T12:00:00'); t.setMonth(t.getMonth() + m); return t.toISOString().slice(0, 10); }

export function seed() {
  const down = [
    ['Booked the course', 'Zero to hero, the Philippines.', 'Six weeks, one instructor, a lot of open water. Starting with no certification at all.', 'plan'],
    ['Arrival', 'First look at the dive site.', '', 'travel'],
    ['Theory day', 'Breathing, recovery breaths, why you never dive alone.', '', 'theory'],
    ['First static', '1:45 on a single breath, face down in the pool.', '', 'static, pool'],
    ['Duck dives', 'Learning to go down without splashing.', '', 'pool'],
    ['Open water', 'First day on the line.', 'The buoy, the rope, and nothing underneath. Stayed at 5 m mostly, getting used to the blue.', 'line'],
    ['10 m', 'First real depth.', '', 'depth'],
    ['Equalization', 'Ears stopped at 12 m. Two days of working on it.', '', 'technique'],
    ['Frenzel clicks', 'It finally works.', '', 'technique'],
    ['15 m', 'Calm all the way down.', '', 'depth'],
    ['Rest day', 'Nothing in the water.', '', ''],
    ['Static 3:10', 'Contractions start at 2:20. Learning to sit with them.', '', 'static'],
    ['20 m', 'Free fall for the last few meters.', '', 'depth'],
    ['Free immersion, 24 m', 'Pulling down the rope, eyes closed.', '', 'depth, FIM'],
    ['Rescue drills', 'Bringing a blacked-out buddy to the surface.', '', 'safety'],
    ['Certified', 'Last dive of the course.', '', 'milestone'],
  ].map((r, i) => ({ id: id(), line: 'down', title: r[0], short: r[1], body: r[2], tags: r[3], date: addDays('2026-11-02', i * 2 + (i > 5 ? 3 : 0)), image: '', link: '' }));

  const up = [
    ['Poster series', 'Six prints for a friend\u2019s gallery night.', 'print, type'],
    ['Short film edit', 'Cut down from four hours of footage.', 'film'],
    ['Zine no. 1', 'Twenty pages, photocopied, stapled by hand.', 'print'],
    ['Logo for a bakery', '', 'identity'],
    ['Photo walk', 'One roll, one street.', 'photo'],
    ['Type specimen', 'A small display face, still unnamed.', 'type'],
    ['Album cover', '', 'music, print'],
    ['Zine no. 2', 'Water issue.', 'print'],
    ['Animated loop', 'Eight seconds, hand drawn.', 'motion'],
    ['Exhibition', 'Group show, three pieces.', 'show'],
    ['Website', 'This one.', 'web'],
    ['Sketchbook', 'Filled another one.', 'drawing'],
  ].map((r, i) => ({ id: id(), line: 'up', title: r[0], short: r[1], body: '', tags: r[2], date: addMonths('2025-06-10', i), image: '', link: '' }));

  const right = [
    ['Moved flats', '', 'life'],
    ['Book: the deep', 'Notes on a book about freediving.', 'reading'],
    ['Learned to cook rice properly', '', 'kitchen'],
    ['Trip to the coast', '', 'travel'],
    ['Started running', 'Three times a week.', 'body'],
    ['Playlist', 'Songs for long drives.', 'music'],
    ['Birthday', '', 'life'],
    ['New camera', 'Old film camera from a market stall.', 'photo'],
    ['Book: on breath', '', 'reading'],
    ['First swim lesson in years', '', 'body, water'],
    ['Visa sorted', 'For the course.', 'travel'],
    ['Packed', 'One bag.', 'travel'],
  ].map((r, i) => ({ id: id(), line: 'right', title: r[0], short: r[1], body: '', tags: r[2], date: addDays('2026-01-15', i * 24), image: '', link: '' }));

  right[1].body = 'Placeholder for a longer note.\n\nParagraphs are separated by an empty line in the editor.';

  return { profile: { name: 'Your Name', intro: '' }, entries: [...up, ...right, ...down] };
}

export function load() {
  try { const r = localStorage.getItem(KEY); if (r) return JSON.parse(r); } catch (e) {}
  return seed();
}

export function save(data) {
  localStorage.setItem(KEY, JSON.stringify(data));
}

export function newId() { return id(); }
